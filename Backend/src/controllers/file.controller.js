const fileService = require('../services/file.service');

/**
 * Upload dataset controller
 * Handles the HTTP request and delegates to the file service
 */
const uploadDataset = async (req, res) => {
  try {
    // Delegate to file service for streaming upload
    const result = await fileService.uploadDataset(req);
    
    res.status(200).json({
      success: true,
      message: 'Dataset uploaded successfully',
      dataset: result
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to upload dataset',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Get dataset metadata controller
 */
const getDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const dataset = await fileService.getDataset(datasetId);
    
    res.status(200).json({
      success: true,
      dataset
    });
  } catch (error) {
    console.error('Get dataset error:', error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve dataset'
    });
  }
};

/**
 * Delete dataset controller
 */
const deleteDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    await fileService.deleteDataset(datasetId);
    
    res.status(200).json({
      success: true,
      message: 'Dataset deleted successfully'
    });
  } catch (error) {
    console.error('Delete dataset error:', error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete dataset'
    });
  }
};

module.exports = {
  uploadDataset,
  getDataset,
  deleteDataset
};
