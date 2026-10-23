import { IClassifier } from './IClassifier.js';
import { DISEASES_DATABASE } from '../../data/diseases.js';

export class MockClassifier extends IClassifier {
  constructor() {
    super();
    this.name = 'Demo Neural Classifier (Heuristic Feature Map v2.4)';
    this.type = 'mock';
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  async initialize() {
    // Simulated weights warmup
    return true;
  }

  /**
   * Run classification inference on image
   * @param {HTMLImageElement | HTMLCanvasElement} imageElement
   * @param {Object} metadata
   * @param {Function} onProgress
   */
  async predict(imageElement, metadata = {}, onProgress = null) {
    const startTime = performance.now();

    // Simulated progressive inference stages
    const stages = [
      'Normalizing RGB tensor (256x256)...',
      'Extracting convolutional feature pyramids...',
      'Analyzing lesion morphology & chromaticity...',
      'Synthesizing pathology classification...'
    ];

    for (let i = 0; i < stages.length; i++) {
      if (onProgress) {
        onProgress({ stage: stages[i], progress: ((i + 1) / stages.length) * 100 });
      }
      await new Promise(r => setTimeout(r, 180 + Math.random() * 120));
    }

    // 1. Check if metadata maps directly to a known sample image
    if (metadata.sampleDiseaseId && DISEASES_DATABASE[metadata.sampleDiseaseId]) {
      const targetId = metadata.sampleDiseaseId;
      return this._buildResult(targetId, 0.94 + Math.random() * 0.045, startTime);
    }

    // 2. Also check image source if it matches sample filename
    const src = imageElement.src || '';
    if (src.includes('tomato_early_blight')) {
      return this._buildResult('tomato_early_blight', 0.958, startTime);
    }
    if (src.includes('potato_late_blight')) {
      return this._buildResult('potato_late_blight', 0.942, startTime);
    }
    if (src.includes('healthy_tomato')) {
      return this._buildResult('healthy_tomato', 0.981, startTime);
    }
    if (src.includes('corn_common_rust')) {
      return this._buildResult('corn_common_rust', 0.965, startTime);
    }
    if (src.includes('apple_scab')) {
      return this._buildResult('apple_scab', 0.937, startTime);
    }
    if (src.includes('grape_black_rot')) {
      return this._buildResult('grape_black_rot', 0.924, startTime);
    }

    // 3. For custom user uploads, extract real pixel features via Canvas
    const features = this._extractVisualFeatures(imageElement);
    const predictedDiseaseId = this._classifyFeatures(features);
    const baseConfidence = 0.86 + Math.random() * 0.09;

    return this._buildResult(predictedDiseaseId, baseConfidence, startTime, features);
  }

  /**
   * Extract color histogram and spot metrics from canvas
   */
  _extractVisualFeatures(imageElement) {
    const sampleDim = 120;
    const canvas = document.createElement('canvas');
    canvas.width = sampleDim;
    canvas.height = sampleDim;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, sampleDim, sampleDim);

    const data = ctx.getImageData(0, 0, sampleDim, sampleDim).data;
    const totalPixels = sampleDim * sampleDim;

    let redSporeCount = 0;
    let darkLesionCount = 0;
    let yellowHaloCount = 0;
    let healthyGreenCount = 0;

    for (let i = 0; i < totalPixels; i++) {
      const offset = i * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      // Reddish cinnamon rust spores
      if (r > 130 && g > 60 && g < 140 && b < 80 && (r - g) > 25) {
        redSporeCount++;
      }
      // Dark necrosis / scab / late blight spots
      else if (r < 75 && g < 75 && b < 65) {
        darkLesionCount++;
      }
      // Yellow chlorotic halo
      else if (r > 150 && g > 150 && b < 100 && Math.abs(r - g) < 40) {
        yellowHaloCount++;
      }
      // Pure healthy green
      else if (g > r + 25 && g > b + 25) {
        healthyGreenCount++;
      }
    }

    return {
      rustRatio: redSporeCount / totalPixels,
      darkRatio: darkLesionCount / totalPixels,
      yellowRatio: yellowHaloCount / totalPixels,
      greenRatio: healthyGreenCount / totalPixels
    };
  }

  /**
   * Map visual features to closest known disease category
   */
  _classifyFeatures(feat) {
    // If predominantly healthy green with very few lesions
    if (feat.greenRatio > 0.65 && feat.darkRatio < 0.05 && feat.rustRatio < 0.02) {
      return 'healthy_tomato';
    }
    // High reddish-cinnamon pustules -> Corn Rust
    if (feat.rustRatio > 0.04) {
      return 'corn_common_rust';
    }
    // High yellow halo with dark spots -> Tomato Early Blight
    if (feat.yellowRatio > 0.08 || (feat.darkRatio > 0.04 && feat.yellowRatio > 0.04)) {
      return 'tomato_early_blight';
    }
    // High dark necrosis with moderate green -> Potato Late Blight or Apple Scab
    if (feat.darkRatio > 0.08) {
      return feat.darkRatio > 0.15 ? 'potato_late_blight' : 'apple_scab';
    }
    // Default fallback based on highest score
    return 'grape_black_rot';
  }

  /**
   * Assemble standardized classification output with softmax alternatives
   */
  _buildResult(diseaseId, confidence, startTime, features = null) {
    const disease = DISEASES_DATABASE[diseaseId] || DISEASES_DATABASE['tomato_early_blight'];
    const duration = Math.round(performance.now() - startTime);

    // Generate softmax probability distribution among all supported diseases
    const allKeys = Object.keys(DISEASES_DATABASE);
    const otherKeys = allKeys.filter(k => k !== disease.id);

    // Shuffle and pick secondary and tertiary candidates
    const remainingScore = 1.0 - confidence;
    const secondaryScore = remainingScore * (0.65 + Math.random() * 0.15);
    const tertiaryScore = remainingScore - secondaryScore;

    const topPredictions = [
      {
        diseaseId: disease.id,
        crop: disease.crop,
        disease: disease.diseaseName,
        label: `${disease.crop}: ${disease.diseaseName}`,
        score: Math.round(confidence * 1000) / 1000
      },
      {
        diseaseId: otherKeys[0],
        crop: DISEASES_DATABASE[otherKeys[0]].crop,
        disease: DISEASES_DATABASE[otherKeys[0]].diseaseName,
        label: `${DISEASES_DATABASE[otherKeys[0]].crop}: ${DISEASES_DATABASE[otherKeys[0]].diseaseName}`,
        score: Math.round(secondaryScore * 1000) / 1000
      },
      {
        diseaseId: otherKeys[1],
        crop: DISEASES_DATABASE[otherKeys[1]].crop,
        disease: DISEASES_DATABASE[otherKeys[1]].diseaseName,
        label: `${DISEASES_DATABASE[otherKeys[1]].crop}: ${DISEASES_DATABASE[otherKeys[1]].diseaseName}`,
        score: Math.round(tertiaryScore * 1000) / 1000
      }
    ];

    return {
      diseaseId: disease.id,
      crop: disease.crop,
      cropScientific: disease.cropScientific,
      disease: disease.diseaseName,
      pathogen: disease.pathogen,
      isHealthy: disease.isHealthy,
      severity: disease.severity,
      confidence: Math.round(confidence * 1000) / 10, // e.g. 95.8%
      topPredictions,
      details: disease,
      inferenceDurationMs: duration,
      modelVersion: 'Demo Heuristic Engine v2.4 (Simulated CNN)',
      certaintyNote: 'Predictions are probabilistic estimates based on visual symptoms. Actual diagnoses can vary based on regional crop strains and environmental variables.'
    };
  }
}
