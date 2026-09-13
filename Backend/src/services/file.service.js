const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const {
  isValidFileFormat,
  getFileFormat,
  sanitizeFilename,
  generateDatasetId,
  createStorageFilename,
  MAX_FILE_SIZE
} = require('../utils/validation');

// In-memory storage for dataset metadata
// In production, this should be a database
const datasetMetadata = new Map();

/**
 * Upload dataset using streaming with Busboy
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} - Dataset metadata
 */
const uploadDataset = (req) => {
  return new Promise((resolve, reject) => {
    // Validate content type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      const error = new Error('Content-Type must be multipart/form-data');
      error.statusCode = 400;
      return reject(error);
    }

    // Initialize Busboy for streaming upload
    const busboy = Busboy({ 
      headers: req.headers,
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1 // Only allow one file at a time
      }
    });

    let fileUploaded = false;
    let fileProcessComplete = false;
    let uploadedDataset = null;

    // Handle file stream
    busboy.on('file', (fieldname, fileStream, info) => {
      const { filename, encoding, mimeType } = info;

      console.log(`📁 Receiving file: ${filename}`);
      console.log(`📊 Encoding: ${encoding}, MIME: ${mimeType}`);

      // Validate file format
      if (!isValidFileFormat(filename)) {
        fileStream.resume(); // Drain the stream
        const error = new Error(`Invalid file format. Allowed: .csv, .json`);
        error.statusCode = 400;
        return reject(error);
      }

      // Generate dataset ID and metadata
      const datasetId = generateDatasetId();
      const format = getFileFormat(filename);
      const originalName = sanitizeFilename(filename);
      const storedName = createStorageFilename(datasetId, format);
      const uploadPath = path.join(__dirname, '../../uploads', storedName);

      console.log(`🆔 Dataset ID: ${datasetId}`);
      console.log(`💾 Storage path: ${uploadPath}`);

      // Create write stream to disk
      const writeStream = fs.createWriteStream(uploadPath);

      let uploadedBytes = 0;

      // Track upload progress
      fileStream.on('data', (chunk) => {
        uploadedBytes += chunk.length;
        // Log progress for large files (every 10MB)
        if (uploadedBytes % (10 * 1024 * 1024) < chunk.length) {
          console.log(`📈 Uploaded: ${(uploadedBytes / (1024 * 1024)).toFixed(2)} MB`);
        }
      });

      // Handle stream errors
      fileStream.on('error', (error) => {
        console.error('❌ File stream error:', error);
        writeStream.destroy();
        fs.unlink(uploadPath, () => {}); // Clean up partial file
        reject(error);
      });

      writeStream.on('error', (error) => {
        console.error('❌ Write stream error:', error);
        fileStream.resume(); // Drain the stream
        fs.unlink(uploadPath, () => {}); // Clean up partial file
        reject(error);
      });

      // Pipe file stream to write stream (STREAMING - NO BUFFERING)
      fileStream.pipe(writeStream);

      // Handle completion
      writeStream.on('finish', () => {
        console.log(`✅ Upload complete: ${uploadedBytes} bytes`);

        // Get file stats
        const stats = fs.statSync(uploadPath);

        // Create dataset metadata
        const metadata = {
          id: datasetId,
          originalName: originalName,
          storedName: storedName,
          filename: originalName,
          format: format,
          size: stats.size,
          uploadedAt: new Date().toISOString(),
          status: 'uploaded',
          path: uploadPath
        };

        // Store metadata (in production, save to database)
        datasetMetadata.set(datasetId, metadata);

        uploadedDataset = {
          id: metadata.id,
          filename: metadata.filename,
          format: metadata.format,
          size: metadata.size,
          status: metadata.status,
          uploadedAt: metadata.uploadedAt
        };

        fileUploaded = true;
        fileProcessComplete = true;

        // If busboy already finished, resolve now
        if (fileProcessComplete) {
          resolve(uploadedDataset);
        }
      });
    });

    // Handle file size limit exceeded
    busboy.on('filesLimit', () => {
      const error = new Error(`File size exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB`);
      error.statusCode = 413;
      reject(error);
    });

    // Handle form completion
    busboy.on('finish', () => {
      // Wait a bit for file stream to complete
      setTimeout(() => {
        if (!fileUploaded) {
          const error = new Error('No file was uploaded');
          error.statusCode = 400;
          return reject(error);
        }

        if (uploadedDataset && fileProcessComplete) {
          console.log('🎉 Upload process completed');
          resolve(uploadedDataset);
        }
      }, 100);
    });

    // Handle busboy errors
    busboy.on('error', (error) => {
      console.error('❌ Busboy error:', error);
      reject(error);
    });

    // Pipe request to busboy
    req.pipe(busboy);
  });
};

/**
 * Get dataset metadata by ID
 * @param {string} datasetId - Dataset ID
 * @returns {Promise<Object>} - Dataset metadata
 */
const getDataset = async (datasetId) => {
  const metadata = datasetMetadata.get(datasetId);
  
  if (!metadata) {
    const error = new Error('Dataset not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: metadata.id,
    filename: metadata.filename,
    format: metadata.format,
    size: metadata.size,
    status: metadata.status,
    uploadedAt: metadata.uploadedAt
  };
};

/**
 * Get read stream for a dataset
 * @param {string} datasetId - Dataset ID
 * @returns {Object} - { stream, metadata }
 */
const getReadStream = (datasetId) => {
  const metadata = datasetMetadata.get(datasetId);
  
  if (!metadata) {
    const error = new Error('Dataset not found');
    error.statusCode = 404;
    throw error;
  }

  if (!fs.existsSync(metadata.path)) {
    const error = new Error('Dataset file not found on disk');
    error.statusCode = 404;
    throw error;
  }

  const stream = fs.createReadStream(metadata.path);
  return { stream, metadata };
};

/**
 * Delete dataset
 * @param {string} datasetId - Dataset ID
 * @returns {Promise<void>}
 */
const deleteDataset = async (datasetId) => {
  const metadata = datasetMetadata.get(datasetId);
  
  if (!metadata) {
    const error = new Error('Dataset not found');
    error.statusCode = 404;
    throw error;
  }

  // Delete file from disk
  if (fs.existsSync(metadata.path)) {
    fs.unlinkSync(metadata.path);
  }

  // Remove metadata
  datasetMetadata.delete(datasetId);

  console.log(`🗑️ Deleted dataset: ${datasetId}`);
};

module.exports = {
  uploadDataset,
  getDataset,
  getReadStream,
  deleteDataset
};
