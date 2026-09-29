"use client";

import { useEffect, useState } from "react";
import { Crown, UserRound } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/LoadingState";
import { api, errorMessage, type User } from "@/lib/client/api";
import { useSession } from "@/lib/client/use-session";

export default function AdminUsersPage() {
  const { user: currentUser } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  async function load() { setLoading(true); setError(""); try { const data = await api<{ users: User[] }>("/api/admin/users"); setUsers(data.users || []); } catch (err) { setError(errorMessage(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  async function changeRole(user: User, role: "customer" | "admin") {
    setBusy(user.id); setNotice("");
    try { await api(`/api/admin/users/${user.id}`, { method: "PATCH", body: JSON.stringify({ role }) }); setNotice(`Peran ${user.name} diubah menjadi ${role === "admin" ? "admin" : "pengguna"}.`); await load(); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(null); }
  }
  return <AdminShell title="Pengguna" eyebrow="ADMIN / USERS" description="Kelola peran pengguna dan akses admin."><div className="admin-toolbar"><span>{users.length} akun terdaftar</span></div>{notice && <p className="form-success" role="status">{notice}</p>}{loading ? <LoadingState label="Memuat pengguna..." /> : error ? <ErrorState message={error} onRetry={load} /> : users.length ? <div className="user-list">{users.map((user) => <div className="user-row" key={user.id}><div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div><div className="user-summary"><strong>{user.name} {currentUser?.id === user.id && <small>(kamu)</small>}</strong><span>@{user.username} · {user.email}</span></div><div className="role-control"><span>{user.role === "admin" ? <Crown size={16} /> : <UserRound size={16} />}</span><select aria-label={`Peran ${user.name}`} value={user.role} disabled={busy === user.id || currentUser?.id === user.id} onChange={(event) => changeRole(user, event.target.value as "customer" | "admin")}><option value="customer">Pengguna</option><option value="admin">Admin</option></select></div></div>)}</div> : <EmptyState title="Belum ada pengguna" description="Akun baru akan muncul di sini." />}</AdminShell>;
}
