import React from 'react';
import { Database } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Database,
  title = 'No data found',
  description = 'There are currently no items to display.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} icon={actionIcon} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
