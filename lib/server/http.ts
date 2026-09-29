import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function fail(status: number, message: string): never {
  throw new ApiError(status, message);
}

export function respondError(error: unknown): NextResponse {
  if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message || "Data tidak valid." }, { status: 400 });
  }
  if (typeof error === "object" && error && "code" in error) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Username atau email sudah digunakan." }, { status: 409 });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json({ error: "Data terkait tidak ditemukan." }, { status: 400 });
    }
  }
  console.error("MelodyTix API error", error);
  return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
}

export function safe(handler: () => Promise<Response>): Promise<Response> {
  return handler().catch(respondError);
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) return;
  try {
    const originUrl = new URL(origin);
    // Next may normalize request.url to localhost behind its dev server or a
    // proxy. Host is the authority the browser actually sent the request to.
    const expectedHost = request.headers.get("host") || new URL(request.url).host;
    const expectedProtocol = (request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "")) + ":";
    if (originUrl.host === expectedHost && originUrl.protocol === expectedProtocol) return;
  } catch { /* malformed Origin is denied below */ }
  fail(403, "Permintaan lintas situs ditolak.");
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    fail(400, "JSON tidak valid.");
  }
}
