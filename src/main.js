/**
 * Crop Disease Detection - Main Application Controller
 */

import { DISEASES_DATABASE, CROPS, EDUCATIONAL_DISCLAIMER } from './data/diseases.js';
import { SAMPLE_IMAGES, ERROR_TEST_CASES } from './data/sampleImages.js';
import { imageValidator } from './services/imageValidator.js';
import { classifierFactory } from './services/classifier/ClassifierFactory.js';
import { HistoryStorage } from './services/historyStorage.js';
import { cameraService } from './services/cameraService.js';
import { soundEffects } from './services/soundEffects.js';

class CropDiseaseApp {
  constructor() {
    this.currentImage = null; // HTMLImageElement
    this.currentImageDataUrl = null;
    this.currentValidation = null;
    this.lastResult = null;
    this.currentMetadata = {};

    this.initElements();
    this.initTheme();
    this.initTabs();
    this.initDropzone();
    this.initCameraModal();
    this.initSampleGallery();
    this.initDiseaseLibrary();
    this.initHistoryPanel();
    this.initModelSelector();
    this.initSoundToggle();
    this.initActionButtons();

    // Re-render Lucide icons
    this.refreshIcons();
  }

  refreshIcons() {
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons();
    }
  }

  initElements() {
    // Navigation
    this.navTabs = document.querySelectorAll('.nav-tab');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.historyBadgeCount = document.getElementById('history-badge-count');

    // Studio & Dropzone
    this.dropzone = document.getElementById('dropzone');
    this.fileInput = document.getElementById('file-input');
    this.dropzoneIdle = document.getElementById('dropzone-idle');
    this.dropzonePreview = document.getElementById('dropzone-preview');
    this.previewImage = document.getElementById('preview-image');
    this.previewFilename = document.getElementById('preview-filename');
    this.previewResolution = document.getElementById('preview-resolution');
    this.scannerBar = document.getElementById('scanner-bar');
    this.scannerGrid = document.getElementById('scanner-grid');
    this.scanningOverlay = document.getElementById('scanning-overlay');
    this.scanStageText = document.getElementById('scan-stage-text');
    this.scanProgressBar = document.getElementById('scan-progress-bar');

    // Quality Card
    this.qualityCard = document.getElementById('quality-card');
    this.qualityStatusBadge = document.getElementById('quality-status-badge');
    this.metricSharpness = document.getElementById('metric-sharpness');
    this.metricVegetation = document.getElementById('metric-vegetation');
    this.metricGrade = document.getElementById('metric-grade');

    // Results states
    this.resultsPanel = document.getElementById('results-panel');
    this.resultsEmpty = document.getElementById('results-empty');
    this.qualityErrorBox = document.getElementById('quality-error-box');
    this.resultsActive = document.getElementById('results-active');
    this.resultsEngineTag = document.getElementById('results-engine-tag');

    // Error details
    this.errorTitle = document.getElementById('error-title');
    this.errorMessage = document.getElementById('error-message');
    this.errorSuggestion = document.getElementById('error-suggestion');
    this.btnErrorRetry = document.getElementById('btn-error-retry');
    this.btnErrorOverride = document.getElementById('btn-error-override');

    // Outcome Card
    this.resCropBadge = document.getElementById('res-crop-badge');
    this.resDiseaseName = document.getElementById('res-disease-name');
    this.resScientific = document.getElementById('res-scientific');
    this.resStatusBadge = document.getElementById('res-status-badge');
    this.resSeverityBadge = document.getElementById('res-severity-badge');
    this.meterStroke = document.getElementById('meter-stroke');
    this.meterScore = document.getElementById('meter-score');
    this.resPathogenInfo = document.getElementById('res-pathogen-info');
    this.candidateList = document.getElementById('candidate-list');
    this.resCertaintyText = document.getElementById('res-certainty-text');

    // Prevention sections
    this.resSymptomsList = document.getElementById('res-symptoms-list');
    this.resCulturalList = document.getElementById('res-cultural-list');
    this.resBiologicalList = document.getElementById('res-biological-list');
    this.resSanitationList = document.getElementById('res-sanitation-list');

    // Buttons
    this.btnBrowseFile = document.getElementById('btn-browse-file');
    this.btnOpenCamera = document.getElementById('btn-open-camera');
    this.btnRetestLeaf = document.getElementById('btn-retest-leaf');
    this.btnClearPreview = document.getElementById('btn-clear-preview');
    this.btnEmptyDemo = document.getElementById('btn-empty-demo');
    this.btnSaveHistory = document.getElementById('btn-save-history');
    this.btnPrintReport = document.getElementById('btn-print-report');
    this.btnNewDiagnosis = document.getElementById('btn-new-diagnosis');

    // Camera Modal
    this.cameraModal = document.getElementById('camera-modal');
    this.cameraVideo = document.getElementById('camera-video');
    this.btnCloseCamera = document.getElementById('btn-close-camera');
    this.btnCameraShutter = document.getElementById('btn-camera-shutter');
    this.btnToggleCameraFacing = document.getElementById('btn-toggle-camera-facing');

    // Theme & Audio
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.themeIcon = document.getElementById('theme-icon');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.soundIcon = document.getElementById('sound-icon');

    // Engine Badge
    this.engineSelectorBtn = document.getElementById('engine-selector-btn');
    this.activeEngineLabel = document.getElementById('active-engine-label');
    this.modelModal = document.getElementById('model-modal');
    this.btnCloseModelModal = document.getElementById('btn-close-model-modal');
    this.modelOptionsContainer = document.getElementById('model-options-container');

    // Quick links
    document.getElementById('link-try-samples')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('samples');
    });
    document.getElementById('link-test-errors')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('samples');
      document.querySelector('.error-lab-card')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------- Theme & Sound ---------------- */
  initTheme() {
    const savedTheme = localStorage.getItem('crop_app_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    this.themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('crop_app_theme', next);
      this.updateThemeIcon(next);
      this.refreshIcons();
    });
  }

  updateThemeIcon(theme) {
    if (this.themeIcon) {
      this.themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    }
  }

  initSoundToggle() {
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = !soundEffects.isMuted();
      soundEffects.setMuted(isMuted);
      this.soundIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
      this.refreshIcons();
    });
  }

  /* ---------------- Navigation Tabs ---------------- */
  initTabs() {
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        this.switchTab(target);
      });
    });
  }

  switchTab(tabId) {
    this.navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    this.tabContents.forEach(c => c.classList.toggle('active', c.id === `tab-${tabId}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.refreshIcons();

    if (tabId === 'history') {
      this.renderHistory();
    }
  }

  /* ---------------- Dropzone & File Handling ---------------- */
  initDropzone() {
    // Open browse dialog
    this.btnBrowseFile.addEventListener('click', () => this.fileInput.click());

    this.fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        this.processFile(file);
      }
    });

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzone.classList.remove('drag-over');
      }, false);
    });

    this.dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files && dt.files[0];
      if (file) {
        this.processFile(file);
      }
    });

    // Preview actions
    this.btnClearPreview.addEventListener('click', () => this.resetStudio());
    this.btnRetestLeaf.addEventListener('click', () => {
      if (this.currentImage) {
        this.runDiagnosticPipeline(this.currentImage, this.currentMetadata);
      }
    });
    this.btnEmptyDemo.addEventListener('click', () => {
      this.loadSampleSpecimen(SAMPLE_IMAGES[0]);
    });
  }

  /**
   * Process a user-selected File
   */
  processFile(file) {
    // 1. Validate file format and size
    const fileValidation = imageValidator.validateFile(file);
    if (!fileValidation.isValid) {
      soundEffects.playWarning();
      this.showQualityError(fileValidation);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this.loadLeafImage(dataUrl, file.name, {});
    };
    reader.readAsDataURL(file);
  }

  /**
   * Load an image (dataURL or URL path) into the studio
   */
  loadLeafImage(src, name = 'leaf-specimen.jpg', metadata = {}) {
    this.currentImageDataUrl = src;
    this.currentMetadata = metadata;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      this.currentImage = img;
      
      // Update preview UI
      this.previewImage.src = src;
      this.previewFilename.textContent = name;
      this.previewResolution.textContent = `${img.naturalWidth}×${img.naturalHeight}px`;

      this.dropzoneIdle.classList.add('hidden');
      this.dropzonePreview.classList.remove('hidden');

      // Kick off validation and classification pipeline
      await this.runDiagnosticPipeline(img, metadata);
    };
    img.onerror = () => {
      this.showQualityError({
        title: 'Image Load Failed',
        message: 'Could not decode or display this photograph.',
        suggestion: 'Please verify the image is not corrupted and try again.'
      });
    };
    img.src = src;
  }

  /**
   * Full Diagnostic Pipeline: Quality Pre-check -> Neural Inference -> Results Rendering
   */
  async runDiagnosticPipeline(img, metadata = {}) {
    // Reset result states
    this.resultsEmpty.classList.add('hidden');
    this.resultsActive.classList.add('hidden');
    this.qualityErrorBox.classList.add('hidden');
    this.qualityCard.classList.remove('hidden');

    // 1. Real Image Quality Pre-check
    const quality = await imageValidator.analyzeImageQuality(img);
    this.currentValidation = quality;

    // Display Quality Metrics
    this.updateQualityMetrics(quality);

    // If image quality check fails (blurry, non-plant, tiny)
    if (!quality.isValid && !metadata.forceOverride) {
      soundEffects.playWarning();
      this.showQualityError(quality);
      return;
    }

    // 2. Image Quality is Verified -> Start Animated Neural Scanner
    this.showScanningState(true);

    try {
      const classifier = classifierFactory.getClassifier();
      this.resultsEngineTag.textContent = classifier.getName();

      // Progressive inference with UI stage updates
      const result = await classifier.predict(img, metadata, ({ stage, progress }) => {
        this.scanStageText.textContent = stage;
        this.scanProgressBar.style.width = `${progress}%`;
      });

      this.lastResult = result;

      // Save thumbnail to result for history
      result.thumbnail = this.createThumbnail(img);

      // Render diagnostic outcomes
      this.renderDiagnosisResults(result);

      // Persist to history
      HistoryStorage.add(result);
      this.updateHistoryBadge();

      // Acoustic chime feedback
      soundEffects.playSuccess();
    } catch (err) {
      console.error('Classification error:', err);
      soundEffects.playWarning();
      this.showQualityError({
        title: 'Diagnostic Engine Error',
        message: err.message || 'An unexpected error occurred during neural inference.',
        suggestion: 'Please try again or select an alternate specimen.'
      });
    } finally {
      this.showScanningState(false);
    }
  }

  showScanningState(isScanning) {
    if (isScanning) {
      this.scannerBar.classList.remove('hidden');
      this.scannerGrid.classList.remove('hidden');
      this.scanningOverlay.classList.remove('hidden');
      this.scanProgressBar.style.width = '10%';
    } else {
      this.scannerBar.classList.add('hidden');
      this.scannerGrid.classList.add('hidden');
      this.scanningOverlay.classList.add('hidden');
    }
  }

  updateQualityMetrics(quality) {
    if (quality.metrics) {
      this.metricSharpness.textContent = quality.metrics.sharpnessScore?.toFixed(1) || '--';
      this.metricVegetation.textContent = quality.metrics.vegetationRatio !== undefined ? `${quality.metrics.vegetationRatio}%` : '--';
      this.metricGrade.textContent = quality.metrics.qualityGrade || (quality.isValid ? 'Acceptable' : 'Low');

      if (quality.isValid) {
        this.qualityStatusBadge.className = 'badge badge-healthy';
        this.qualityStatusBadge.textContent = 'Verified Clear';
      } else {
        this.qualityStatusBadge.className = 'badge badge-severity';
        this.qualityStatusBadge.textContent = 'Quality Issue';
      }
    }
  }

  showQualityError(error) {
    this.resultsEmpty.classList.add('hidden');
    this.resultsActive.classList.add('hidden');
    this.qualityErrorBox.classList.remove('hidden');

    this.errorTitle.textContent = error.title || 'Image Rejected';
    this.errorMessage.textContent = error.message || 'Image does not meet quality requirements.';
    this.errorSuggestion.textContent = error.suggestion || 'Please provide a clear, well-focused leaf photo.';

    this.btnErrorRetry.onclick = () => {
      this.fileInput.click();
    };

    this.btnErrorOverride.onclick = () => {
      if (this.currentImage) {
        this.runDiagnosticPipeline(this.currentImage, { ...this.currentMetadata, forceOverride: true });
      }
    };

    this.refreshIcons();
  }

  /**
   * Render successful diagnostic results onto the UI
   */
  renderDiagnosisResults(result) {
    this.qualityErrorBox.classList.add('hidden');
    this.resultsEmpty.classList.add('hidden');
    this.resultsActive.classList.remove('hidden');

    // Header info
    this.resCropBadge.textContent = result.crop;
    this.resDiseaseName.textContent = result.disease;
    this.resScientific.textContent = result.cropScientific;

    // Badges
    if (result.isHealthy) {
      this.resStatusBadge.className = 'badge badge-healthy';
      this.resStatusBadge.textContent = 'Healthy Foliage';
      this.resSeverityBadge.className = 'badge badge-healthy';
      this.resSeverityBadge.textContent = 'Optimal Plant Health';
    } else {
      this.resStatusBadge.className = 'badge badge-infected';
      this.resStatusBadge.textContent = 'Pathology Detected';
      this.resSeverityBadge.className = `badge badge-severity`;
      this.resSeverityBadge.textContent = result.severity?.label || 'Infection';
    }

    // Circular Confidence Meter Animation
    // Perimeter for r=42 is 2 * PI * 42 = 263.89
    const circumference = 2 * Math.PI * 42;
    const confVal = Math.min(100, Math.max(0, result.confidence));
    const offset = circumference - (confVal / 100) * circumference;

    this.meterStroke.style.strokeDasharray = `${circumference}`;
    this.meterStroke.style.strokeDashoffset = `${circumference}`;
    this.meterScore.textContent = `${confVal.toFixed(1)}%`;

    // Dynamic stroke color based on confidence & status
    if (result.isHealthy) {
      this.meterStroke.style.stroke = 'var(--emerald-400)';
    } else if (confVal > 85) {
      this.meterStroke.style.stroke = 'var(--accent-amber)';
    } else {
      this.meterStroke.style.stroke = 'var(--accent-rose)';
    }

    setTimeout(() => {
      this.meterStroke.style.strokeDashoffset = `${offset}`;
    }, 50);

    // Pathogen Info
    this.resPathogenInfo.innerHTML = `<strong>Pathogen:</strong> ${result.pathogen || 'None detected'}`;

    // Softmax Top Predictions Candidate Breakdown
    this.candidateList.innerHTML = '';
    if (result.topPredictions && result.topPredictions.length) {
      result.topPredictions.forEach(cand => {
        const pct = Math.round(cand.score * 100);
        const item = document.createElement('div');
        item.className = 'cand-item';
        item.innerHTML = `
          <span class="cand-label" title="${cand.label}">${cand.label}</span>
          <div class="cand-bar-wrap">
            <div class="cand-bar-fill" style="width: ${pct}%"></div>
          </div>
          <span class="cand-pct">${pct}%</span>
        `;
        this.candidateList.appendChild(item);
      });
    }

    // Educational Symptoms & Prevention lists
    const details = result.details || DISEASES_DATABASE[result.diseaseId] || {};

    this.populateList(this.resSymptomsList, details.symptoms || ['Balanced chlorophyll pigmentation', 'Uniform leaf blade without fungal spots']);
    this.populateList(this.resCulturalList, details.prevention?.cultural || ['Provide optimal soil moisture without waterlogging', 'Ensure generous sunlight and ventilation']);
    this.populateList(this.resBiologicalList, details.prevention?.biologicalOrganic || ['Routine preventive bio-stimulants', 'Beneficial foliar microflora support']);
    this.populateList(this.resSanitationList, details.prevention?.sanitation || ['Keep gardening tools disinfected', 'Clean fallen dead plant litter']);

    this.refreshIcons();
  }

  populateList(container, items) {
    container.innerHTML = '';
    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      container.appendChild(li);
    });
  }

  createThumbnail(img) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 72;
      canvas.height = 72;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 72, 72);
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (e) {
      return null;
    }
  }

  resetStudio() {
    this.currentImage = null;
    this.currentImageDataUrl = null;
    this.lastResult = null;
    this.currentMetadata = {};

    this.fileInput.value = '';
    this.dropzonePreview.classList.add('hidden');
    this.dropzoneIdle.classList.remove('hidden');
    this.qualityCard.classList.add('hidden');

    this.resultsActive.classList.add('hidden');
    this.qualityErrorBox.classList.add('hidden');
    this.resultsEmpty.classList.remove('hidden');
    this.resultsEngineTag.textContent = 'Awaiting Image';
  }

  /* ---------------- Camera Viewfinder Modal ---------------- */
  initCameraModal() {
    this.btnOpenCamera.addEventListener('click', async () => {
      try {
        this.cameraModal.classList.remove('hidden');
        await cameraService.startStream(this.cameraVideo);
        this.refreshIcons();
      } catch (err) {
        soundEffects.playWarning();
        alert(err.message || 'Unable to open camera on this device.');
        this.cameraModal.classList.add('hidden');
      }
    });

    this.btnCloseCamera.addEventListener('click', () => {
      cameraService.stopStream();
      this.cameraModal.classList.add('hidden');
    });

    this.btnToggleCameraFacing.addEventListener('click', async () => {
      try {
        await cameraService.toggleFacingMode();
      } catch (err) {
        console.warn('Could not flip camera:', err);
      }
    });

    this.btnCameraShutter.addEventListener('click', () => {
      try {
        soundEffects.playShutter();
        const capturedDataUrl = cameraService.captureFrame();
        cameraService.stopStream();
        this.cameraModal.classList.add('hidden');
        this.loadLeafImage(capturedDataUrl, `camera_capture_${Date.now()}.jpg`, {});
      } catch (err) {
        soundEffects.playWarning();
        alert('Could not capture frame from camera.');
      }
    });
  }

  /* ---------------- Tab 2: Sample Gallery & Test Cases ---------------- */
  initSampleGallery() {
    const galleryContainer = document.getElementById('samples-gallery');
    galleryContainer.innerHTML = '';

    SAMPLE_IMAGES.forEach(sample => {
      const card = document.createElement('div');
      card.className = 'sample-card';
      card.innerHTML = `
        <div class="sample-img-wrap">
          <img src="${sample.path}" alt="${sample.title}" loading="lazy" />
          <span class="badge ${sample.diseaseId === 'healthy_tomato' ? 'badge-healthy' : 'badge-severity'} sample-badge-overlay">${sample.badge}</span>
        </div>
        <div class="sample-body">
          <span class="sample-crop-tag">${sample.crop}</span>
          <h4 class="sample-title">${sample.title}</h4>
          <p class="sample-desc">${sample.description}</p>
          <button type="button" class="btn btn-outline btn-sm btn-load-sample">
            <i data-lucide="zap"></i>
            <span>Diagnose Specimen</span>
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        this.loadSampleSpecimen(sample);
      });

      galleryContainer.appendChild(card);
    });

    // Error Test Lab Cards
    const errorCardsContainer = document.getElementById('error-test-cards');
    errorCardsContainer.innerHTML = '';

    ERROR_TEST_CASES.forEach(testCase => {
      const card = document.createElement('div');
      card.className = 'error-test-card';
      card.innerHTML = `
        <div class="error-test-top">
          <h4>${testCase.title}</h4>
          <span class="badge badge-warning">${testCase.badge}</span>
        </div>
        <p>${testCase.description}</p>
        <button type="button" class="btn btn-secondary btn-sm">
          <i data-lucide="alert-triangle"></i>
          <span>Run Error Test</span>
        </button>
      `;

      card.addEventListener('click', () => {
        this.runErrorSimulationTest(testCase.type);
      });

      errorCardsContainer.appendChild(card);
    });
  }

  loadSampleSpecimen(sample) {
    this.switchTab('diagnose');
    this.loadLeafImage(sample.path, `${sample.id}.jpg`, { sampleDiseaseId: sample.diseaseId });
  }

  runErrorSimulationTest(type) {
    this.switchTab('diagnose');
    const testDataUrl = imageValidator.createTestImage(type, this.currentImage);
    this.loadLeafImage(testDataUrl, `simulated_${type}_test.jpg`, {});
  }

  /* ---------------- Tab 3: Disease Library Encyclopedia ---------------- */
  initDiseaseLibrary() {
    const container = document.getElementById('library-cards-container');
    const filterPills = document.querySelectorAll('#library-crop-filters .filter-pill');

    const renderCards = (filter = 'all') => {
      container.innerHTML = '';
      const list = Object.values(DISEASES_DATABASE).filter(d => {
        if (filter === 'all') return true;
        return d.crop.toLowerCase().includes(filter.toLowerCase());
      });

      list.forEach(d => {
        const card = document.createElement('article');
        card.className = 'library-card';
        card.innerHTML = `
          <div class="library-card-header">
            <div>
              <span class="lib-crop-tag">${d.crop}</span>
              <h3 class="lib-disease-title">${d.diseaseName}</h3>
              <p class="lib-scientific">${d.cropScientific}</p>
            </div>
            <span class="badge ${d.isHealthy ? 'badge-healthy' : 'badge-severity'}">${d.severity.label}</span>
          </div>
          <p class="lib-summary">${d.summary}</p>
          
          <h5 class="lib-section-title">Key Symptoms</h5>
          <ul class="lib-list">
            ${d.symptoms.slice(0, 3).map(s => `<li>${s}</li>`).join('')}
          </ul>

          <h5 class="lib-section-title">Core Prevention Measures</h5>
          <ul class="lib-list">
            ${d.prevention.cultural.slice(0, 2).map(c => `<li>${c}</li>`).join('')}
            ${d.prevention.sanitation.slice(0, 1).map(s => `<li>${s}</li>`).join('')}
          </ul>
        `;
        container.appendChild(card);
      });
      this.refreshIcons();
    };

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderCards(pill.dataset.crop);
      });
    });

    renderCards('all');
  }

  /* ---------------- Tab 4: Scan History ---------------- */
  initHistoryPanel() {
    this.renderHistory();
    this.updateHistoryBadge();

    document.getElementById('btn-export-csv').addEventListener('click', () => {
      HistoryStorage.exportCSV();
    });

    document.getElementById('btn-export-json').addEventListener('click', () => {
      HistoryStorage.exportJSON();
    });

    document.getElementById('btn-clear-history').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your entire diagnostic history?')) {
        HistoryStorage.clear();
        this.renderHistory();
        this.updateHistoryBadge();
      }
    });
  }

  renderHistory() {
    const list = HistoryStorage.getAll();
    const container = document.getElementById('history-items-list');
    container.innerHTML = '';

    // Summary stats
    const totalCount = list.length;
    const healthyCount = list.filter(i => i.isHealthy).length;
    const diseasedCount = totalCount - healthyCount;
    const avgConfidence = totalCount > 0 
      ? Math.round(list.reduce((acc, i) => acc + (i.confidence || 0), 0) / totalCount)
      : 0;

    document.getElementById('hist-total-count').textContent = totalCount;
    document.getElementById('hist-healthy-count').textContent = healthyCount;
    document.getElementById('hist-diseased-count').textContent = diseasedCount;
    document.getElementById('hist-avg-confidence').textContent = `${avgConfidence}%`;

    if (totalCount === 0) {
      container.innerHTML = `
        <div class="empty-history-box">
          <i data-lucide="history"></i>
          <h4>No Diagnostic History Recorded</h4>
          <p>Scanned leaf diagnoses will appear here automatically for your records.</p>
        </div>
      `;
      this.refreshIcons();
      return;
    }

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-item-card';
      const timeStr = new Date(item.timestamp).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      card.innerHTML = `
        <div class="history-left">
          ${item.thumbnail ? `<img src="${item.thumbnail}" class="history-thumb" alt="leaf thumbnail" />` : `<div class="history-thumb"></div>`}
          <div class="history-info">
            <h4 class="history-disease-title">${item.crop}: ${item.disease}</h4>
            <span class="history-meta-sub">${timeStr} &bull; ${item.severity}</span>
          </div>
        </div>
        <div class="history-right">
          <span class="history-conf-pill">${(item.confidence || 0).toFixed(1)}%</span>
          <span class="badge ${item.isHealthy ? 'badge-healthy' : 'badge-severity'}">${item.isHealthy ? 'Healthy' : 'Disease'}</span>
          <button type="button" class="btn btn-ghost btn-sm btn-delete-history" title="Delete scan record">
            <i data-lucide="trash"></i>
          </button>
        </div>
      `;

      card.querySelector('.btn-delete-history').addEventListener('click', (e) => {
        e.stopPropagation();
        HistoryStorage.remove(item.id);
        this.renderHistory();
        this.updateHistoryBadge();
      });

      container.appendChild(card);
    });

    this.refreshIcons();
  }

  updateHistoryBadge() {
    const count = HistoryStorage.getAll().length;
    this.historyBadgeCount.textContent = count;
  }

  /* ---------------- Model Selector Modal ---------------- */
  initModelSelector() {
    this.engineSelectorBtn.addEventListener('click', () => {
      this.openModelModal();
    });

    this.btnCloseModelModal.addEventListener('click', () => {
      this.modelModal.classList.add('hidden');
    });

    this.renderModelOptions();
  }

  openModelModal() {
    this.renderModelOptions();
    this.modelModal.classList.remove('hidden');
    this.refreshIcons();
  }

  renderModelOptions() {
    const modes = classifierFactory.getAvailableModes();
    const active = classifierFactory.currentMode;
    this.modelOptionsContainer.innerHTML = '';

    modes.forEach(mode => {
      const item = document.createElement('div');
      item.className = `model-opt-item ${mode.id === active ? 'active' : ''}`;
      item.innerHTML = `
        <div class="model-opt-title">
          <span>${mode.name}</span>
          ${mode.id === active ? '<span class="badge badge-healthy">Active Engine</span>' : ''}
        </div>
        <p class="model-opt-desc">${mode.description}</p>
      `;

      item.addEventListener('click', () => {
        classifierFactory.setMode(mode.id);
        this.activeEngineLabel.textContent = mode.name;
        this.modelModal.classList.add('hidden');
        if (this.currentImage) {
          this.runDiagnosticPipeline(this.currentImage, this.currentMetadata);
        }
      });

      this.modelOptionsContainer.appendChild(item);
    });
  }

  /* ---------------- Action Buttons ---------------- */
  initActionButtons() {
    this.btnSaveHistory.addEventListener('click', () => {
      if (this.lastResult) {
        HistoryStorage.add(this.lastResult);
        this.updateHistoryBadge();
        alert('Diagnosis saved to local history.');
      }
    });

    this.btnPrintReport.addEventListener('click', () => {
      window.print();
    });

    this.btnNewDiagnosis.addEventListener('click', () => {
      this.resetStudio();
      this.fileInput.click();
    });
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.cropDiseaseApp = new CropDiseaseApp();
});
