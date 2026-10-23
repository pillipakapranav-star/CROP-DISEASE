/**
 * Abstract Base Classifier Interface
 * Establishes standard interface for leaf pathology inference engines.
 */

export class IClassifier {
  /**
   * Human-readable identifier of this inference provider
   * @returns {string}
   */
  getName() {
    throw new Error('getName() must be implemented');
  }

  /**
   * Engine mode: 'mock' | 'tfjs' | 'api'
   * @returns {string}
   */
  getType() {
    throw new Error('getType() must be implemented');
  }

  /**
   * Pre-load or initialize weights and warm up pipelines
   * @returns {Promise<boolean>}
   */
  async initialize() {
    return true;
  }

  /**
   * Run pathology prediction on an image element or canvas
   * @param {HTMLImageElement | HTMLCanvasElement} imageElement 
   * @param {Object} metadata Optional metadata (e.g., sampleId, userNotes)
   * @returns {Promise<ClassificationResult>}
   */
  async predict(imageElement, metadata = {}) {
    throw new Error('predict() must be implemented');
  }
}

/**
 * Standardized Output Schema
 * @typedef {Object} ClassificationResult
 * @property {string} diseaseId Unique disease key in database
 * @property {string} crop Common name of the crop
 * @property {string} cropScientific Scientific binomial
 * @property {string} disease Common name of the detected pathology or healthy status
 * @property {string} pathogen Microorganism pathogen or 'None'
 * @property {boolean} isHealthy True if plant is healthy
 * @property {number} confidence Probability between 0.0 and 1.0 (e.g. 0.942)
 * @property {Array<{diseaseId: string, label: string, score: number}>} topPredictions
 * @property {Object} details Full educational disease encyclopedia entry
 * @property {number} inferenceDurationMs Time taken in milliseconds
 * @property {string} modelVersion Version of model/heuristics
 */
