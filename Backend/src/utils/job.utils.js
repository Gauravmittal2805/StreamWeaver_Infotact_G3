/**
 * Utility functions for Job processing and metrics
 */

function calculateRowsPerSecond(processedRows, startTimeMs, currentTimeMs = Date.now()) {
  if (!startTimeMs) return 0;
  const elapsedSeconds = (currentTimeMs - startTimeMs) / 1000;
  if (elapsedSeconds <= 0) return 0;
  return Math.round((processedRows / elapsedSeconds) * 100) / 100;
}

function isValidJobStatus(status) {
  const VALID_STATUSES = ["queued", "processing", "completed", "failed", "cancelled"];
  return VALID_STATUSES.includes(status);
}

module.exports = {
  calculateRowsPerSecond,
  isValidJobStatus
};
