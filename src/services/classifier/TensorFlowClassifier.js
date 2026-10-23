import { IClassifier } from './IClassifier.js';
import { DISEASES_DATABASE } from '../../data/diseases.js';

/**
 * TensorFlow.js Classifier Adapter
 * Demonstrates clean architecture for deploying a trained deep learning model
 * (e.g., MobileNetV2, ResNet50, or PlantVillage custom CNN).
 * 
 * To activate a live TF.js model:
 * 1. Install @tensorflow/tfjs (`npm install @tensorflow/tfjs`)
 * 2. Place your exported model.json and group*.bin files in `/public/model/`
 * 3. Set `isModelLoaded = true` and call `tf.loadLayersModel('/model/model.json')`
 */
export class TensorFlowClassifier extends IClassifier {
  constructor(modelPath = '/model/model.json') {
    super();
    this.name = 'TensorFlow.js Plant Pathology Network (MobileNetV2)';
    this.type = 'tfjs';
    this.modelPath = modelPath;
    this.model = null;
    this.isReady = false;
    this.labels = [
      'apple_scab',
      'corn_common_rust',
      'grape_black_rot',
      'potato_late_blight',
      'tomato_early_blight',
      'healthy_tomato'
    ];
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  /**
   * Initializes the TFJS backend and loads the neural model weights
   */
  async initialize() {
    try {
      // In environments with window.tf installed:
      if (typeof window !== 'undefined' && window.tf) {
        console.info(`[TF.js] Attempting to load neural model from ${this.modelPath}`);
        this.model = await window.tf.loadLayersModel(this.modelPath);
        this.isReady = true;
        return true;
      } else {
        console.warn('[TF.js] @tensorflow/tfjs runtime not loaded globally. Ready for integration.');
        return false;
      }
    } catch (err) {
      console.warn(`[TF.js] Could not load model from ${this.modelPath}. Falling back to clean mock handler.`, err.message);
      return false;
    }
  }

  /**
   * Run inference with real or fallback neural pipeline
   */
  async predict(imageElement, metadata = {}, onProgress = null) {
    const startTime = performance.now();

    if (this.model && window.tf) {
      if (onProgress) onProgress({ stage: 'Preprocessing tensor image...', progress: 30 });

      // Clean TFJS preprocessing pipeline:
      const tensor = window.tf.tidy(() => {
        return window.tf.browser.fromPixels(imageElement)
          .resizeBilinear([224, 224])
          .toFloat()
          .div(127.5)
          .sub(1.0)
          .expandDims(0);
      });

      if (onProgress) onProgress({ stage: 'Executing forward pass on GPU/WASM...', progress: 70 });
      const predictionTensor = await this.model.predict(tensor);
      const probabilities = await predictionTensor.data();
      tensor.dispose();
      predictionTensor.dispose();

      // Find top class
      let maxIdx = 0;
      let maxProb = 0;
      for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
          maxProb = probabilities[i];
          maxIdx = i;
        }
      }

      const diseaseKey = this.labels[maxIdx] || 'tomato_early_blight';
      const disease = DISEASES_DATABASE[diseaseKey] || DISEASES_DATABASE['tomato_early_blight'];

      return {
        diseaseId: disease.id,
        crop: disease.crop,
        cropScientific: disease.cropScientific,
        disease: disease.diseaseName,
        pathogen: disease.pathogen,
        isHealthy: disease.isHealthy,
        severity: disease.severity,
        confidence: Math.round(maxProb * 1000) / 10,
        topPredictions: this.labels.map((lbl, idx) => ({
          diseaseId: lbl,
          label: `${DISEASES_DATABASE[lbl]?.crop || lbl}: ${DISEASES_DATABASE[lbl]?.diseaseName || lbl}`,
          score: Math.round(probabilities[idx] * 1000) / 1000
        })).sort((a, b) => b.score - a.score).slice(0, 3),
        details: disease,
        inferenceDurationMs: Math.round(performance.now() - startTime),
        modelVersion: 'TensorFlow.js Production Graph v1.0',
        certaintyNote: 'Trained CNN inference. Performance depends on resolution, lighting, and similarity to training distribution.'
      };
    } else {
      // Clean fallback if weights are not yet dropped into /public/model/
      console.info('[TF.js Adapter] No model weights found at /model/model.json. Delegating to demo neural classifier.');
      const { MockClassifier } = await import('./MockClassifier.js');
      const fallback = new MockClassifier();
      return fallback.predict(imageElement, metadata, onProgress);
    }
  }
}
