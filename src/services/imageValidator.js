/**
 * Image Quality and Authenticity Pre-Validator
 * Inspects incoming leaf photos for blurriness, resolution, and plant vegetation signatures
 * prior to running pathology classification models.
 */

export class ImageValidator {
  constructor(options = {}) {
    this.minWidth = options.minWidth || 150;
    this.minHeight = options.minHeight || 150;
    this.blurThreshold = options.blurThreshold || 30.0; // Variance of Laplacian
    this.minVegetationRatio = options.minVegetationRatio || 0.12; // Fraction of pixels with organic/green spectrum
  }

  /**
   * Validate a File object before loading
   */
  validateFile(file) {
    if (!file) {
      return {
        isValid: false,
        errorType: 'missing_file',
        title: 'No Image Provided',
        message: 'Please choose or snap a photograph of a plant leaf to analyze.',
        suggestion: 'Upload a JPEG, PNG, or WebP photo of a plant leaf.'
      };
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpe?g|png|webp|avif)$/i)) {
      return {
        isValid: false,
        errorType: 'unsupported_format',
        title: 'Unsupported File Format',
        message: `The file format (${file.type || 'unknown'}) is not supported.`,
        suggestion: 'Please upload a standard image file in JPG, PNG, or WebP format.'
      };
    }

    const maxSizeBytes = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        errorType: 'file_too_large',
        title: 'Image File Too Large',
        message: `Image size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 15 MB limit.`,
        suggestion: 'Please compress or resize the photograph before uploading.'
      };
    }

    return { isValid: true };
  }

  /**
   * Analyze loaded HTMLImageElement for resolution, blurriness, and vegetation characteristics
   * @param {HTMLImageElement} img 
   * @returns {Promise<Object>} validation result
   */
  async analyzeImageQuality(img) {
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;

    // 1. Resolution Check
    if (width < this.minWidth || height < this.minHeight) {
      return {
        isValid: false,
        errorType: 'low_resolution',
        title: 'Resolution Too Low',
        message: `The image is only ${width}×${height} pixels, which is too small for accurate leaf pathology detection.`,
        suggestion: 'Please take a higher resolution photo (at least 300×300 pixels) focusing closely on the affected leaf.',
        metrics: { width, height, sharpnessScore: 0, vegetationRatio: 0 }
      };
    }

    // Process on offscreen canvas
    const sampleSize = 250;
    const canvas = document.createElement('canvas');
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

    const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
    const data = imgData.data;
    const totalPixels = sampleSize * sampleSize;

    // 2. Compute Grayscale array
    const gray = new Float32Array(totalPixels);
    let totalLuminance = 0;
    let organicVegetationPixels = 0;

    for (let i = 0; i < totalPixels; i++) {
      const offset = i * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      // Grayscale luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      gray[i] = lum;
      totalLuminance += lum;

      // Vegetation chromaticity detection:
      // High green excess or leaf-related necrotic hues (yellows, browns, olives)
      const excessGreen = 2 * g - r - b;
      const isGreenDominant = g > r && g > b;
      const isGoldenBrownLesion = (r > 60 && g > 40 && b < 100 && (r - b) > 30); // rust / lesions
      const isPlantHue = excessGreen > 5 || isGreenDominant || isGoldenBrownLesion;

      if (isPlantHue) {
        organicVegetationPixels++;
      }
    }

    const meanLuminance = totalLuminance / totalPixels;
    const vegetationRatio = organicVegetationPixels / totalPixels;

    // Check for extreme exposure (solid white or pitch black)
    if (meanLuminance < 12) {
      return {
        isValid: false,
        errorType: 'underexposed',
        title: 'Image Too Dark',
        message: 'The photo is heavily underexposed or completely dark. Leaf patterns cannot be distinguished.',
        suggestion: 'Please capture the leaf under natural indirect sunlight or turn on camera lighting.',
        metrics: { width, height, sharpnessScore: 0, vegetationRatio, meanLuminance }
      };
    }

    if (meanLuminance > 248) {
      return {
        isValid: false,
        errorType: 'overexposed',
        title: 'Image Overexposed',
        message: 'The photo is washed out or overexposed with severe glare masking leaf details.',
        suggestion: 'Avoid direct lens glare and ensure leaf surface details are clearly visible.',
        metrics: { width, height, sharpnessScore: 0, vegetationRatio, meanLuminance }
      };
    }

    // 3. Laplacian Variance for Edge Sharpness / Blur Detection
    // 3x3 Laplacian kernel:
    //  0  1  0
    //  1 -4  1
    //  0  1  0
    let laplacianSum = 0;
    let laplacianSqSum = 0;
    let countedEdges = 0;

    for (let y = 1; y < sampleSize - 1; y++) {
      for (let x = 1; x < sampleSize - 1; x++) {
        const idx = y * sampleSize + x;
        const center = gray[idx];
        const top = gray[idx - sampleSize];
        const bottom = gray[idx + sampleSize];
        const left = gray[idx - 1];
        const right = gray[idx + 1];

        const lap = Math.abs(top + bottom + left + right - 4 * center);
        laplacianSum += lap;
        laplacianSqSum += lap * lap;
        countedEdges++;
      }
    }

    const lapMean = laplacianSum / countedEdges;
    const lapVariance = (laplacianSqSum / countedEdges) - (lapMean * lapMean);
    const sharpnessScore = Math.max(0, Math.round(lapVariance * 10) / 10);

    // 4. Evaluate Blurriness
    if (sharpnessScore < this.blurThreshold) {
      return {
        isValid: false,
        errorType: 'blurry',
        title: 'Image Too Blurry or Out-of-Focus',
        message: `Edge sharpness index (${sharpnessScore.toFixed(1)}) is below the diagnostic threshold (${this.blurThreshold}). Fine vein details and lesion margins are indistinguishable.`,
        suggestion: 'Please hold your camera steady, tap to focus directly on the leaf surface, and avoid motion blur.',
        metrics: { width, height, sharpnessScore, vegetationRatio, meanLuminance }
      };
    }

    // 5. Evaluate Vegetation Authenticity (Rejects plain office desks, walls, screenshots)
    if (vegetationRatio < this.minVegetationRatio) {
      return {
        isValid: false,
        errorType: 'non_plant',
        title: 'Invalid Subject: Not a Plant Leaf',
        message: `Only ${(vegetationRatio * 100).toFixed(1)}% of the frame exhibits plant vegetation or leaf pathology signatures.`,
        suggestion: 'Please ensure a single plant leaf fills at least 50% of the frame with a clean background.',
        metrics: { width, height, sharpnessScore, vegetationRatio, meanLuminance }
      };
    }

    // Image Passed Quality Checks
    return {
      isValid: true,
      errorType: null,
      title: 'Image Quality Verified',
      message: 'Resolution, focus, and vegetation characteristics meet diagnostic quality criteria.',
      metrics: {
        width,
        height,
        sharpnessScore,
        vegetationRatio: Math.round(vegetationRatio * 100),
        qualityGrade: sharpnessScore > 90 ? 'Excellent' : sharpnessScore > 50 ? 'Good' : 'Acceptable'
      }
    };
  }

  /**
   * Helper to create a synthetic blurry or non-plant image for testing
   */
  createTestImage(type = 'blurry', sourceImg = null) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (type === 'blurry') {
      if (sourceImg) {
        // Draw with heavy CSS filter blur
        ctx.filter = 'blur(16px)';
        ctx.drawImage(sourceImg, 0, 0, 400, 400);
      } else {
        // Draw green gradients then blur heavily
        const grad = ctx.createLinearGradient(0, 0, 400, 400);
        grad.addColorStop(0, '#2e7d32');
        grad.addColorStop(0.5, '#4caf50');
        grad.addColorStop(1, '#1b5e20');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 400);
        ctx.filter = 'blur(20px)';
        ctx.drawImage(canvas, 0, 0);
      }
    } else if (type === 'non_plant') {
      // Solid slate grey / paper texture with text
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#475569';
      ctx.font = '22px sans-serif';
      ctx.fillText('INVOICE / NON-PLANT DOCUMENT', 30, 150);
      ctx.fillText('Sample Desk Surface', 30, 200);
      ctx.fillRect(30, 230, 340, 20);
    } else if (type === 'low_res') {
      canvas.width = 64;
      canvas.height = 64;
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(20, 20, 24, 24);
    }

    return canvas.toDataURL('image/jpeg', 0.85);
  }
}

export const imageValidator = new ImageValidator();
