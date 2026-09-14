import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Cpu, Database, Server, HardDrive } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Alert from '../components/ui/Alert';

export default function SettingsPage() {
  const [batchSize, setBatchSize] = useState('5000');
  const [highWaterMark, setHighWaterMark] = useState('65536');
  const [maxMemoryMB, setMaxMemoryMB] = useState('150');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System & Stream Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure Node.js stream highWaterMark, MongoDB bulkWrite batch size, and memory constraints.
        </p>
      </div>

      {saved && (
        <Alert variant="success" title="Settings Saved">
          Ingestion pipeline buffer parameters updated successfully.
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Stream Buffer & Ingestion Tuning</CardTitle>
            <CardDescription>
              Architectural parameters ensuring stable memory consumption regardless of file size
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Select
              label="MongoDB Bulk Write Batch Size"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              helperText="Number of transformed records buffered before executing collection.bulkWrite()"
              options={[
                { value: '1000', label: '1,000 records (Low RAM footprint)' },
                { value: '5000', label: '5,000 records (Recommended / High Throughput)' },
                { value: '10000', label: '10,000 records (Maximum write concurrency)' },
              ]}
            />

            <Select
              label="Node.js Stream highWaterMark (Chunk Buffer)"
              value={highWaterMark}
              onChange={(e) => setHighWaterMark(e.target.value)}
              helperText="Determines backpressure threshold on read streams"
              options={[
                { value: '16384', label: '16 KB (Fine-grained backpressure)' },
                { value: '65536', label: '64 KB (Standard Node default)' },
                { value: '262144', label: '256 KB (Fast disk streaming)' },
              ]}
            />

            <Input
              label="Max Node Memory RSS Threshold (MB)"
              type="number"
              value={maxMemoryMB}
              onChange={(e) => setMaxMemoryMB(e.target.value)}
              helperText="Target limit: Ensure RSS remains under 150MB during 5GB ingestion runs."
            />
          </CardContent>
          <CardFooter>
            <Button type="button" variant="secondary" onClick={() => { setBatchSize('5000'); setHighWaterMark('65536'); setMaxMemoryMB('150'); }}>
              Reset Defaults
            </Button>
            <Button type="submit" variant="primary" icon={Save}>
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
