import React from 'react';
import { History, CheckCircle2, XCircle, FileSpreadsheet, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

const HISTORY_RUNS = [
  {
    id: 'job-982',
    dataset: 'ecommerce_transactions_q3.json',
    totalRows: 1200000,
    successRows: 1199850,
    failedRows: 150,
    duration: '64.8s',
    avgSpeed: '18,518 rows/s',
    completedAt: 'Sep 14, 2026, 08:30 AM',
    status: 'Completed',
  },
  {
    id: 'job-981',
    dataset: 'user_analytics_batch_09.csv',
    totalRows: 350000,
    successRows: 350000,
    failedRows: 0,
    duration: '18.9s',
    avgSpeed: '18,518 rows/s',
    completedAt: 'Sep 13, 2026, 01:20 PM',
    status: 'Completed',
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Execution History</h2>
        <p className="text-sm text-slate-500 mt-1">
          Historical log of completed streaming ETL runs and performance benchmarks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Executions</CardTitle>
          <CardDescription>Verified batch bulk writes to MongoDB</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Job ID</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Total Rows</TableHead>
                <TableHead>Success / Failed</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Avg Speed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HISTORY_RUNS.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-mono text-xs text-indigo-600 font-semibold">{run.id}</TableCell>
                  <TableCell className="font-medium text-slate-900">{run.dataset}</TableCell>
                  <TableCell className="font-mono text-xs">{run.totalRows.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className="text-emerald-600">{run.successRows.toLocaleString()}</span>
                    {' / '}
                    <span className="text-rose-600">{run.failedRows}</span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{run.duration}</TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">{run.avgSpeed}</TableCell>
                  <TableCell>
                    <Badge variant="success" dot size="sm">
                      {run.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
