import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db, type QueryResultRow } from "./db";
import { fail } from "./http";

const COOKIE = "melodytix_session";
const SESSION_DAYS = 7;

export type AppUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: "admin" | "customer";
};

type UserRow = QueryResultRow & { id: number; nama: string; username: string; email: string; level: string };

export function toUser(row: UserRow): AppUser {
  return { id: row.id, name: row.nama, username: row.username, email: row.email, role: row.level === "admin" ? "admin" : "customer" };
}

export async function findUserById(id: number): Promise<AppUser | null> {
  const { rows } = await db().query<UserRow>('SELECT id,nama,username,email,level FROM "user" WHERE id=$1', [id]);
  return rows[0] ? toUser(rows[0]) : null;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function currentUser(): Promise<AppUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const { rows } = await db().query<UserRow>(
    'SELECT u.id,u.nama,u.username,u.email,u.level FROM sessions s JOIN "user" u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>NOW() LIMIT 1',
    [hashToken(token)],
  );
  return rows[0] ? toUser(rows[0]) : null;
}

export async function requireUser(): Promise<AppUser> {
  const user = await currentUser();
  if (!user) fail(401, "Silakan masuk terlebih dahulu.");
  return user;
}

export async function requireAdmin(): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== "admin") fail(403, "Akses khusus admin.");
  return user;
}

export async function startSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  await db().query("INSERT INTO sessions (token_hash,user_id,expires_at) VALUES ($1,$2,NOW() + INTERVAL '7 days')", [hashToken(token), userId]);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    await db().query("DELETE FROM sessions WHERE token_hash=$1", [hashToken(token)]);
  }
  jar.delete(COOKIE);
}

export async function revokeUserSessions(userId: number): Promise<void> {
  await db().query("DELETE FROM sessions WHERE user_id=$1", [userId]);
}

export async function checkPassword(password: string, stored: string): Promise<{ valid: boolean; legacy: boolean }> {
  if (/^[a-f0-9]{32}$/i.test(stored)) {
    const digest = createHash("md5").update(password).digest("hex");
    return { valid: digest.toLowerCase() === stored.toLowerCase(), legacy: true };
  }
  return { valid: await bcrypt.compare(password, stored), legacy: false };
}
