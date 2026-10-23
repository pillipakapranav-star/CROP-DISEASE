/**
 * Device Camera Capture Manager
 * Handles camera streaming, facing mode toggle, alignment guides, and high-res frame capture.
 */

export class CameraService {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.facingMode = 'environment'; // Default to rear camera on mobile
    this.isStreaming = false;
  }

  /**
   * Check if camera is supported by the user agent
   */
  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Start camera video stream attached to provided video element
   * @param {HTMLVideoElement} videoElement
   * @returns {Promise<boolean>}
   */
  async startStream(videoElement) {
    if (!this.isSupported()) {
      throw new Error('Camera access is not supported in this browser environment.');
    }

    this.videoElement = videoElement;
    this.stopStream(); // Stop existing stream if any

    const constraints = {
      audio: false,
      video: {
        facingMode: this.facingMode,
        width: { ideal: 1920, min: 640 },
        height: { ideal: 1080, min: 480 }
      }
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();
      this.isStreaming = true;
      return true;
    } catch (err) {
      console.warn('Initial camera constraints failed, attempting fallback:', err);
      try {
        // Fallback without strict resolution constraints
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.videoElement.srcObject = this.stream;
        await this.videoElement.play();
        this.isStreaming = true;
        return true;
      } catch (fallbackErr) {
        this.isStreaming = false;
        throw new Error(`Unable to access camera: ${fallbackErr.message || 'Permission denied or camera busy'}`);
      }
    }
  }

  /**
   * Toggle between front and back camera (if available)
   */
  async toggleFacingMode() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    if (this.videoElement && this.isStreaming) {
      await this.startStream(this.videoElement);
    }
    return this.facingMode;
  }

  /**
   * Capture current high-res frame as dataURL
   * @returns {string} dataURL
   */
  captureFrame() {
    if (!this.videoElement || !this.isStreaming) {
      throw new Error('Camera stream is not active.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth || 640;
    canvas.height = this.videoElement.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    // If using user/front camera, flip horizontally for mirror preview match
    if (this.facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  /**
   * Stop all active video tracks
   */
  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.isStreaming = false;
  }
}

export const cameraService = new CameraService();
