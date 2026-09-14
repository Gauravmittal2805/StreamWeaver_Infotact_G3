import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  HardDrive,
  RefreshCw,
  Info,
  ShieldCheck,
  Zap,
  Layers,
  StopCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Alert from '../components/ui/Alert';
import { useFileUpload } from '../hooks/useFileUpload';
import { formatBytes, formatSpeed, formatDate } from '../utils/formatters';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [useSimulationMode, setUseSimulationMode] = useState(false);

  const {
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
    reset,
  } = useFileUpload();

  // Drag and Drop Event Handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      selectFile(e.target.files[0]);
    }
    // reset input value so re-selecting same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return FileSpreadsheet;
    return fileName.endsWith('.json') ? FileJson : FileSpreadsheet;
  };

  const FileIconComponent = getFileIcon(file?.name || result?.filename);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Step 1 of ETL Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Dataset</h2>
          <p className="text-sm text-slate-500 mt-1">
            Stream massive CSV or JSON files (up to 5GB+) directly into the backend ingestion pipeline.
          </p>
        </div>

        {/* Standalone / Simulation switch for demoing when backend is offline */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600">
          <button
            type="button"
            onClick={() => setUseSimulationMode(false)}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              !useSimulationMode ? 'bg-white text-indigo-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Live API
          </button>
          <button
            type="button"
            onClick={() => setUseSimulationMode(true)}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              useSimulationMode ? 'bg-white text-indigo-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
            title="Simulate 5GB chunked streaming without needing live Express backend"
          >
            Demo Simulation
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.json,text/csv,application/json"
        className="hidden"
      />

      {/* Error Alert Display */}
      {error && (
        <Alert
          variant="error"
          title="Upload / Validation Error"
          onClose={reset}
          action={
            error.code === 'BACKEND_UNAVAILABLE' && (
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => startUpload(true)}
                >
                  Run Demo Streaming Simulation
                </Button>
                <Button size="xs" variant="secondary" onClick={() => startUpload(false)}>
                  Retry Live API
                </Button>
              </div>
            )
          }
        >
          {error.message}
        </Alert>
      )}

      {/* MAIN UPLOAD CONTAINER */}
      <Card className="border-2 border-slate-200/90 shadow-sm">
        <CardContent className="p-8">
          {/* STATE 1: NO FILE SELECTED */}
          {status === 'idle' && (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleTriggerBrowse}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/60 scale-[0.99]'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-xs">
                <UploadCloud className="w-8 h-8 animate-bounce-subtle" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                Drop your dataset here, or <span className="text-indigo-600 underline">browse</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Supports massive structured files formatted as <span className="font-semibold text-slate-700">.CSV</span> or <span className="font-semibold text-slate-700">.JSON</span>.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2">
                <Badge variant="neutral" size="sm">.csv</Badge>
                <Badge variant="neutral" size="sm">.json</Badge>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-500 font-medium">Streams up to 5GB+ with 0 MB memory leak</span>
              </div>
            </div>
          )}

          {/* STATE 2: FILE SELECTED (PRE-UPLOAD) */}
          {status === 'selected' && file && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100/80 border border-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0">
                    <FileIconComponent className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="font-mono">{formatBytes(file.size)}</span>
                      <span>&bull;</span>
                      <Badge variant="neutral" size="sm">
                        {file.name.endsWith('.json') ? 'JSON Dataset' : 'CSV Dataset'}
                      </Badge>
                      <span>&bull;</span>
                      <span className="text-emerald-600 font-medium">Validated extension</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    icon={X}
                    className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                  >
                    Remove
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => startUpload(useSimulationMode)}
                    icon={UploadCloud}
                  >
                    {useSimulationMode ? 'Start Demo Simulation' : 'Stream Upload to Server'}
                  </Button>
                </div>
              </div>

              {/* Streaming Guarantee Notice */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 flex items-start gap-3 text-xs text-indigo-950">
                <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Architectural Guarantee:</span> The frontend streams raw chunks directly via multipart FormData. The entire file is never read into browser memory arrays, ensuring rock-solid stability even for 5GB+ datasets.
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: UPLOADING (STREAMING PROGRESS) */}
          {status === 'uploading' && file && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <FileIconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      Streaming {file.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isSimulated ? 'Running demonstration upload stream...' : 'Transferring chunks to Express streaming parser...'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={cancelUpload}
                  icon={StopCircle}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Cancel
                </Button>
              </div>

              {/* Progress Bar & Stats */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    Uploading chunks...
                  </span>
                  <span className="font-mono text-indigo-600 text-sm">{progress.percent}%</span>
                </div>
                <ProgressBar progress={progress.percent} height="lg" animated />
              </div>

              {/* Live Upload Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Uploaded</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
                    {formatBytes(progress.loaded)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Size</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
                    {formatBytes(progress.total || file.size)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Throughput Speed</span>
                  <span className="font-mono font-semibold text-indigo-600 mt-0.5 block">
                    {progress.speed > 0 ? formatSpeed(progress.speed) : 'Calculating...'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Est. Remaining</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
                    {progress.eta > 0 ? `${progress.eta}s` : 'Finalizing...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 4: UPLOAD COMPLETED (SUCCESS FLOW) */}
          {status === 'completed' && result && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">
                  Dataset Uploaded Successfully!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  The dataset has been received and verified by the ingestion stream. You can now proceed to dataset schema inspection or pipeline mapping.
                </p>
              </div>

              {/* Dataset Details Card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                <div className="font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Dataset Metadata</span>
                  <Badge variant="success" dot size="sm">
                    Ready for ETL
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-400">Dataset ID:</span>
                    <span className="font-mono font-semibold text-slate-900">{result.datasetId}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-400">File Name:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[180px]">{result.filename}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-400">File Size:</span>
                    <span className="font-mono text-slate-900">{formatBytes(result.size)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-400">Format:</span>
                    <span className="font-semibold text-slate-900">{result.format}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-50 sm:col-span-2">
                    <span className="text-slate-400">Upload Timestamp:</span>
                    <span className="text-slate-900">{formatDate(result.uploadedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button variant="secondary" size="md" onClick={reset} icon={RefreshCw}>
                  Upload Another Dataset
                </Button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/datasets')}
                    icon={HardDrive}
                    className="w-full sm:w-auto"
                  >
                    View in Datasets Catalog
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/pipelines')}
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-800"
                  >
                    Configure Mapping (Day 2)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STATE 5: UPLOAD FAILED */}
          {status === 'error' && !result && (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Upload Failed</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {error?.message || 'An error occurred during dataset transfer. Please try again.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={reset}>
                  Choose Different File
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => startUpload(useSimulationMode)}
                  icon={RefreshCw}
                >
                  Retry Upload
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Technical Info Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Chunk-Based Streams</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Data is streamed using HTTP multipart boundaries. Node.js processes each chunk via busboy without buffering the entire dataset.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Format Validation</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Strict client-side and server-side validation restricts uploads to valid CSV/JSON data files to prevent malicious uploads.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Day 2 Virtualized Preview</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Upon upload completion, the dataset is prepared for virtualized grid rendering (react-window) previewing the initial 1,000 rows.
          </p>
        </div>
      </div>
    </div>
  );
}
