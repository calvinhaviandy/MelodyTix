import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { getEvent, toEvent, toMysqlBangkok } from "@/lib/server/models";
import { eventPatchSchema, parseEventDate, parseId } from "@/lib/server/validation";

type Params = { params: Promise<{ id: string }> };

export function GET(_request: Request, { params }: Params) {
  return safe(async () => {
    const id = parseId((await params).id);
    const row = await getEvent(id);
    if (!row) fail(404, "Konser tidak ditemukan.");
    return NextResponse.json({ event: toEvent(row) });
  });
}

export function PATCH(request: Request, { params }: Params) {
  return safe(async () => {
    assertSameOrigin(request);
    await requireAdmin();
    const id = parseId((await params).id);
    if (!(await getEvent(id, true))) fail(404, "Konser tidak ditemukan.");
    const input = eventPatchSchema.parse(await readJson(request));
    const fields: string[] = [];
    const values: (string | number)[] = [];
    const entries: [keyof typeof input, string][] = [
      ["title", "nama_konser"], ["venue", "venue"], ["city", "city"],
      ["description", "deskripsi"], ["imageUrl", "image_url"],
      ["price", "harga"], ["stock", "stok_tiket"],
      ["featured", "featured"], ["isDemo", "is_demo"],
    ];
    for (const [key, column] of entries) {
      const value = input[key];
      if (value !== undefined) { fields.push(`${column}=?`); values.push(typeof value === "boolean" ? Number(value) : value); }
    }
    if (input.startsAt !== undefined) {
      const date = parseEventDate(input.startsAt);
      fields.push("waktu=?"); values.push(toMysqlBangkok(date));
    }
    if (!fields.length) fail(400, "Tidak ada perubahan.");
    values.push(id);
    const withStockCheck = input.stock !== undefined;
    if (withStockCheck) values.push(input.expectedStock!);
    const [result] = await db().execute<ResultSetHeader>(
      `UPDATE keranjang SET ${fields.join(",")} WHERE id=?${withStockCheck ? " AND stok_tiket=?" : ""}`,
      values,
    );
    if (withStockCheck && result.affectedRows === 0) {
      fail(409, "Stok berubah sejak formulir dibuka. Muat ulang konser sebelum menyimpan.");
    }
    return NextResponse.json({ event: toEvent((await getEvent(id, true))!) });
  });
}

export function DELETE(request: Request, { params }: Params) {
  return safe(async () => {
    assertSameOrigin(request);
    await requireAdmin();
    const id = parseId((await params).id);
    if (!(await getEvent(id))) fail(404, "Konser tidak ditemukan.");
    await db().execute("UPDATE keranjang SET is_active=0 WHERE id=?", [id]);
    return NextResponse.json({ ok: true });
  });
}
