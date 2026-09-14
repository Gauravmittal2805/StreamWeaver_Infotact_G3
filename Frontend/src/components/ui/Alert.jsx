import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const VARIANTS = {
  info: {
    bg: 'bg-sky-50 border-sky-200 text-sky-900',
    icon: Info,
    iconColor: 'text-sky-600',
  },
  success: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  error: {
    bg: 'bg-rose-50 border-rose-200 text-rose-900',
    icon: AlertCircle,
    iconColor: 'text-rose-600',
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  action,
}) {
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${config.bg} ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
