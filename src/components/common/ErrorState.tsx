import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = '加载失败',
  message = '请检查网络连接后重试',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h3 className="text-base font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-6 text-center max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
        >
          <RotateCcw size={16} />
          重试
        </button>
      )}
    </div>
  );
}
