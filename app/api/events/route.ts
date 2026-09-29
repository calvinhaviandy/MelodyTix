import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { getEvent, toEvent, toMysqlBangkok, type EventRow } from "@/lib/server/models";
import { eventSchema, parseEventDate } from "@/lib/server/validation";

export const runtime = "nodejs";

export function GET() {
  return safe(async () => {
    const [rows] = await db().query<EventRow[]>("SELECT * FROM keranjang WHERE is_active=1 ORDER BY waktu ASC,id ASC");
    return NextResponse.json({ events: rows.map(toEvent) });
  });
}

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    await requireAdmin();
    const input = eventSchema.parse(await readJson(request));
    const date = parseEventDate(input.startsAt);
    if (date.getTime() <= Date.now()) fail(400, "Waktu konser harus di masa mendatang.");
    const [result] = await db().execute<ResultSetHeader>(
      `INSERT INTO keranjang (nama_konser,waktu,gambar,harga,stok_tiket,deskripsi,venue,city,featured,is_demo,image_url,is_active)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,1)`,
      [input.title, toMysqlBangkok(date), "melodytix5.png", input.price, input.stock, input.description,
        input.venue, input.city, Number(input.featured ?? false), Number(input.isDemo ?? false), input.imageUrl],
    );
    const event = await getEvent(result.insertId);
    return NextResponse.json({ event: toEvent(event!) }, { status: 201 });
  });
}
