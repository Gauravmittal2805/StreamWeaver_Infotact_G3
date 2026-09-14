import { useState, useRef, useCallback } from 'react';
import { fileService } from '../services/fileService';

const ALLOWED_EXTENSIONS = ['csv', 'json'];
const DISALLOWED_EXTENSIONS = ['exe', 'zip', 'js', 'xlsx', 'pdf', 'tar', 'gz', 'sh', 'bat', 'html', 'py'];

export function useFileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'selected' | 'uploading' | 'completed' | 'error'
  const [progress, setProgress] = useState({
    loaded: 0,
    total: 0,
    percent: 0,
    speed: 0,
    eta: 0,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);

  const abortControllerRef = useRef(null);
  const simulationTimerRef = useRef(null);

  /**
   * Validate file extension and size
   */
  const validateFile = useCallback((selectedFile) => {
    if (!selectedFile) {
      return { isValid: false, error: 'No file selected. Please choose a dataset file.' };
    }

    if (selectedFile.size === 0) {
      return { isValid: false, error: 'The selected file is empty (0 Bytes). Please upload a valid CSV or JSON dataset.' };
    }

    const name = selectedFile.name || '';
    const extension = name.split('.').pop()?.toLowerCase();

    if (DISALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: `Files with .${extension} extension are not supported for security and pipeline processing. Please upload a CSV or JSON dataset.`,
      };
    }

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: 'Unsupported file type. Please upload a CSV or JSON dataset.',
      };
    }

    return { isValid: true, error: null };
  }, []);

  /**
   * Select a file
   */
  const selectFile = useCallback((incomingFile) => {
    if (status === 'uploading') return;

    if (!incomingFile) {
      return;
    }

    const validation = validateFile(incomingFile);
    if (!validation.isValid) {
      setError({ message: validation.error, code: 'INVALID_FILE_TYPE' });
      setStatus('error');
      setFile(incomingFile);
      return;
    }

    setError(null);
    setResult(null);
    setFile(incomingFile);
    setProgress({
      loaded: 0,
      total: incomingFile.size,
      percent: 0,
      speed: 0,
      eta: 0,
    });
    setStatus('selected');
  }, [status, validateFile]);

  /**
   * Clear file selection
   */
  const removeFile = useCallback(() => {
    if (status === 'uploading' && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }
    setFile(null);
    setStatus('idle');
    setProgress({ loaded: 0, total: 0, percent: 0, speed: 0, eta: 0 });
    setError(null);
    setResult(null);
  }, [status]);

  /**
   * Simulate streaming upload if standalone mode is enabled or backend is unreachable
   */
  const simulateUpload = useCallback((uploadFileObj) => {
    setIsSimulated(true);
    setStatus('uploading');
    setError(null);

    const totalSize = uploadFileObj.size;
    let currentLoaded = 0;
    const chunkSize = Math.max(1024 * 1024 * 2, Math.floor(totalSize / 25)); // simulate chunk transfer
    const startTime = Date.now();

    simulationTimerRef.current = setInterval(() => {
      currentLoaded = Math.min(totalSize, currentLoaded + chunkSize);
      const elapsedSec = (Date.now() - startTime) / 1000;
      const speed = elapsedSec > 0 ? currentLoaded / elapsedSec : 0;
      const percent = Math.round((currentLoaded / totalSize) * 100);
      const remainingBytes = totalSize - currentLoaded;
      const eta = speed > 0 ? Math.ceil(remainingBytes / speed) : 0;

      setProgress({
        loaded: currentLoaded,
        total: totalSize,
        percent,
        speed,
        eta,
      });

      if (currentLoaded >= totalSize) {
        clearInterval(simulationTimerRef.current);
        const datasetId = `ds_${Math.random().toString(36).substring(2, 10)}`;
        setResult({
          datasetId,
          filename: uploadFileObj.name,
          size: uploadFileObj.size,
          format: uploadFileObj.name.endsWith('.json') ? 'JSON' : 'CSV',
          uploadedAt: new Date().toISOString(),
          simulated: true,
        });
        setStatus('completed');
      }
    }, 120);
  }, []);

  /**
   * Start the streaming upload
   */
  const startUpload = useCallback(async (forceSimulate = false) => {
    if (!file) {
      setError({ message: 'Please select a CSV or JSON file before uploading.', code: 'NO_FILE' });
      setStatus('error');
      return;
    }

    if (forceSimulate) {
      simulateUpload(file);
      return;
    }

    setStatus('uploading');
    setError(null);
    setIsSimulated(false);
    abortControllerRef.current = new AbortController();

    const startTime = Date.now();

    try {
      const response = await fileService.uploadFile(
        file,
        ({ loaded, total, percent, speed }) => {
          const elapsedSec = (Date.now() - startTime) / 1000;
          const currentSpeed = speed || (elapsedSec > 0 ? loaded / elapsedSec : 0);
          const remainingBytes = (total || file.size) - loaded;
          const eta = currentSpeed > 0 ? Math.ceil(remainingBytes / currentSpeed) : 0;

          setProgress({
            loaded,
            total: total || file.size,
            percent,
            speed: currentSpeed,
            eta,
          });
        },
        abortControllerRef.current.signal
      );

      setResult({
        datasetId: response.datasetId || response.fileId || `ds_${Math.random().toString(36).substring(2, 10)}`,
        filename: file.name,
        size: file.size,
        format: file.name.endsWith('.json') ? 'JSON' : 'CSV',
        uploadedAt: new Date().toISOString(),
        ...response,
      });
      setStatus('completed');
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        setStatus('selected');
        setError({ message: 'Upload was cancelled by user.', code: 'CANCELLED' });
      } else if (err.code === 'BACKEND_UNAVAILABLE') {
        // Fallback option: give user clear error and ability to simulate standalone
        setError({
          message: 'Unable to connect to StreamWeaver server at /api/files/upload (Backend may not be running yet). You can run standalone simulation or start backend.',
          code: 'BACKEND_UNAVAILABLE',
        });
        setStatus('error');
      } else {
        setError({
          message: err.message || 'Dataset upload failed. Please try again.',
          code: err.code || 'UPLOAD_FAILED',
        });
        setStatus('error');
      }
    }
  }, [file, simulateUpload]);

  /**
   * Cancel ongoing upload
   */
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }
    setStatus('selected');
    setProgress((prev) => ({ ...prev, percent: 0, loaded: 0, speed: 0, eta: 0 }));
  }, []);

  return {
    file,
    status,
    progress,
    result,
    error,
    isSimulated,
    selectFile,
    removeFile,
    startUpload,
    cancelUpload,
    reset: removeFile,
  };
}
