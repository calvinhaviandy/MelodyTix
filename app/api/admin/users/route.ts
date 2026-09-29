import { NextResponse } from "next/server";
import { requireAdmin, toUser } from "@/lib/server/auth";
import { db, type QueryResultRow } from "@/lib/server/db";
import { safe } from "@/lib/server/http";

type UserRow = QueryResultRow & { id: number; nama: string; username: string; email: string; level: string };

export function GET() {
  return safe(async () => {
    await requireAdmin();
    const { rows } = await db().query<UserRow>('SELECT id,nama,username,email,level FROM "user" ORDER BY id DESC');
    return NextResponse.json({ users: rows.map(toUser) });
  });
}
