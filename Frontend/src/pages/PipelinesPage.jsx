import React from 'react';
import { GitFork, ArrowRight, Code, Sparkles, CheckCircle2, Sliders } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function PipelinesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Week 2 Feature Preview</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ETL Pipeline Builder</h2>
          <p className="text-sm text-slate-500 mt-1">
            Visual schema mapping and secure isolated-vm JavaScript transformation engine.
          </p>
        </div>
      </div>

      {/* Conceptual UI Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Source to Destination Mapping Architecture</CardTitle>
          <CardDescription>
            Target workflow for mapping incoming CSV/JSON columns to MongoDB document schemas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
              <span className="font-semibold text-slate-700 block text-xs">Source Column (CSV)</span>
              <div className="p-2 rounded bg-slate-100 font-mono text-indigo-600">customer_name</div>
              <div className="p-2 rounded bg-slate-100 font-mono text-indigo-600">email_address</div>
              <div className="p-2 rounded bg-slate-100 font-mono text-indigo-600">user_age</div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Transforms
              </span>
              <Badge variant="primary" size="sm">value.toUpperCase()</Badge>
              <Badge variant="neutral" size="sm">value.trim()</Badge>
              <Badge variant="warning" size="sm">parseInt(value, 10)</Badge>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
              <span className="font-semibold text-slate-700 block text-xs">MongoDB Document Field</span>
              <div className="p-2 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold">firstName</div>
              <div className="p-2 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold">email</div>
              <div className="p-2 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold">age (Number)</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
            <Code className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Security Note:</span> User-defined transformations run inside a secured <code className="font-mono bg-white px-1 rounded text-indigo-700">isolated-vm</code> sandbox with memory limits (8MB) and strict execution timeouts (50ms) to ensure zero security vulnerabilities.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
