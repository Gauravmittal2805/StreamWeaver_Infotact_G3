import api from './api';

export const fileService = {
  /**
   * Upload a dataset file via multipart stream
   * Endpoint: POST /api/files/upload
   * @param {File} file - Browser File instance
   * @param {Function} onProgress - Progress callback ({ loaded, total, percent, speed })
   * @param {AbortSignal} signal - Abort signal for cancellation
   */
  async uploadFile(file, onProgress, signal) {
    const formData = new FormData();
    formData.append('file', file);

    let lastLoaded = 0;
    let lastTime = Date.now();

    try {
      const response = await api.post('/files/upload', formData, {
        signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const currentTime = Date.now();
          const timeDiff = (currentTime - lastTime) / 1000; // in seconds
          const loadedDiff = progressEvent.loaded - lastLoaded;

          let speed = 0;
          if (timeDiff > 0.1 && loadedDiff > 0) {
            speed = loadedDiff / timeDiff; // bytes per second
            lastLoaded = progressEvent.loaded;
            lastTime = currentTime;
          }

          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;

          if (onProgress) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total || file.size,
              percent,
              speed,
            });
          }
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch list of uploaded datasets
   * Endpoint: GET /api/files
   */
  async getFiles() {
    try {
      const response = await api.get('/files');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch specific dataset metadata
   * Endpoint: GET /api/files/:id
   */
  async getFileById(id) {
    try {
      const response = await api.get(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Health check to test backend connection
   */
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};
