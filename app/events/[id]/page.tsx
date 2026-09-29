"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, ImageUp, MapPin, Minus, Plus, ShieldCheck, Ticket } from "lucide-react";
import { api, errorMessage, eventDate, eventTime, rupiah, safeImage, type Event } from "@/lib/client/api";
import { useSession } from "@/lib/client/use-session";
import { ErrorState, LoadingState } from "@/components/LoadingState";

export default function EventDetailPage() {
  const reduceMotion = useReducedMotion();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [proof, setProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { const data = await api<{ event: Event }>(`/api/events/${id}`); setEvent(data.event); }
    catch (err) { setError(errorMessage(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (id) void load(); }, [id]);

  async function submitOrder(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    if (!event) return;
    if (!user) { router.push(`/login?next=${encodeURIComponent(`/events/${id}`)}`); return; }
    if (!proof) { setSubmitError("Unggah bukti simulasi untuk melanjutkan."); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(proof.type) || proof.size > 4 * 1024 * 1024) { setSubmitError("Pilih gambar JPG, PNG, atau WebP dengan ukuran maksimal 4 MiB."); return; }
    setSubmitting(true); setSubmitError("");
    try {
      const body = new FormData();
      body.append("eventId", String(event.id)); body.append("quantity", String(quantity)); body.append("proof", proof);
      const data = await api<{ order: { id: number } }>("/api/orders", { method: "POST", body });
      router.push(`/orders/${data.order.id}`);
    } catch (err) { setSubmitError(errorMessage(err)); setSubmitting(false); }
  }

  if (loading) return <div className="container page-content"><LoadingState label="Memuat detail konser..." /></div>;
  if (error || !event) return <div className="container page-content"><ErrorState message={error || "Konser tidak ditemukan."} onRetry={load} /></div>;
  const soldOut = event.stock <= 0;
  const expired = new Date(event.startsAt).getTime() <= Date.now();
  const canOrder = !soldOut && !expired;

  return (
    <div className="detail-page">
      <div className="container detail-breadcrumb"><Link href="/"><ArrowLeft size={17} /> Kembali ke konser</Link><span>/</span><span>{event.title}</span></div>
      <section className="container detail-hero">
        <motion.div className="detail-image" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><img src={safeImage(event.imageUrl)} alt={event.title} />{event.isDemo && <span className="demo-chip">EVENT DEMO</span>}</motion.div>
        <motion.div className="detail-info" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}><span className="eyebrow">KONSER · {event.city.toUpperCase()}</span><h1>{event.title}</h1><div className="detail-meta"><div><span className="meta-icon"><CalendarDays size={21} /></span><div><small>TANGGAL</small><strong>{eventDate(event.startsAt)}</strong></div></div><div><span className="meta-icon"><Clock3 size={21} /></span><div><small>WAKTU</small><strong>{eventTime(event.startsAt)} WIB</strong></div></div><div><span className="meta-icon"><MapPin size={21} /></span><div><small>LOKASI</small><strong>{event.venue}, {event.city}</strong></div></div></div><div className="detail-description"><h2>Tentang acara</h2><p>{event.description}</p></div></motion.div>
      </section>
      <section className="container booking-section"><div className="booking-intro"><span className="eyebrow">BOOK YOUR MOMENT</span><h2>Amankan tempatmu <em>di depan panggung.</em></h2><p>Harga dan ketersediaan ditampilkan langsung dari sistem. Pesanan akan diverifikasi setelah bukti simulasi diunggah.</p><div className="booking-trust"><ShieldCheck size={19} /> Status pesanan bisa dipantau di akunmu</div></div><form className="booking-card" onSubmit={submitOrder}><div className="booking-top"><Ticket size={27} /><span>{soldOut ? "TIKET HABIS" : expired ? "ACARA SELESAI" : "TIKET TERSEDIA"}</span></div><div className="booking-price"><small>Harga per tiket</small><strong>{rupiah(event.price)}</strong></div><div className="booking-quantity"><div><strong>Jumlah tiket</strong><small>{event.stock} tiket tersedia</small></div><div className="stepper"><button type="button" aria-label="Kurangi jumlah" disabled={quantity <= 1} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={17} /></button><span>{quantity}</span><button type="button" aria-label="Tambah jumlah" disabled={quantity >= Math.min(event.stock, 10)} onClick={() => setQuantity(Math.min(event.stock, 10, quantity + 1))}><Plus size={17} /></button></div></div><div className="booking-total"><span>Total</span><strong>{rupiah(event.price * quantity)}</strong></div>{canOrder && <><label className="upload-zone"><ImageUp size={24} /><strong>{proof ? proof.name : "Unggah bukti simulasi"}</strong><span>JPG, PNG, atau WebP · maksimal 4 MiB</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(changeEvent) => setProof(changeEvent.target.files?.[0] || null)} /></label><p className="payment-note">Ini alur pesanan demo. Jangan lakukan transfer uang sungguhan. Unggah gambar contoh untuk mencoba verifikasi pesanan.</p></>}{submitError && <p className="form-error" role="alert">{submitError}</p>}<button className="button button-primary button-full" type="submit" disabled={!canOrder || submitting || sessionLoading}>{!canOrder ? soldOut ? "Tiket habis" : "Acara selesai" : submitting ? "Memproses pesanan..." : !user ? "Masuk untuk pesan" : "Pesan tiket"}<ArrowRight size={18} /></button>{canOrder && <p className="booking-foot"><CheckCircle2 size={15} /> Pesanan masuk ke status menunggu verifikasi</p>}</form></section>
    </div>
  );
}
