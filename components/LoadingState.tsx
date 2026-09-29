import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Memuat..." }: { label?: string }) {
  return <div className="state-panel loading-panel" role="status"><LoaderCircle className="spin" size={24} /><p>{label}</p></div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="state-panel"><span className="state-symbol">✳</span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="state-panel error-panel"><span className="state-symbol">!</span><h3>Ups, ada kendala</h3><p>{message}</p>{onRetry && <button className="button button-outline" onClick={onRetry}>Coba lagi</button>}</div>;
}
