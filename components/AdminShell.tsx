"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ChartNoAxesCombined, ClipboardList, UsersRound } from "lucide-react";
import { useSession } from "@/lib/client/use-session";
import { EmptyState, LoadingState } from "@/components/LoadingState";

const links = [
  { href: "/admin", label: "Ringkasan", icon: ChartNoAxesCombined },
  { href: "/admin/events", label: "Konser", icon: CalendarDays },
  { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/admin/users", label: "Pengguna", icon: UsersRound },
];

export function AdminShell({ title, eyebrow, description, children }: { title: string; eyebrow: string; description?: string; children: React.ReactNode }) {
  const { user, loading } = useSession();
  const pathname = usePathname();
  if (loading) return <div className="container page-content"><LoadingState label="Memuat dashboard..." /></div>;
  if (user?.role !== "admin") return <div className="container page-content"><EmptyState title="Akses khusus admin" description="Halaman ini hanya dapat dibuka oleh admin MelodyTix." action={<Link className="button button-primary" href={user ? "/account" : "/login?next=/admin"}>{user ? "Kembali ke akun" : "Masuk"}</Link>} /></div>;
  return <div className="admin-page page-content"><div className="container"><div className="page-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}<span className="accent-dot">.</span></h1>{description && <p>{description}</p>}</div><div className="admin-layout"><aside className="admin-sidebar"><span className="sidebar-label">DASHBOARD</span><nav aria-label="Navigasi admin">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? "active" : ""}><Icon size={19} /> {label}</Link>)}</nav><div className="sidebar-bottom">Logged in as <strong>{user.name}</strong></div></aside><div className="admin-content">{children}</div></div></div></div>;
}
