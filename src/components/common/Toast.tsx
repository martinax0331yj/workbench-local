import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}

interface ToastContextValue {
  toast: (type: ToastType, text: string) => void;
  success: (text: string) => void;
  error: (text: string) => void;
  info: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((type: ToastType, text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setMessages(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);
  }, []);

  const success = useCallback((text: string) => toast('success', text), [toast]);
  const error = useCallback((text: string) => toast('error', text), [toast]);
  const info = useCallback((text: string) => toast('info', text), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {messages.map(m => {
          const styles = {
            success: { bg: 'bg-green-50 border-green-200', icon: <CheckCircle2 size={16} className="text-green-500" /> },
            error: { bg: 'bg-red-50 border-red-200', icon: <XCircle size={16} className="text-red-500" /> },
            info: { bg: 'bg-blue-50 border-blue-200', icon: <Info size={16} className="text-blue-500" /> },
          };
          const s = styles[m.type];
          return (
            <div
              key={m.id}
              className={`${s.bg} border rounded-xl px-4 py-3 shadow-lg pointer-events-auto flex items-center gap-3 animate-[slideIn_0.3s_ease-out]`}
            >
              {s.icon}
              <span className="text-sm text-text-primary">{m.text}</span>
              <button
                onClick={() => setMessages(prev => prev.filter(x => x.id !== m.id))}
                className="ml-2 text-text-muted hover:text-text-secondary"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
