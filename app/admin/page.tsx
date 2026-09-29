"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, ClipboardList, Ticket, UsersRound } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { ErrorState, LoadingState } from "@/components/LoadingState";
import { api, errorMessage, rupiah, type AdminStats } from "@/lib/client/api";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() { setLoading(true); setError(""); try { const data = await api<{ stats: AdminStats }>("/api/admin/stats"); setStats(data.stats); } catch (err) { setError(errorMessage(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  const cards = [
    { label: "Total konser", value: stats?.events ?? stats?.totalEvents ?? 0, icon: CalendarDays, href: "/admin/events" },
    { label: "Total pesanan", value: stats?.orders ?? stats?.totalOrders ?? 0, icon: Ticket, href: "/admin/orders" },
    { label: "Menunggu verifikasi", value: stats?.pending ?? stats?.pendingOrders ?? 0, icon: ClipboardList, href: "/admin/orders" },
    { label: "Pengguna", value: stats?.users ?? stats?.totalUsers ?? 0, icon: UsersRound, href: "/admin/users" },
  ];
  return <AdminShell title="Ringkasan" eyebrow="ADMIN / OVERVIEW" description="Pantau aktivitas konser dan kelola operasional MelodyTix.">{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : <><div className="stats-grid">{cards.map(({ label, value, icon: Icon, href }) => <Link href={href} className="stat-card" key={label}><div><span>{label}</span><strong>{value}</strong></div><Icon size={24} /><ArrowUpRight className="stat-arrow" size={18} /></Link>)}</div>{stats?.revenue !== undefined && <div className="revenue-card"><span className="eyebrow">NOMINAL PESANAN DISETUJUI</span><strong>{rupiah(Number(stats.revenue))}</strong><span>Nilai ini simulasi; pembayaran nyata belum terhubung.</span></div>}<div className="admin-quick-links"><Link href="/admin/events"><CalendarDays size={21} /><span>Kelola konser<small>Tambah, edit, atau hapus acara</small></span><ArrowUpRight size={19} /></Link><Link href="/admin/orders"><ClipboardList size={21} /><span>Periksa pesanan<small>Verifikasi bukti dan ubah status</small></span><ArrowUpRight size={19} /></Link></div></>}</AdminShell>;
}
