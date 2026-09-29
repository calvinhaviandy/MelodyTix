"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, LockKeyhole, Ticket, UserRound } from "lucide-react";
import { api, errorMessage, eventDate, rupiah, type Order, type User } from "@/lib/client/api";
import { useSession } from "@/lib/client/use-session";
import { EmptyState, ErrorState, LoadingState } from "@/components/LoadingState";
import { StatusBadge } from "@/components/StatusBadge";

export default function AccountPage() {
  const { user, loading: authLoading, refresh } = useSession();
  const [active, setActive] = useState<"orders" | "profile" | "security">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => { if (user) { setName(user.name); setUsername(user.username); setEmail(user.email); } }, [user]);
  async function loadOrders() {
    setOrdersLoading(true); setOrdersError("");
    try { const data = await api<{ orders: Order[] }>("/api/orders"); setOrders(data.orders || []); }
    catch (err) { setOrdersError(errorMessage(err)); }
    finally { setOrdersLoading(false); }
  }
  useEffect(() => { if (user) void loadOrders(); }, [user?.id]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setFeedback(""); setFormError("");
    try { await api<{ user: User }>("/api/profile", { method: "PATCH", body: JSON.stringify({ name, username, email }) }); await refresh(); window.dispatchEvent(new Event("melodytix:auth-changed")); setFeedback("Profil berhasil diperbarui."); }
    catch (err) { setFormError(errorMessage(err)); }
    finally { setSaving(false); }
  }
  async function savePassword(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setFeedback(""); setFormError("");
    try { await api("/api/profile/password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }); setCurrentPassword(""); setNewPassword(""); setFeedback("Kata sandi berhasil diubah."); }
    catch (err) { setFormError(errorMessage(err)); }
    finally { setSaving(false); }
  }

  if (authLoading) return <div className="container page-content"><LoadingState label="Memuat akun..." /></div>;
  if (!user) return <div className="container page-content"><EmptyState title="Masuk untuk melihat akunmu" description="Pesanan dan profilmu akan tampil setelah masuk." action={<Link className="button button-primary" href="/login?next=/account">Masuk <ArrowRight size={17} /></Link>} /></div>;

  return <div className="account-page page-content"><div className="container"><div className="page-heading"><span className="eyebrow">PERSONAL SPACE</span><h1>Halo, {user.name.split(" ")[0]}<span className="accent-dot">.</span></h1><p>Semua momen musikmu, tersimpan di sini.</p></div><div className="account-layout"><aside className="account-sidebar"><div className="account-person"><div className="avatar">{user.name.charAt(0).toUpperCase()}</div><div><strong>{user.name}</strong><small>@{user.username}</small></div></div><nav aria-label="Menu akun"><button className={active === "orders" ? "active" : ""} onClick={() => { setActive("orders"); setFeedback(""); setFormError(""); }}><Ticket size={18} /> Pesanan saya</button><button className={active === "profile" ? "active" : ""} onClick={() => { setActive("profile"); setFeedback(""); setFormError(""); }}><UserRound size={18} /> Profil</button><button className={active === "security" ? "active" : ""} onClick={() => { setActive("security"); setFeedback(""); setFormError(""); }}><LockKeyhole size={18} /> Keamanan</button>{user.role === "admin" && <Link href="/admin"><ArrowRight size={18} /> Dashboard admin</Link>}</nav></aside><div className="account-main">{active === "orders" && <><div className="panel-title"><div><span className="eyebrow">YOUR TICKETS</span><h2>Riwayat pesanan</h2></div><span className="event-count">{orders.length.toString().padStart(2, "0")} PESANAN</span></div>{ordersLoading ? <LoadingState label="Memuat pesanan..." /> : ordersError ? <ErrorState message={ordersError} onRetry={loadOrders} /> : orders.length ? <div className="order-list">{orders.map((order) => <Link key={order.id} href={`/orders/${order.id}`} className="order-row"><div className="order-thumbnail"><img src={order.event?.imageUrl || "/images/sheila.jpg"} alt="" /></div><div className="order-summary"><small>#{String(order.id).padStart(5, "0")} · {eventDate(order.createdAt)}</small><h3>{order.event?.title || "Konser"}</h3><span><CalendarDays size={15} /> {order.quantity} tiket · {rupiah(order.total)}</span></div><div className="order-row-end"><StatusBadge status={order.status} /><ArrowRight size={19} /></div></Link>)}</div> : <EmptyState title="Belum ada pesanan" description="Saat kamu memesan tiket, seluruh status dan detailnya akan muncul di sini." action={<Link href="/#konser" className="button button-outline">Jelajahi konser <ArrowRight size={17} /></Link>} />}</>}{active === "profile" && <div className="form-panel"><span className="eyebrow">ACCOUNT DETAILS</span><h2>Profil saya</h2><p>Perbarui informasi yang digunakan untuk akunmu.</p><form className="stack-form" onSubmit={saveProfile}><label><span>Nama lengkap</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label><label><span>Username</span><input value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} autoComplete="username" /></label><label><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>{feedback && <p className="form-success" role="status">{feedback}</p>}{formError && <p className="form-error" role="alert">{formError}</p>}<button className="button button-primary" disabled={saving}>{saving ? "Menyimpan..." : "Simpan perubahan"}<ArrowRight size={17} /></button></form></div>}{active === "security" && <div className="form-panel"><span className="eyebrow">STAY SECURE</span><h2>Ubah kata sandi</h2><p>Gunakan kata sandi yang unik untuk melindungi akunmu.</p><form className="stack-form" onSubmit={savePassword}><label><span>Kata sandi saat ini</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required autoComplete="current-password" /></label><label><span>Kata sandi baru</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={8} autoComplete="new-password" /></label>{feedback && <p className="form-success" role="status">{feedback}</p>}{formError && <p className="form-error" role="alert">{formError}</p>}<button className="button button-primary" disabled={saving}>{saving ? "Menyimpan..." : "Ubah kata sandi"}<ArrowRight size={17} /></button></form></div>}</div></div></div></div>;
}
