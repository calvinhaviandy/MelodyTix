"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/LoadingState";
import { ApiError, api, errorMessage, eventDate, rupiah, safeImage, type Event } from "@/lib/client/api";

type EventDraft = { title: string; startsAt: string; venue: string; city: string; description: string; imageUrl: string; price: string; stock: string; featured: boolean; isDemo: boolean };
const blank: EventDraft = { title: "", startsAt: "", venue: "", city: "", description: "", imageUrl: "/images/sheila.jpg", price: "", stock: "", featured: false, isDemo: true };
const imageOptions = ["/images/sheila.jpg", "/images/hindia.jpg", "/images/maliq.jpeg", "/images/coldplay.jpeg", "/images/noah.jpg", "/images/dewa2.jpg"];
function toWibInput(date: string) { const parts = new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Jakarta" }).format(new Date(date)); return parts.replace(" ", "T"); }
function toDraft(event: Event): EventDraft { return { title: event.title, startsAt: toWibInput(event.startsAt), venue: event.venue, city: event.city, description: event.description, imageUrl: event.imageUrl, price: String(event.price), stock: String(event.stock), featured: event.featured, isDemo: event.isDemo }; }

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [original, setOriginal] = useState<Event | null>(null);
  const [draft, setDraft] = useState<EventDraft>(blank);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() { setLoading(true); setError(""); try { const data = await api<{ events: Event[] }>("/api/events"); setEvents(data.events || []); } catch (err) { setError(errorMessage(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  function startNew() { setDraft(blank); setOriginal(null); setFormError(""); setConflict(false); setEditing("new"); }
  function startEdit(event: Event) { setDraft(toDraft(event)); setOriginal(event); setFormError(""); setConflict(false); setEditing(event.id); }
  function update<K extends keyof EventDraft>(key: K, value: EventDraft[K]) { setDraft((current) => ({ ...current, [key]: value })); }
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (editing === null) return; setSaving(true); setFormError("");
    try {
      const body = { ...draft, startsAt: new Date(`${draft.startsAt}:00+07:00`).toISOString(), price: Number(draft.price), stock: Number(draft.stock) };
      if (editing === "new") {
        await api("/api/events", { method: "POST", body: JSON.stringify(body) });
      } else {
        if (!original) throw new Error("Data konser awal tidak tersedia. Muat ulang daftar konser.");
        const baseline = toDraft(original);
        const changed: Record<string, string | number | boolean> = {};
        for (const key of Object.keys(draft) as (keyof EventDraft)[]) {
          if (draft[key] !== baseline[key]) changed[key] = body[key];
        }
        if ("stock" in changed) changed.expectedStock = original.stock;
        if (!Object.keys(changed).length) { setEditing(null); setNotice("Tidak ada perubahan pada konser."); return; }
        await api(`/api/events/${editing}`, { method: "PATCH", body: JSON.stringify(changed) });
      }
      setEditing(null); setNotice(editing === "new" ? "Konser berhasil ditambahkan." : "Konser berhasil diperbarui."); await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) { setConflict(true); setFormError("Stok atau data konser berubah sejak editor dibuka. Muat ulang daftar konser, lalu periksa perubahan sebelum menyimpan lagi."); }
      else setFormError(errorMessage(err));
    } finally { setSaving(false); }
  }
  async function reloadAfterConflict() { setEditing(null); setConflict(false); await load(); }
  async function remove(event: Event) {
    if (!window.confirm(`Hapus konser “${event.title}”?`)) return;
    setNotice("");
    try { await api(`/api/events/${event.id}`, { method: "DELETE" }); setNotice("Konser berhasil dihapus."); await load(); }
    catch (err) { setError(errorMessage(err)); }
  }

  return <AdminShell title="Kelola konser" eyebrow="ADMIN / EVENTS" description="Atur acara yang muncul di katalog MelodyTix."><div className="admin-toolbar"><span>{events.length} konser</span><button className="button button-primary" onClick={startNew}><Plus size={18} /> Tambah konser</button></div>{notice && <p className="form-success" role="status">{notice}</p>}{loading ? <LoadingState label="Memuat konser..." /> : error ? <ErrorState message={error} onRetry={load} /> : events.length ? <div className="admin-event-list">{events.map((event) => <div className="admin-event-row" key={event.id}><img src={safeImage(event.imageUrl)} alt="" /><div><h3>{event.title}</h3><span><CalendarDays size={14} /> {eventDate(event.startsAt)} <MapPin size={14} /> {event.city}</span><small>{rupiah(event.price)} · {event.stock} tiket {event.isDemo ? "· DEMO" : ""}</small></div><div className="row-actions"><button title="Edit konser" aria-label={`Edit ${event.title}`} onClick={() => startEdit(event)}><Pencil size={18} /></button><button title="Hapus konser" aria-label={`Hapus ${event.title}`} onClick={() => remove(event)}><Trash2 size={18} /></button></div></div>)}</div> : <EmptyState title="Belum ada konser" description="Tambahkan acara pertama untuk mengisi katalog." action={<button className="button button-primary" onClick={startNew}><Plus size={17} /> Tambah konser</button>} />}
  {editing !== null && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}><div className="editor-modal" role="dialog" aria-modal="true" aria-label={editing === "new" ? "Tambah konser" : "Edit konser"}><div className="editor-heading"><div><span className="eyebrow">EVENT EDITOR</span><h2>{editing === "new" ? "Tambah konser" : "Edit konser"}</h2></div><button aria-label="Tutup" onClick={() => setEditing(null)}><X size={22} /></button></div><form className="event-editor-form" onSubmit={save}><label>Nama konser<input value={draft.title} onChange={(e) => update("title", e.target.value)} required /></label><div className="form-two-col"><label>Tanggal & waktu (WIB)<input type="datetime-local" value={draft.startsAt} onChange={(e) => update("startsAt", e.target.value)} required /></label><label>Kota<input value={draft.city} onChange={(e) => update("city", e.target.value)} required /></label></div><label>Venue<input value={draft.venue} onChange={(e) => update("venue", e.target.value)} required /></label><div className="form-two-col"><label>Harga tiket (Rp)<input type="number" min="0" value={draft.price} onChange={(e) => update("price", e.target.value)} required /></label><label>Stok tiket<input type="number" min="0" value={draft.stock} onChange={(e) => update("stock", e.target.value)} required /></label></div><label>Deskripsi<textarea rows={4} value={draft.description} onChange={(e) => update("description", e.target.value)} required /></label><label>Foto konser<select value={imageOptions.includes(draft.imageUrl) ? draft.imageUrl : "custom"} onChange={(e) => update("imageUrl", e.target.value === "custom" ? "" : e.target.value)}>{imageOptions.map((image) => <option key={image} value={image}>{image.split("/").pop()}</option>)}<option value="custom">URL gambar lain</option></select></label>{!imageOptions.includes(draft.imageUrl) && <label>URL gambar<input value={draft.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://... atau /images/..." required /></label>}<div className="form-checks"><label><input type="checkbox" checked={draft.featured} onChange={(e) => update("featured", e.target.checked)} /> Jadikan unggulan</label><label><input type="checkbox" checked={draft.isDemo} onChange={(e) => update("isDemo", e.target.checked)} /> Tandai sebagai demo</label></div>{formError && <p className="form-error" role="alert">{formError}</p>}{conflict && <button type="button" className="button button-outline" onClick={reloadAfterConflict}>Muat ulang daftar konser</button>}<div className="editor-actions"><button className="button button-outline" type="button" onClick={() => setEditing(null)}>Batal</button><button className="button button-primary" disabled={saving}>{saving ? "Menyimpan..." : "Simpan konser"}<ArrowRight size={17} /></button></div></form></div></div>}</AdminShell>;
}
