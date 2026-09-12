/**
 * Member 1 File Service Contract
 * 
 * Member 1 provides getReadStream(datasetId) to stream dataset files chunk-by-chunk
 * without loading entire datasets into memory.
 */

async function getReadStream(datasetId) {
  // To be implemented by Member 1 (e.g. fs.createReadStream from stored dataset file or GridFS/S3)
  throw new Error(`Member 1 getReadStream not yet implemented for datasetId: ${datasetId}`);
}

module.exports = {
  getReadStream
};
