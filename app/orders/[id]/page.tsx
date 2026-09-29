"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Clock3, Download, MapPin, Printer, Ticket, X } from "lucide-react";
import { api, errorMessage, eventDate, eventTime, rupiah, type Order } from "@/lib/client/api";
import { EmptyState, ErrorState, LoadingState } from "@/components/LoadingState";
import { StatusBadge } from "@/components/StatusBadge";
import { useSession } from "@/lib/client/use-session";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { const data = await api<{ order: Order }>(`/api/orders/${id}`); setOrder(data.order); }
    catch (err) { setError(errorMessage(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (id && user) void load(); }, [id, user?.id]);

  if (authLoading) return <div className="container page-content"><LoadingState /></div>;
  if (!user) return <div className="container page-content"><EmptyState title="Masuk untuk melihat pesanan" description="Detail tiket hanya tersedia untuk pemilik akun." action={<Link className="button button-primary" href={`/login?next=/orders/${id}`}>Masuk</Link>} /></div>;
  if (loading) return <div className="container page-content"><LoadingState label="Memuat pesanan..." /></div>;
  if (error || !order) return <div className="container page-content"><ErrorState message={error || "Pesanan tidak ditemukan."} onRetry={load} /></div>;

  return <div className="order-detail-page page-content"><div className="container"><Link href="/account" className="back-link"><ArrowLeft size={18} /> Kembali ke pesanan</Link><div className="page-heading"><span className="eyebrow">ORDER #{String(order.id).padStart(5, "0")}</span><h1>Detail pesanan<span className="accent-dot">.</span></h1><p>Dibuat pada {eventDate(order.createdAt)}</p></div><div className="order-detail-grid"><div className="order-main-card"><div className="order-event-banner"><img src={order.event?.imageUrl || "/images/sheila.jpg"} alt={order.event?.title || "Konser"} /><div><span className="eyebrow">YOUR NEXT SHOW</span><h2>{order.event?.title || "Konser"}</h2></div></div><div className="order-meta-list"><div><CalendarDays size={20} /><span>Tanggal & waktu</span><strong>{eventDate(order.event.startsAt)} · {eventTime(order.event.startsAt)} WIB</strong></div><div><MapPin size={20} /><span>Lokasi</span><strong>{order.event.venue}, {order.event.city}</strong></div><div><Ticket size={20} /><span>Jumlah tiket</span><strong>{order.quantity} tiket</strong></div></div><div className="order-total"><span>Total pesanan</span><strong>{rupiah(order.total)}</strong></div>{order.status === "approved" && <div className="invoice-actions"><button className="button button-primary" onClick={() => window.print()}><Printer size={18} /> Cetak tiket / invoice</button><span>Gunakan menu cetak browser untuk menyimpan sebagai PDF.</span></div>}</div><aside className="order-status-card"><span className="eyebrow">STATUS PESANAN</span><StatusBadge status={order.status} /><div className="status-explanation">{order.status === "pending" ? <><Clock3 size={23} /><h3>Menunggu verifikasi</h3><p>Bukti simulasimu sudah diterima. Admin akan memeriksa pesanan ini.</p></> : order.status === "approved" ? <><Check size={24} /><h3>Tiketmu siap!</h3><p>Pesanan sudah disetujui. Simpan atau cetak invoice di halaman ini.</p></> : <><X size={24} /><h3>Pesanan ditolak</h3><p>Bukti simulasi belum dapat disetujui. Kamu dapat mencoba membuat pesanan demo baru jika tiket masih tersedia.</p></>}</div>{order.proofName && <a className="text-link proof-link" href={`/api/orders/${order.id}/proof`} target="_blank" rel="noreferrer"><Download size={17} /> Lihat bukti yang diunggah</a>}</aside></div></div></div>;
}
