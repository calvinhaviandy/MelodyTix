import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { checkPassword, endSession, startSession, toUser } from "@/lib/server/auth";
import { db, type QueryResultRow } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { loginSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

type LoginRow = QueryResultRow & { id: number; nama: string; username: string; email: string; level: string; password: string };

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    const input = loginSchema.parse(await readJson(request));
    const identifier = (input.identifier || input.username || input.email || "").trim();
    const { rows } = await db().query<LoginRow>(
      'SELECT id,nama,username,email,level,password FROM "user" WHERE LOWER(username)=LOWER($1) OR LOWER(email)=LOWER($1) LIMIT 1',
      [identifier],
    );
    const row = rows[0];
    if (!row) fail(401, "Username/email atau password salah.");
    const check = await checkPassword(input.password, row.password);
    if (!check.valid) fail(401, "Username/email atau password salah.");
    if (check.legacy) {
      const upgraded = await bcrypt.hash(input.password, 12);
      await db().query('UPDATE "user" SET password=$1 WHERE id=$2 AND password=$3', [upgraded, row.id, row.password]);
    }
    await endSession();
    await startSession(row.id);
    return NextResponse.json({ user: toUser(row) });
  });
}
