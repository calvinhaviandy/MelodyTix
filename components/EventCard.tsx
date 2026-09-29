"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { rupiah, safeImage, shortDate, type Event } from "@/lib/client/api";

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const soldOut = event.stock <= 0;
  return (
    <motion.article className="event-card" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.28) }}>
      <Link href={`/events/${event.id}`} className="event-card-link" aria-label={`Lihat ${event.title}`}>
        <div className="event-card-image"><img src={safeImage(event.imageUrl)} alt={event.title} loading="lazy" /><span className="date-chip">{shortDate(event.startsAt)}</span>{event.isDemo && <span className="demo-chip">DEMO</span>}</div>
        <div className="event-card-info"><div className="event-location"><MapPin size={14} /> {event.city}{event.venue ? ` · ${event.venue}` : ""}</div><div className="event-card-heading"><h3>{event.title}</h3><span className="round-arrow"><ArrowUpRight size={20} /></span></div><div className="event-card-bottom"><span>{soldOut ? "Tiket habis" : "Mulai dari"}</span><strong>{soldOut ? "Sold out" : rupiah(event.price)}</strong></div></div>
      </Link>
    </motion.article>
  );
}
