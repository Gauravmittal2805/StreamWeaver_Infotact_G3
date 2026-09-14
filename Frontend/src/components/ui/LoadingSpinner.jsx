import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  size = 'md',
  message,
  className = '',
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-indigo-600 ${sizes[size] || sizes.md}`} />
      {message && <p className="text-xs text-slate-500 font-medium">{message}</p>}
    </div>
  );
}
