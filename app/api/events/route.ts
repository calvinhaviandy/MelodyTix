import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { getEvent, toBangkokTimestamp, toEvent, type EventRow } from "@/lib/server/models";
import { eventSchema, parseEventDate } from "@/lib/server/validation";

export const runtime = "nodejs";

export function GET() {
  return safe(async () => {
    const { rows } = await db().query<EventRow>("SELECT * FROM keranjang WHERE is_active=1 ORDER BY waktu ASC,id ASC");
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
    const { rows } = await db().query<{ id: number }>(
      `INSERT INTO keranjang (nama_konser,waktu,gambar,harga,stok_tiket,deskripsi,venue,city,featured,is_demo,image_url,is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,1) RETURNING id`,
      [input.title, toBangkokTimestamp(date), "melodytix5.png", input.price, input.stock, input.description,
        input.venue, input.city, Number(input.featured ?? false), Number(input.isDemo ?? false), input.imageUrl],
    );
    const event = await getEvent(rows[0].id);
    return NextResponse.json({ event: toEvent(event!) }, { status: 201 });
  });
}
