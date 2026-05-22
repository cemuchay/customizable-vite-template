import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { useStore, Notification } from '../store/useStore';

export default function ToastContainer() {
  const { notifications, removeNotification } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => (
        <Toast key={notif.id} notification={notif} onClose={removeNotification} />
      ))}
    </div>
  );
}

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

function Toast({ notification, onClose }: ToastProps) {
  const { id, type, message } = notification;

  const icons = {
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  };

  const borderStyles = {
    info: 'border-blue-100 dark:border-blue-900 bg-white/95 dark:bg-slate-900/95 shadow-blue-500/5',
    success: 'border-emerald-100 dark:border-emerald-900 bg-white/95 dark:bg-slate-900/95 shadow-emerald-500/5',
    warning: 'border-amber-100 dark:border-amber-900 bg-white/95 dark:bg-slate-900/95 shadow-amber-500/5',
    error: 'border-rose-100 dark:border-rose-900 bg-white/95 dark:bg-slate-900/95 shadow-rose-500/5',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in ${borderStyles[type]}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
