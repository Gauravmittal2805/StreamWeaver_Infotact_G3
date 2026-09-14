import React from 'react';

const VARIANTS = {
  primary: 'bg-indigo-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
};

export default function ProgressBar({
  progress = 0,
  variant = 'primary',
  showLabel = false,
  height = 'md',
  animated = false,
  className = '',
}) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const barColor = VARIANTS[variant] || VARIANTS.primary;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-700">
          <span>Progress</span>
          <span>{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${heights[height] || heights.md}`}>
        <div
          className={`h-full transition-all duration-300 rounded-full ${barColor} ${
            animated ? 'relative overflow-hidden' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          )}
        </div>
      </div>
    </div>
  );
}
