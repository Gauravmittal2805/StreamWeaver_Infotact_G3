import React from 'react';
import { Activity, Radio, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

export default function JobsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Week 3 Live WebSocket Monitor</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active ETL Jobs</h2>
        <p className="text-sm text-slate-500 mt-1">
          Real-time stream telemetry, throughput metrics, and MongoDB batch insertion stats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job 1 Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job #ETL-1082</CardTitle>
              <CardDescription>customers_large_2026.csv (5.0 GB)</CardDescription>
            </div>
            <Badge variant="success" dot size="sm">
              Processing Stream
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 font-semibold">
                <span>3,350,000 / 5,000,000 rows</span>
                <span className="text-indigo-600 font-mono">67%</span>
              </div>
              <ProgressBar progress={67} animated />
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 block">Speed</span>
                <span className="font-mono font-bold text-indigo-600">18,500 rows/s</span>
              </div>
              <div>
                <span className="text-slate-400 block">Success</span>
                <span className="font-mono font-bold text-emerald-600">3,347,200</span>
              </div>
              <div>
                <span className="text-slate-400 block">Failed</span>
                <span className="font-mono font-bold text-amber-600">2,800</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job 2 Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job #ETL-1081</CardTitle>
              <CardDescription>financial_ledger_archive.csv (2.0 GB)</CardDescription>
            </div>
            <Badge variant="primary" dot size="sm">
              Queued
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 font-semibold">
                <span>Waiting for buffer slot</span>
                <span className="text-slate-400 font-mono">0%</span>
              </div>
              <ProgressBar progress={0} />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500">
              Backpressure throttle guard active. Ingestion starts automatically when worker memory stabilizes &lt; 120MB.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
