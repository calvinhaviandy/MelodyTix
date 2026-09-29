import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserById, requireAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { parseId } from "@/lib/server/validation";

type Params = { params: Promise<{ id: string }> };

export function PATCH(request: Request, { params }: Params) {
  return safe(async () => {
    assertSameOrigin(request);
    const actor = await requireAdmin();
    const id = parseId((await params).id);
    const { role } = z.object({ role: z.enum(["admin", "customer"]) }).parse(await readJson(request));
    const target = await findUserById(id);
    if (!target) fail(404, "Pengguna tidak ditemukan.");
    if (actor.id === id && role !== "admin") fail(400, "Anda tidak dapat mencabut peran admin sendiri.");
    await db().query('UPDATE "user" SET level=$1 WHERE id=$2', [role, id]);
    return NextResponse.json({ user: await findUserById(id) });
  });
}
