/**
 * Prediction History Storage Manager
 * Persists recent crop pathology diagnostics to browser localStorage.
 */

const STORAGE_KEY = 'crop_disease_history_v1';
const MAX_HISTORY_ITEMS = 30;

export class HistoryStorage {
  /**
   * Fetch all saved predictions (sorted newest first)
   * @returns {Array<Object>}
   */
  static getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.warn('Failed to read scan history from localStorage:', e);
      return [];
    }
  }

  /**
   * Save a new diagnostic result
   * @param {Object} item
   * @returns {Object} saved item
   */
  static add(item) {
    try {
      const history = this.getAll();
      const record = {
        id: item.id || `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: item.timestamp || new Date().toISOString(),
        crop: item.crop,
        disease: item.disease,
        diseaseId: item.diseaseId,
        confidence: item.confidence,
        isHealthy: item.isHealthy,
        severity: item.severity?.label || (item.isHealthy ? 'Healthy' : 'Moderate'),
        thumbnail: item.thumbnail || null, // compact base64 dataUrl
        inferenceDurationMs: item.inferenceDurationMs || null,
        notes: item.notes || ''
      };

      // Add to front, limit to MAX_HISTORY_ITEMS
      history.unshift(record);
      if (history.length > MAX_HISTORY_ITEMS) {
        history.length = MAX_HISTORY_ITEMS;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      return record;
    } catch (e) {
      console.warn('Failed to save scan record to localStorage:', e);
      return item;
    }
  }

  /**
   * Remove a single record by ID
   */
  static remove(id) {
    try {
      const history = this.getAll().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      return history;
    } catch (e) {
      console.warn('Failed to remove history item:', e);
      return [];
    }
  }

  /**
   * Clear all records
   */
  static clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.warn('Failed to clear history:', e);
      return false;
    }
  }

  /**
   * Export history as formatted JSON
   */
  static exportJSON() {
    const list = this.getAll();
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop_disease_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export history as CSV
   */
  static exportCSV() {
    const list = this.getAll();
    if (list.length === 0) return;

    const headers = ['ID', 'Date', 'Crop', 'Disease', 'Confidence (%)', 'Status', 'Severity'];
    const rows = list.map(item => [
      `"${item.id}"`,
      `"${new Date(item.timestamp).toLocaleString()}"`,
      `"${item.crop}"`,
      `"${item.disease}"`,
      item.confidence,
      item.isHealthy ? '"Healthy"' : '"Infected"',
      `"${item.severity}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop_disease_diagnostics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
