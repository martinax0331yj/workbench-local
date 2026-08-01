import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  text?: string;
  fullPage?: boolean;
}

export default function LoadingState({ text = '加载中...', fullPage = false }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'py-32' : 'py-16'}`}>
      <Loader2 size={28} className="text-warm-brown animate-spin mb-3" />
      <p className="text-sm text-text-muted">{text}</p>
    </div>
  );
}
