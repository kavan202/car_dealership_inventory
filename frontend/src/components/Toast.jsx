import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, toasts = [], onClose }) {
  // Support both single toast object and array of toasts
  const toastList = toasts && toasts.length > 0 ? toasts : toast ? [toast] : [];

  if (toastList.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-[10000] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toastList.map((t, index) => (
        <SingleToast
          key={t.id || index}
          toast={t}
          onClose={() => onClose && onClose(t.id || t)}
        />
      ))}
    </div>
  );
}

function SingleToast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between space-x-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-toast-slide transition-all ${
        isSuccess
          ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200 shadow-emerald-900/30'
          : isError
          ? 'bg-rose-950/95 border-rose-500/40 text-rose-200 shadow-rose-900/30'
          : 'bg-blue-950/95 border-blue-500/40 text-blue-200 shadow-blue-900/30'
      }`}
    >
      <div className="flex items-center space-x-3">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
