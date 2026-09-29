import { orderLabel, type Order } from "@/lib/client/api";

export function StatusBadge({ status }: { status: Order["status"] }) {
  return <span className={`status-badge status-${status}`}>{orderLabel(status)}</span>;
}
