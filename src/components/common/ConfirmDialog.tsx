import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  itemName?: string;
  affectedItems?: { label: string; count: number }[];
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = '确认操作',
  message,
  itemName,
  affectedItems,
  confirmLabel = '确认删除',
  cancelLabel = '取消',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-500',
      iconBg: 'bg-red-50',
      btn: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-amber-500',
      iconBg: 'bg-amber-50',
      btn: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      icon: 'text-blue-500',
      iconBg: 'bg-blue-50',
      btn: 'bg-blue-500 hover:bg-blue-600',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.iconBg}`}>
            <AlertTriangle size={20} className={style.icon} />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary mt-1">{message}</p>
          </div>
        </div>

        {itemName && (
          <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-text-muted mb-0.5">即将删除</p>
            <p className="text-sm font-medium text-text-primary">「{itemName}」</p>
          </div>
        )}

        {affectedItems && affectedItems.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium mb-2">可能受影响的关联数据：</p>
            <div className="space-y-1">
              {affectedItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-amber-600">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.count} 条</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${style.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
