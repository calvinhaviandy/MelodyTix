import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { checkPassword, requireUser, revokeUserSessions, startSession } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { passwordSchema } from "@/lib/server/validation";

type PasswordRow = RowDataPacket & { password: string };

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = passwordSchema.parse(await readJson(request));
    const [rows] = await db().execute<PasswordRow[]>("SELECT password FROM user WHERE id=?", [user.id]);
    if (!rows[0] || !(await checkPassword(input.currentPassword, rows[0].password)).valid) fail(400, "Password saat ini salah.");
    const hash = await bcrypt.hash(input.newPassword, 12);
    await db().execute("UPDATE user SET password=? WHERE id=?", [hash, user.id]);
    await revokeUserSessions(user.id);
    await startSession(user.id);
    return NextResponse.json({ ok: true });
  });
}
