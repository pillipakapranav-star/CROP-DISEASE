import { MockClassifier } from './MockClassifier.js';
import { TensorFlowClassifier } from './TensorFlowClassifier.js';

class ClassifierFactory {
  constructor() {
    this.instances = {
      mock: new MockClassifier(),
      tfjs: new TensorFlowClassifier()
    };
    this.currentMode = 'mock'; // Default to responsive demo classifier
  }

  /**
   * Set active classifier mode: 'mock' | 'tfjs'
   */
  setMode(mode) {
    if (this.instances[mode]) {
      this.currentMode = mode;
      return true;
    }
    throw new Error(`Unknown classifier mode: ${mode}`);
  }

  /**
   * Get active classifier instance
   */
  getClassifier() {
    return this.instances[this.currentMode] || this.instances.mock;
  }

  /**
   * Get list of available classifier engines
   */
  getAvailableModes() {
    return [
      {
        id: 'mock',
        name: 'Demo Neural Heuristic (Default)',
        description: 'Instant client-side model using canvas texture & chromaticity analysis for sample leaves and user photos.',
        isTrained: false
      },
      {
        id: 'tfjs',
        name: 'TensorFlow.js Production Model',
        description: 'Pluggable deep learning adapter for loading real MobileNet / ResNet weights from /model/model.json.',
        isTrained: true
      }
    ];
  }
}

export const classifierFactory = new ClassifierFactory();
