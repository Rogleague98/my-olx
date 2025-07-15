import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { socket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';

export type Toast = {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
};

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: number) => void;
} | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { user } = useAuth();

  const addToast = (message: string, type?: Toast['type']) => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: number) => {
    setToasts(t => t.filter(toast => toast.id !== id));
  };

  // Listen for Socket.IO events
  useEffect(() => {
    if (!socket) return;
    const onNewMessage = (msg: any) => {
      addToast(msg.content || 'New message received', 'info');
    };
    const onNewNotification = (notif: any) => {
      addToast(notif.message || 'New notification', 'info');
    };
    const onNewReport = (report: any) => {
      if (user?.isAdmin) {
        addToast('New report submitted. Please review in the Admin Dashboard.', 'info');
      }
    };
    const onReportClosed = () => {
      if (user?.isAdmin) {
        addToast('A report was closed.', 'info');
      }
    };
    socket.on('new_message', onNewMessage);
    socket.on('new_notification', onNewNotification);
    socket.on('new_report', onNewReport);
    socket.on('report_closed', onReportClosed);
    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('new_notification', onNewNotification);
      socket.off('new_report', onNewReport);
      socket.off('report_closed', onReportClosed);
    };
  }, [user]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-3 z-50 flex flex-col items-end">
        {toasts.map(toast => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`px-6 py-4 rounded-2xl shadow-glass backdrop-blur-xl border border-white/30 animate-fade-in transition-all duration-500 text-base font-semibold flex items-center gap-3 min-w-[220px] max-w-xs
              ${toast.type === 'error' ? 'bg-red-100/80 text-red-700 border-red-200' :
                toast.type === 'success' ? 'bg-green-100/80 text-green-700 border-green-200' :
                'bg-white/80 text-primary-700 border-primary-100'}
            `}
            style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
          >
            {toast.type === 'error' && <span className="mr-2">❌</span>}
            {toast.type === 'success' && <span className="mr-2">✅</span>}
            {toast.type === 'info' && <span className="mr-2">ℹ️</span>}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
} 