import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { startSession, findUserById } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, readJson, safe } from "@/lib/server/http";
import { registerSchema } from "@/lib/server/validation";

export const runtime = "nodejs";

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    const input = registerSchema.parse(await readJson(request));
    const hash = await bcrypt.hash(input.password, 12);
    const [result] = await db().execute<ResultSetHeader>(
      "INSERT INTO `user` (username,password,nama,email,level) VALUES (?,?,?,?, 'customer')",
      [input.username, hash, input.name, input.email.toLowerCase()],
    );
    await startSession(result.insertId);
    return NextResponse.json({ user: await findUserById(result.insertId) }, { status: 201 });
  });
}
