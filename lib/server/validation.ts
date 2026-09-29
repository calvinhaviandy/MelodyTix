import { z } from "zod";
import { fail } from "./http";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(150),
  username: z.string().trim().min(3, "Username minimal 3 karakter.").max(100).regex(/^[a-zA-Z0-9_.-]+$/, "Username hanya boleh berisi huruf, angka, _, . atau -."),
  email: z.email("Email tidak valid.").max(255),
  password: z.string().min(8, "Password minimal 8 karakter.").max(128),
});

export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  identifier: z.string().optional(),
  password: z.string().min(1),
}).refine((value) => Boolean(value.username || value.email || value.identifier), "Isi username atau email.");

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),
  username: registerSchema.shape.username.optional(),
  email: z.email().max(255).optional(),
}).refine((value) => Object.keys(value).length > 0, "Tidak ada perubahan.");

export const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter.").max(128),
});

const imageUrl = z.string().trim().max(500).refine((value) => {
  if (/^\/images\/[a-zA-Z0-9_./() %-]+$/.test(value) && !value.includes("..")) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch { return false; }
}, "URL gambar tidak valid.");

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(255),
  startsAt: z.iso.datetime({ offset: true }).or(z.iso.datetime({ local: true })),
  venue: z.string().trim().min(2).max(180),
  city: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(10000),
  imageUrl,
  price: z.coerce.number().min(0).max(999999999999),
  stock: z.coerce.number().int().min(0).max(1000000),
  featured: z.boolean().optional(),
  isDemo: z.boolean().optional(),
});

export const eventPatchSchema = eventSchema.partial().extend({
  expectedStock: z.coerce.number().int().min(0).max(1000000).optional(),
}).superRefine((value, context) => {
  if (value.stock !== undefined && value.expectedStock === undefined) {
    context.addIssue({ code: "custom", path: ["expectedStock"], message: "Stok awal diperlukan untuk mencegah penimpaan pesanan baru." });
  }
});

export function parseId(value: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) fail(400, "ID tidak valid.");
  return id;
}

export function parseEventDate(value: string): Date {
  const date = new Date(/(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}+07:00`);
  if (Number.isNaN(date.getTime())) fail(400, "Waktu konser tidak valid.");
  return date;
}
