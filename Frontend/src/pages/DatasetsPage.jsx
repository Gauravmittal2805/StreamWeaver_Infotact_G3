import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  UploadCloud,
  FileSpreadsheet,
  FileJson,
  Search,
  ArrowUpRight,
  Trash2,
  Sliders,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import { formatBytes, formatNumber } from '../utils/formatters';

const INITIAL_DATASETS = [
  {
    id: 'ds_8f9a2b1c',
    name: 'customers_large_2026.csv',
    size: 5368709120, // 5.0 GB
    format: 'CSV',
    rows: 5000000,
    columns: 14,
    status: 'Ready',
    uploadedAt: 'Sep 14, 2026, 09:30 AM',
  },
  {
    id: 'ds_4d7e1f2a',
    name: 'ecommerce_transactions_q3.json',
    size: 891289600, // 850 MB
    format: 'JSON',
    rows: 1200000,
    columns: 22,
    status: 'Ready',
    uploadedAt: 'Sep 14, 2026, 07:15 AM',
  },
  {
    id: 'ds_1c3b5a7e',
    name: 'financial_ledger_archive.csv',
    size: 2147483648, // 2.0 GB
    format: 'CSV',
    rows: 2400000,
    columns: 18,
    status: 'Ready',
    uploadedAt: 'Sep 13, 2026, 04:45 PM',
  },
  {
    id: 'ds_9a8b7c6d',
    name: 'user_analytics_batch_09.csv',
    size: 157286400, // 150 MB
    format: 'CSV',
    rows: 350000,
    columns: 8,
    status: 'Ready',
    uploadedAt: 'Sep 13, 2026, 11:20 AM',
  },
];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState(INITIAL_DATASETS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = datasets.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dataset Catalog</h2>
          <p className="text-sm text-slate-500 mt-1">
            Uploaded CSV and JSON datasets stored for streaming transformation and MongoDB ingestion.
          </p>
        </div>
        <Link to="/upload">
          <Button variant="primary" icon={UploadCloud}>
            Upload Dataset
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>All Datasets ({filtered.length})</CardTitle>
            <CardDescription>Prepared for Day 2 Virtualized Row Inspection & Mapping</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Database}
              title="No datasets found"
              description={searchTerm ? `No datasets matching "${searchTerm}".` : 'No datasets uploaded yet.'}
              actionLabel="Upload First Dataset"
              onAction={() => {}}
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
                  <TableHead>Columns</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {item.format === 'JSON' ? (
                          <FileJson className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        ) : (
                          <FileSpreadsheet className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[200px]">{item.name}</span>
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
                    <TableCell className="font-mono text-xs text-slate-600">
                      {item.columns} cols
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{item.uploadedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to="/pipelines">
                          <Button size="xs" variant="ghost" className="text-indigo-600 hover:text-indigo-700">
                            Build ETL <ArrowUpRight className="w-3 h-3 ml-0.5" />
                          </Button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete dataset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
