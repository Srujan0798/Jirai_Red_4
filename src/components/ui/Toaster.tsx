
import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToastStore, ToastType } from '../../stores/toastStore';

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors: Record<ToastType, string> = {
  success: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40',
  error: 'border-red-500/50 text-red-400 bg-red-950/40',
  info: 'border-blue-500/50 text-blue-400 bg-blue-950/40',
  warning: 'border-orange-500/50 text-orange-400 bg-orange-950/40',
};

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-24 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto w-80 p-4 rounded-xl border backdrop-blur-xl shadow-2xl 
              flex items-start gap-3 animate-in slide-in-from-right-10 fade-in duration-300
              ${colors[toast.type]}
            `}
          >
            <Icon size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
