const path = require('path');

/**
 * Allowed file formats for upload
 */
const ALLOWED_FORMATS = ['.csv', '.json'];

/**
 * Maximum file size (5GB in bytes)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;

/**
 * Validate file extension
 * @param {string} filename - Original filename
 * @returns {boolean} - True if valid
 */
const isValidFileFormat = (filename) => {
  if (!filename) return false;
  
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_FORMATS.includes(ext);
};

/**
 * Get file format from filename
 * @param {string} filename - Original filename
 * @returns {string} - File format (csv, json)
 */
const getFileFormat = (filename) => {
  if (!filename) return null;
  
  const ext = path.extname(filename).toLowerCase();
  return ext.slice(1); // Remove the dot
};

/**
 * Sanitize filename - remove dangerous characters
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  if (!filename) return 'unnamed';
  
  // Remove path separators and dangerous characters
  return filename
    .replace(/[\/\\]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255); // Limit filename length
};

/**
 * Generate unique dataset ID
 * @returns {string} - Unique dataset ID
 */
const generateDatasetId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `dataset_${timestamp}_${random}`;
};

/**
 * Create storage filename from dataset ID and format
 * @param {string} datasetId - Dataset ID
 * @param {string} format - File format (csv, json)
 * @returns {string} - Storage filename
 */
const createStorageFilename = (datasetId, format) => {
  return `${datasetId}.${format}`;
};

module.exports = {
  ALLOWED_FORMATS,
  MAX_FILE_SIZE,
  isValidFileFormat,
  getFileFormat,
  sanitizeFilename,
  generateDatasetId,
  createStorageFilename
};
