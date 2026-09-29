import { db, type QueryResultRow } from "./db";

export type Event = {
  id: number;
  title: string;
  startsAt: string;
  venue: string;
  city: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  featured: boolean;
  isDemo: boolean;
};

export type Order = {
  id: number;
  event: Event;
  quantity: number;
  total: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  proofName?: string;
  user?: { id: number | null; name: string; username: string; email: string };
};

export type EventRow = QueryResultRow & {
  id: number;
  nama_konser: string;
  waktu: string;
  venue: string;
  city: string;
  deskripsi: string;
  gambar: string;
  image_url: string | null;
  harga: number;
  stok_tiket: number;
  featured: number;
  is_demo: number;
  is_active: number;
};

export type OrderRow = QueryResultRow & {
  idpesanan: number;
  user_id: number | null;
  event_id: number | null;
  username: string;
  nama_konser: string;
  quantity: number;
  total_harga: number;
  tanggal_pembelian: string;
  status: string;
  tipe_file: string;
  proof_name: string | null;
  stock_reserved: number;
  buyer_name?: string | null;
  buyer_email?: string | null;
};

function isoFromBangkok(date: string | Date): string {
  if (date instanceof Date) return date.toISOString();
  const raw = String(date);
  const parsed = new Date(raw.replace(" ", "T") + (/[Z+-]\d\d:?\d\d$/.test(raw) ? "" : "+07:00"));
  return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString();
}

export function toEvent(row: EventRow): Event {
  const image = row.image_url?.trim() || row.gambar?.trim() || "";
  return {
    id: row.id,
    title: row.nama_konser,
    startsAt: isoFromBangkok(row.waktu),
    venue: row.venue || "Venue diumumkan segera",
    city: row.city || "Indonesia",
    description: row.deskripsi,
    imageUrl: image.startsWith("/") || /^https?:\/\//.test(image) ? image : `/images/${encodeURIComponent(image)}`,
    price: Number(row.harga),
    stock: Number(row.stok_tiket),
    featured: Boolean(row.featured),
    isDemo: Boolean(row.is_demo),
  };
}

export async function getEvent(id: number, includeInactive = false): Promise<EventRow | null> {
  const { rows } = await db().query<EventRow>(
    `SELECT * FROM keranjang WHERE id=$1 ${includeInactive ? "" : "AND is_active=1"} LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

export async function listOrders(whereSql = "", params: (string | number)[] = []): Promise<Order[]> {
  const { rows } = await db().query<OrderRow>(
    `SELECT p.idpesanan,p.user_id,p.event_id,p.username,p.nama_konser,p.quantity,
      p.total_harga,p.tanggal_pembelian,p.status,p.tipe_file,p.proof_name,p.stock_reserved,
      u.nama AS buyer_name,u.email AS buyer_email
      FROM pesanan p LEFT JOIN "user" u ON u.id=p.user_id
      ${whereSql} ORDER BY p.tanggal_pembelian DESC,p.idpesanan DESC`,
    params,
  );
  const ids = [...new Set(rows.map((row) => row.event_id).filter((id): id is number => id !== null))];
  const events = new Map<number, Event>();
  if (ids.length) {
    const { rows: eventRows } = await db().query<EventRow>(
      `SELECT * FROM keranjang WHERE id IN (${ids.map((_, index) => `$${index + 1}`).join(",")})`,
      ids,
    );
    for (const row of eventRows) events.set(row.id, toEvent(row));
  }
  return rows.map((row) => {
    const quantity = Number(row.quantity);
    const purchasedPrice = quantity > 0 ? Number(row.total_harga) / quantity : 0;
    const fallback: Event = {
      id: row.event_id || 0,
      title: row.nama_konser,
      startsAt: isoFromBangkok(row.tanggal_pembelian),
      venue: "Venue tidak tersedia",
      city: "Indonesia",
      description: "Konser dari riwayat pemesanan lama.",
      imageUrl: "/images/melodytix5.png",
      price: purchasedPrice,
      stock: 0,
      featured: false,
      isDemo: false,
    };
    return {
      id: row.idpesanan,
      event: events.has(row.event_id || -1)
        ? { ...events.get(row.event_id || -1)!, title: row.nama_konser, price: purchasedPrice }
        : fallback,
      quantity,
      total: Number(row.total_harga),
      status: row.status === "accept" || row.status === "approved" ? "approved" : row.status === "deny" || row.status === "rejected" ? "rejected" : "pending",
      createdAt: isoFromBangkok(row.tanggal_pembelian),
      ...((row.proof_name || row.tipe_file) ? { proofName: row.proof_name || `bukti-${row.idpesanan}` } : {}),
      user: { id: row.user_id, name: row.buyer_name || row.username, username: row.username, email: row.buyer_email || "" },
    };
  });
}

export async function getOrder(id: number): Promise<Order | null> {
  return (await listOrders("WHERE p.idpesanan=$1", [id]))[0] || null;
}

export function toBangkokTimestamp(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "00";
  return `${part("year")}-${part("month")}-${part("day")} ${part("hour")}:${part("minute")}:${part("second")}`;
}
