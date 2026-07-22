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
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div
        className={`flex items-center space-x-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${
          isSuccess
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-900/30'
            : isError
            ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-900/30'
            : 'bg-blue-950/90 border-blue-500/40 text-blue-200 shadow-blue-900/30'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}

        <p className="text-sm font-medium pr-2">{toast.message}</p>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
