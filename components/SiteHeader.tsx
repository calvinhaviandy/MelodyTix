"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, LogOut, Menu, Ticket, UserRound, X } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/client/api";
import { useSession } from "@/lib/client/use-session";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const reduceMotion = useReducedMotion();
  const { user, loading, setUser } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await api("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.dispatchEvent(new Event("melodytix:auth-changed"));
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setLogoutError("Gagal keluar. Coba lagi.");
    } finally {
      setLoggingOut(false);
    }
  }

  const nav = (
    <>
      <Link className={pathname === "/" ? "nav-link active" : "nav-link"} href="/" onClick={() => setOpen(false)}>Jelajahi konser</Link>
      {user && <Link className={pathname.startsWith("/account") || pathname.startsWith("/orders") ? "nav-link active" : "nav-link"} href="/account" onClick={() => setOpen(false)}>Pesanan saya</Link>}
      {user?.role === "admin" && <Link className={pathname.startsWith("/admin") ? "nav-link active" : "nav-link"} href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
    </>
  );

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link href="/" className="brand" aria-label="MelodyTix, ke beranda" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Ticket size={18} strokeWidth={2.6} /></span><span>MELODY<span>TIX</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">{nav}</nav>
        <div className="header-actions">
          {!loading && (user ? <><Link href="/account" className="account-pill" aria-label="Akun saya"><UserRound size={17} /> <span>{user.name.split(" ")[0]}</span></Link><button className="header-logout" onClick={logout} disabled={loggingOut} aria-label="Keluar"><LogOut size={17} /><span>Keluar</span></button></> : <><Link href="/login" className="header-login">Masuk</Link><Link href="/register" className="button button-primary header-register">Daftar <ArrowUpRight size={16} /></Link></>)}
          {logoutError && <span className="header-error" role="alert">{logoutError}</span>}
          <button className="mobile-menu-button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && <motion.nav initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={reduceMotion ? undefined : { opacity: 0, height: 0 }} className="mobile-nav" aria-label="Navigasi seluler">
          <div className="container mobile-nav-inner">{nav}
            {user ? <button className="nav-link" disabled={loggingOut} onClick={logout}>Keluar</button> : <><Link className="nav-link" href="/login" onClick={() => setOpen(false)}>Masuk</Link><Link className="nav-link" href="/register" onClick={() => setOpen(false)}>Daftar</Link></>}
          </div>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}
