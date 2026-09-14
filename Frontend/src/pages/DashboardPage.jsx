import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Layers,
  Activity,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import { formatNumber, formatBytes } from '../utils/formatters';

const MOCK_KPIS = [
  {
    title: 'Total Datasets',
    value: '12',
    subtext: '+3 uploaded this week',
    trend: '+25%',
    icon: Database,
    color: 'indigo',
    iconBg: 'bg-indigo-50 text-indigo-600',
  },
  {
    title: 'Records Processed',
    value: '18,450,000',
    subtext: 'Avg throughput 18,500 rows/s',
    trend: '+12%',
    icon: Layers,
    color: 'emerald',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Active Jobs',
    value: '2',
    subtext: 'Streaming pipeline active',
    badge: 'Healthy',
    icon: Activity,
    color: 'blue',
    iconBg: 'bg-sky-50 text-sky-600',
  },
  {
    title: 'Failed Records',
    value: '2,800',
    subtext: '0.015% error rate (isolated)',
    trend: '-4.2%',
    icon: AlertTriangle,
    color: 'amber',
    iconBg: 'bg-amber-50 text-amber-600',
  },
];

const MOCK_RECENT_UPLOADS = [
  {
    id: 'ds_8f9a2b1c',
    name: 'customers_large_2026.csv',
    size: 5368709120, // 5GB
    format: 'CSV',
    rows: 5000000,
    status: 'Ready',
    uploadedAt: '10 minutes ago',
  },
  {
    id: 'ds_4d7e1f2a',
    name: 'ecommerce_transactions_q3.json',
    size: 891289600, // 850MB
    format: 'JSON',
    rows: 1200000,
    status: 'Ready',
    uploadedAt: '2 hours ago',
  },
  {
    id: 'ds_1c3b5a7e',
    name: 'financial_ledger_archive.csv',
    size: 2147483648, // 2GB
    format: 'CSV',
    rows: 2400000,
    status: 'In Processing',
    uploadedAt: '5 hours ago',
  },
  {
    id: 'ds_9a8b7c6d',
    name: 'user_analytics_batch_09.csv',
    size: 157286400, // 150MB
    format: 'CSV',
    rows: 350000,
    status: 'Ready',
    uploadedAt: 'Yesterday',
  },
];

const MOCK_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'upload',
    title: 'Uploaded customers_large_2026.csv (5.0 GB)',
    timestamp: '10 mins ago',
    badge: { label: 'Upload Complete', variant: 'success' },
  },
  {
    id: 'act-2',
    type: 'processing',
    title: 'ETL Pipeline Job #104 batch 320 committed to MongoDB',
    timestamp: '25 mins ago',
    badge: { label: '5,000 / batch', variant: 'primary' },
  },
  {
    id: 'act-3',
    type: 'error',
    title: 'Invalid age format "abc" caught in Row 18291 (Handled)',
    timestamp: '1 hour ago',
    badge: { label: 'Validation Warning', variant: 'warning' },
  },
  {
    id: 'act-4',
    type: 'job',
    title: 'ETL Job #103 finished 1.2M rows in 64.8s (18.5k rows/s)',
    timestamp: '2 hours ago',
    badge: { label: 'Success', variant: 'success' },
  },
];

export default function DashboardPage() {
  const [datasets, setDatasets] = useState(MOCK_RECENT_UPLOADS);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>High-Throughput Stream Pipeline Active</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            StreamWeaver ETL Dashboard
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ingest massive multi-gigabyte CSV and JSON datasets with near-constant memory footprint.
            Stream directly through sandboxed transformations into MongoDB.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/upload">
              <Button variant="primary" icon={UploadCloud} size="md">
                Upload New Dataset
              </Button>
            </Link>
            <Link to="/pipelines">
              <Button variant="secondary" icon={ArrowRight} iconPosition="right" size="md" className="bg-slate-800/80 hover:bg-slate-800 text-white border-slate-700">
                Explore Pipelines
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {MOCK_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} hoverEffect className="relative">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    {kpi.trend && (
                      <span className="font-semibold text-emerald-600 flex items-center">
                        {kpi.trend}
                      </span>
                    )}
                    <span>{kpi.subtext}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content: Recent Datasets + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Datasets */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Datasets</CardTitle>
                <CardDescription>Datasets ready for schema mapping and streaming ETL</CardDescription>
              </div>
              <Link to="/upload">
                <Button size="xs" variant="outline" icon={UploadCloud}>
                  Upload
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {datasets.length === 0 ? (
                <EmptyState
                  icon={Database}
                  title="No datasets yet"
                  description="Upload your first CSV or JSON dataset to configure transformations."
                  actionLabel="Upload Dataset"
                  actionIcon={UploadCloud}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow hover={false}>
                      <TableHead>Dataset Name</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>Estimated Rows</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasets.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <FileSpreadsheet className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="neutral" size="sm">
                            {item.format}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">
                          {formatBytes(item.size)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">
                          ~{formatNumber(item.rows)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === 'Ready' ? 'success' : 'primary'}
                            dot
                            size="sm"
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to="/pipelines">
                            <Button size="xs" variant="ghost" className="text-indigo-600 hover:text-indigo-700">
                              Map <ArrowUpRight className="w-3 h-3 ml-0.5" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Pipeline Activity */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Live streaming log and job events</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {MOCK_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-slate-800 leading-snug">
                      {act.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.timestamp}
                    </span>
                    <Badge variant={act.badge.variant} size="sm">
                      {act.badge.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Architecture Guard Info Card */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Node Streams Architecture</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Files are streamed chunk-by-chunk using backpressure pipelines. Large datasets never consume unbounded RAM in Node.js or the browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
