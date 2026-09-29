import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { safe } from "@/lib/server/http";

export const runtime = "nodejs";

export function GET() {
  return safe(async () => {
    await db().query("SELECT 1");
    return NextResponse.json({ ok: true });
  });
}
