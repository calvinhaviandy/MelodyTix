import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { checkPassword, endSession, startSession, toUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { loginSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

type LoginRow = RowDataPacket & { id: number; nama: string; username: string; email: string; level: string; password: string };

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    const input = loginSchema.parse(await readJson(request));
    const identifier = (input.identifier || input.username || input.email || "").trim();
    const [rows] = await db().execute<LoginRow[]>(
      "SELECT id,nama,username,email,level,password FROM `user` WHERE username=? OR email=? LIMIT 1",
      [identifier, identifier],
    );
    const row = rows[0];
    if (!row) fail(401, "Username/email atau password salah.");
    const check = await checkPassword(input.password, row.password);
    if (!check.valid) fail(401, "Username/email atau password salah.");
    if (check.legacy) {
      const upgraded = await bcrypt.hash(input.password, 12);
      await db().execute("UPDATE `user` SET password=? WHERE id=? AND password=?", [upgraded, row.id, row.password]);
    }
    await endSession();
    await startSession(row.id);
    return NextResponse.json({ user: toUser(row) });
  });
}
