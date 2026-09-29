"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, X } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/LoadingState";
import { StatusBadge } from "@/components/StatusBadge";
import { api, errorMessage, eventDate, rupiah, type Order } from "@/lib/client/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [busy, setBusy] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  async function load() { setLoading(true); setError(""); try { const data = await api<{ orders: Order[] }>("/api/admin/orders"); setOrders(data.orders || []); } catch (err) { setError(errorMessage(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  const visible = useMemo(() => filter === "all" ? orders : orders.filter((order) => order.status === filter), [orders, filter]);
  async function review(order: Order, status: "approved" | "rejected") {
    setBusy(order.id); setNotice(""); setError("");
    try { await api(`/api/admin/orders/${order.id}`, { method: "PATCH", body: JSON.stringify({ status }) }); setNotice(`Pesanan #${order.id} ${status === "approved" ? "disetujui" : "ditolak"}.`); await load(); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(null); }
  }
  return <AdminShell title="Verifikasi pesanan" eyebrow="ADMIN / ORDERS" description="Periksa bukti simulasi dan tentukan status tiket."><div className="admin-toolbar"><div className="segmented" role="group" aria-label="Filter status pesanan">{([ ["all", "Semua"], ["pending", "Menunggu"], ["approved", "Disetujui"], ["rejected", "Ditolak"] ] as const).map(([value, label]) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{label}</button>)}</div><span>{visible.length} pesanan</span></div>{notice && <p className="form-success" role="status">{notice}</p>}{loading ? <LoadingState label="Memuat pesanan..." /> : error ? <ErrorState message={error} onRetry={load} /> : visible.length ? <div className="admin-order-list">{visible.map((order) => <article className="admin-order-card" key={order.id}><div className="admin-order-top"><div><small>ORDER #{String(order.id).padStart(5, "0")} · {eventDate(order.createdAt)}</small><h3>{order.event?.title || "Konser"}</h3><span>Oleh {order.user?.name || order.username || "Pengguna"} · {order.quantity} tiket · {rupiah(order.total)}</span></div><StatusBadge status={order.status} /></div><div className="admin-order-bottom"><div>{order.proofName ? <a href={`/api/orders/${order.id}/proof`} target="_blank" rel="noreferrer" className="text-link">Lihat bukti simulasi <ExternalLink size={16} /></a> : <span className="muted">Bukti simulasi tidak tersedia</span>}</div>{order.status === "pending" && <div className="review-actions"><button className="button button-outline" disabled={busy === order.id} onClick={() => review(order, "rejected")}><X size={17} /> Tolak</button><button className="button button-primary" disabled={busy === order.id} onClick={() => review(order, "approved")}><Check size={17} /> Setujui</button></div>}</div></article>)}</div> : <EmptyState title="Tidak ada pesanan" description={filter === "all" ? "Pesanan baru akan muncul di sini untuk diverifikasi." : "Tidak ada pesanan dengan status ini."} />}</AdminShell>;
}
