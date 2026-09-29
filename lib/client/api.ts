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

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: "customer" | "admin";
};

export type Order = {
  id: number;
  event: Event;
  quantity: number;
  total: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  proofName?: string;
  user?: User;
  username?: string;
};

export type AdminStats = {
  events?: number;
  users?: number;
  orders?: number;
  pending?: number;
  revenue?: number | string;
  totalEvents?: number;
  totalUsers?: number;
  totalOrders?: number;
  pendingOrders?: number;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
    headers: {
      ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    throw new ApiError(
      typeof data?.error === "string" ? data.error : typeof data?.message === "string" ? data.message : `Permintaan gagal (${response.status})`,
      response.status,
    );
  }
  return data as T;
}

export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

export const eventDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(value));

export const eventTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }).format(new Date(value));

export const shortDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", timeZone: "Asia/Jakarta" }).format(new Date(value));

export const safeImage = (url?: string | null) => url?.trim() || "/images/sheila.jpg";

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan. Coba lagi beberapa saat.";
}

export function orderLabel(status: Order["status"]) {
  return status === "approved" ? "Tiket diterbitkan" : status === "rejected" ? "Ditolak" : "Menunggu verifikasi";
}
