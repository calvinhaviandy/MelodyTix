import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, safe } from "@/lib/server/http";
import { getOrder, listOrders, toEvent, type EventRow } from "@/lib/server/models";
import { readProof } from "@/lib/server/proof";

export const runtime = "nodejs";

export function GET() {
  return safe(async () => {
    const user = await requireUser();
    const orders = await listOrders("WHERE p.user_id=$1", [user.id]);
    return NextResponse.json({ orders });
  });
}

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    let form: FormData;
    try { form = await request.formData(); } catch { fail(400, "Form pemesanan tidak valid."); }
    const eventId = Number(form.get("eventId"));
    const quantity = Number(form.get("quantity"));
    if (!Number.isSafeInteger(eventId) || eventId <= 0) fail(400, "Konser tidak valid.");
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10) fail(400, "Jumlah tiket harus antara 1 sampai 10.");
    const proof = await readProof(form.get("proof"));
    const connection = await db().connect();
    let orderId: number;
    try {
      await connection.query("BEGIN");
      const { rows } = await connection.query<EventRow>("SELECT * FROM keranjang WHERE id=$1 AND is_active=1 FOR UPDATE", [eventId]);
      const event = rows[0];
      if (!event) fail(404, "Konser tidak ditemukan.");
      if (new Date(toEvent(event).startsAt).getTime() <= Date.now()) fail(400, "Penjualan tiket konser ini telah ditutup.");
      if (Number(event.stok_tiket) < quantity) fail(409, "Stok tiket tidak mencukupi.");
      await connection.query("UPDATE keranjang SET stok_tiket=stok_tiket-$1 WHERE id=$2", [quantity, eventId]);
      const total = Number(event.harga) * quantity;
      const { rows: inserted } = await connection.query<{ idpesanan: number }>(
        `INSERT INTO pesanan
         (username,nama_konser,quantity,total_harga,buktitf,tipe_file,status,user_id,event_id,proof_name,stock_reserved)
         VALUES ($1,$2,$3,$4,$5,$6,'pending',$7,$8,$9,1) RETURNING idpesanan`,
        [user.username, event.nama_konser, quantity, total, proof.data, proof.mime, user.id, eventId, proof.name],
      );
      orderId = inserted[0].idpesanan;
      await connection.query("COMMIT");
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
    return NextResponse.json({ order: await getOrder(orderId!) }, { status: 201 });
  });
}
