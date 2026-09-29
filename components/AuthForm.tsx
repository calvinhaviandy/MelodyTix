"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { api, errorMessage, type User } from "@/lib/client/api";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const register = mode === "register";
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      await api<{ user: User }>(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(register ? { name, username, email, password } : { username, password }) });
      window.dispatchEvent(new Event("melodytix:auth-changed"));
      const requested = new URLSearchParams(window.location.search).get("next") || "/account";
      const destination = new URL(requested, window.location.origin);
      router.push(destination.origin === window.location.origin ? `${destination.pathname}${destination.search}${destination.hash}` : "/account");
      router.refresh();
    } catch (err) { setError(errorMessage(err)); setLoading(false); }
  }

  return <div className="auth-page"><div className="auth-art"><div className="auth-art-bg" /><div className="auth-art-copy"><span className="eyebrow">BE THERE. FEEL MORE.</span><h2>Musik terbaik<br />terasa <em>langsung.</em></h2><p>Satu langkah lebih dekat ke panggung impianmu.</p></div><span className="auth-art-bottom">MELODYTIX / YOUR CONCERT COMPANION</span></div><div className="auth-form-side"><div className="auth-form-wrap"><span className="eyebrow">{register ? "GABUNG DENGAN KAMI" : "SELAMAT DATANG KEMBALI"}</span><h1>{register ? "Buat akunmu." : "Masuk ke ritme."}</h1><p>{register ? "Daftar untuk mulai memesan tiket dan menyimpan momenmu." : "Masuk untuk melanjutkan petualangan musikmu."}</p><form onSubmit={submit} className="stack-form">{register && <label><span>Nama lengkap</span><div className="input-icon"><UserRound size={18} /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required autoComplete="name" /></div></label>}<label><span>Username</span><div className="input-icon"><UserRound size={18} /><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required autoComplete="username" /></div></label>{register && <label><span>Email</span><div className="input-icon"><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" required autoComplete="email" /></div></label>}<label><span>Kata sandi</span><div className="input-icon"><LockKeyhole size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={register ? "Minimal 8 karakter" : "Kata sandi"} required minLength={register ? 8 : undefined} autoComplete={register ? "new-password" : "current-password"} /></div></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-full" type="submit" disabled={loading}>{loading ? "Mohon tunggu..." : register ? "Daftar sekarang" : "Masuk"}<ArrowRight size={18} /></button></form><p className="auth-switch">{register ? "Sudah punya akun?" : "Belum punya akun?"} <Link href={register ? "/login" : "/register"}>{register ? "Masuk" : "Daftar sekarang"}</Link></p></div></div></div>;
}
