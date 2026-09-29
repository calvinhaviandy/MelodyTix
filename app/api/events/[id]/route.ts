import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { getEvent, toBangkokTimestamp, toEvent } from "@/lib/server/models";
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
      if (value !== undefined) { fields.push(`${column}=$${values.length + 1}`); values.push(typeof value === "boolean" ? Number(value) : value); }
    }
    if (input.startsAt !== undefined) {
      const date = parseEventDate(input.startsAt);
      fields.push(`waktu=$${values.length + 1}`); values.push(toBangkokTimestamp(date));
    }
    if (!fields.length) fail(400, "Tidak ada perubahan.");
    values.push(id);
    const withStockCheck = input.stock !== undefined;
    if (withStockCheck) values.push(input.expectedStock!);
    const result = await db().query(
      `UPDATE keranjang SET ${fields.join(",")} WHERE id=$${fields.length + 1}${withStockCheck ? ` AND stok_tiket=$${fields.length + 2}` : ""}`,
      values,
    );
    if (withStockCheck && result.rowCount === 0) {
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
    await db().query("UPDATE keranjang SET is_active=0 WHERE id=$1", [id]);
    return NextResponse.json({ ok: true });
  });
}
