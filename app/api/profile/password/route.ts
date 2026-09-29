import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { checkPassword, requireUser, revokeUserSessions, startSession } from "@/lib/server/auth";
import { db, type QueryResultRow } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { passwordSchema } from "@/lib/server/validation";

type PasswordRow = QueryResultRow & { password: string };

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = passwordSchema.parse(await readJson(request));
    const { rows } = await db().query<PasswordRow>('SELECT password FROM "user" WHERE id=$1', [user.id]);
    if (!rows[0] || !(await checkPassword(input.currentPassword, rows[0].password)).valid) fail(400, "Password saat ini salah.");
    const hash = await bcrypt.hash(input.newPassword, 12);
    await db().query('UPDATE "user" SET password=$1 WHERE id=$2', [hash, user.id]);
    await revokeUserSessions(user.id);
    await startSession(user.id);
    return NextResponse.json({ ok: true });
  });
}
