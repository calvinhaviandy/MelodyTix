"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Headphones, MapPin, Search, Sparkles, Ticket } from "lucide-react";
import { api, errorMessage, type Event } from "@/lib/client/api";
import { EventCard } from "@/components/EventCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/LoadingState";
import { SectionHeading } from "@/components/SectionHeading";

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Semua kota");
  const [availability, setAvailability] = useState("Semua");

  async function load() {
    setLoading(true);
    setError("");
    try { const data = await api<{ events: Event[] }>("/api/events"); setEvents(data.events || []); }
    catch (err) { setError(errorMessage(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const cities = useMemo(() => ["Semua kota", ...Array.from(new Set(events.map((event) => event.city).filter(Boolean)))], [events]);
  const filtered = useMemo(() => events.filter((event) => {
    const matchesQuery = `${event.title} ${event.venue} ${event.city}`.toLowerCase().includes(query.toLowerCase().trim());
    return matchesQuery && (city === "Semua kota" || event.city === city) && (availability === "Semua" || (availability === "Tersedia" ? event.stock > 0 : event.stock <= 0));
  }), [events, query, city, availability]);
  const featured = events.find((event) => event.featured) || events[0];

  return (
    <>
      <section className="home-hero">
        <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="hero-overline"><span className="live-dot" /> TIKET KONSER, SEMUDAH ITU</motion.div>
            <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>Datang untuk <em>musiknya.</em><br />Pulang bawa <span>cerita.</span></motion.h1>
            <motion.p initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}>Temukan panggung favoritmu, amankan tiketnya, dan bersiap untuk malam yang tak terlupakan.</motion.p>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="hero-actions"><a href="#konser" className="button button-primary button-lg">Jelajahi konser <ArrowUpRight size={18} /></a><span className="hero-mini"><Headphones size={19} /> Satu tempat untuk semua<br />momen musikmu</span></motion.div>
            <div className="hero-bottom-mark"><ArrowDown size={18} /> SCROLL UNTUK JELAJAH</div>
          </div>
          <motion.div className="hero-art" initial={reduceMotion ? false : { opacity: 0, scale: 0.93, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.18 }}>
            <div className="hero-art-main"><img src={featured?.imageUrl || "/images/sheila.jpg"} alt="Suasana konser" /><div className="hero-art-gradient" /><span className="hero-art-caption">FEEL EVERY BEAT <Sparkles size={18} /></span></div>
            {(!featured || featured.isDemo) && <span className="hero-demo-note">{featured ? "DEMO LOKAL" : "FOTO ILUSTRASI"}</span>}
            <div className="hero-art-small"><img src="/images/maliq.jpeg" alt="Penampilan musik di panggung" /></div>
            <div className="hero-sticker"><Ticket size={30} /><span>GOOD<br />VIBES<br />ONLY</span></div>
            <div className="hero-number">01 / 03</div>
          </motion.div>
        </div>
        <div className="ticker" aria-hidden="true"><div className="ticker-track">LIVE MUSIC <span>✳</span> BIG MEMORIES <span>✳</span> YOUR NEXT CONCERT <span>✳</span> LIVE MUSIC <span>✳</span> BIG MEMORIES <span>✳</span> YOUR NEXT CONCERT <span>✳</span></div></div>
      </section>

      <section className="discover-section section-pad" id="konser">
        <div className="container">
          <SectionHeading eyebrow="TEMUKAN PANGGUNGMU" title="Konser pilihan untukmu." description="Musik yang kamu suka, pengalaman yang kamu tunggu." action={<span className="event-count">{events.length.toString().padStart(2, "0")} EVENT</span>} />
          <div className="discover-toolbar">
            <label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari konser, kota, atau venue..." aria-label="Cari konser" /></label>
            <div className="filter-group"><label className="select-wrap"><MapPin size={17} /><select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter kota">{cities.map((value) => <option key={value}>{value}</option>)}</select></label><label className="select-wrap"><CalendarDays size={17} /><select value={availability} onChange={(event) => setAvailability(event.target.value)} aria-label="Filter ketersediaan"><option>Semua</option><option>Tersedia</option><option>Habis</option></select></label></div>
          </div>
          {loading ? <LoadingState label="Mencari konser..." /> : error ? <ErrorState message={error} onRetry={load} /> : filtered.length ? <div className="event-grid">{filtered.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}</div> : <EmptyState title={events.length ? "Tidak ada hasil" : "Panggung sedang disiapkan"} description={events.length ? "Coba kata kunci atau filter lain untuk menemukan konsermu." : "Belum ada konser yang tersedia saat ini. Kembali lagi untuk melihat acara terbaru."} action={events.length ? <button className="button button-outline" onClick={() => { setQuery(""); setCity("Semua kota"); setAvailability("Semua"); }}>Reset filter</button> : undefined} />}
        </div>
      </section>

      <section className="experience-section"><div className="container experience-grid"><div className="experience-visual"><img src="/images/hindia.jpg" alt="Panggung konser dengan cahaya meriah" /><div className="experience-label">01 — THE EXPERIENCE</div></div><div className="experience-copy"><span className="eyebrow">DARI PENONTON, UNTUK PENONTON</span><h2>Setiap konser punya <em>cerita.</em></h2><p>Dari lagu pertama sampai encore terakhir, setiap detik terasa lebih hidup saat kamu ada di sana. Temukan konser yang tepat dan mulai ceritamu berikutnya.</p><div className="experience-points"><div><span><Search size={20} /></span><strong>Jelajahi</strong><small>Temukan acara yang cocok denganmu</small></div><div><span><Ticket size={20} /></span><strong>Pesan</strong><small>Pilih tiket dan kirim bukti simulasi</small></div><div><span><Sparkles size={20} /></span><strong>Nikmati</strong><small>Pantau status dan simpan tiketmu</small></div></div><Link href="/#konser" className="text-link">Temukan konsermu <ArrowRight size={18} /></Link></div></div></section>
      <section className="newsletter-strip"><div className="container"><div><span className="eyebrow">MOMEN BERIKUTNYA MENUNGGU</span><h2>Siap jadi bagian dari keramaian?</h2></div><a href="#konser" className="button button-light">Lihat semua konser <ArrowUpRight size={18} /></a></div></section>
    </>
  );
}
