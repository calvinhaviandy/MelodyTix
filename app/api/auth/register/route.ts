import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
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
    const { rows } = await db().query<{ id: number }>(
      `INSERT INTO "user" (username,password,nama,email,level) VALUES ($1,$2,$3,$4,'customer') RETURNING id`,
      [input.username, hash, input.name, input.email.toLowerCase()],
    );
    await startSession(rows[0].id);
    return NextResponse.json({ user: await findUserById(rows[0].id) }, { status: 201 });
  });
}
