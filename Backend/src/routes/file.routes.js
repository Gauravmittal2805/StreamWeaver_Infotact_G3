const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');

/**
 * @route   POST /api/files/upload
 * @desc    Upload a dataset file (CSV or JSON)
 * @access  Public
 */
router.post('/upload', fileController.uploadDataset);

/**
 * @route   GET /api/files/:datasetId
 * @desc    Get dataset metadata
 * @access  Public
 */
router.get('/:datasetId', fileController.getDataset);

/**
 * @route   DELETE /api/files/:datasetId
 * @desc    Delete a dataset
 * @access  Public
 */
router.delete('/:datasetId', fileController.deleteDataset);

module.exports = router;
