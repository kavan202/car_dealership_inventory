import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] max-w-md w-full px-4 animate-fade-in pointer-events-auto">
      <div
        className={`flex items-center justify-between space-x-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
          isSuccess
            ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200 shadow-emerald-900/40 ring-1 ring-emerald-500/30'
            : isError
            ? 'bg-rose-950/95 border-rose-500/50 text-rose-200 shadow-rose-900/40 ring-1 ring-rose-500/30'
            : 'bg-blue-950/95 border-blue-500/50 text-blue-200 shadow-blue-900/40 ring-1 ring-blue-500/30'
        }`}
      >
        <div className="flex items-center space-x-3">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
