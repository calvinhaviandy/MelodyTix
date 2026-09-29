import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { getOrder } from "@/lib/server/models";
import { parseId } from "@/lib/server/validation";

type Params = { params: Promise<{ id: string }> };
type StatusRow = RowDataPacket & { status: string; event_id: number | null; quantity: number; stock_reserved: number };

export function PATCH(request: Request, { params }: Params) {
  return safe(async () => {
    assertSameOrigin(request);
    await requireAdmin();
    const id = parseId((await params).id);
    const { status } = z.object({ status: z.enum(["approved", "rejected"]) }).parse(await readJson(request));
    const connection = await db().getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<StatusRow[]>(
        "SELECT status,event_id,quantity,stock_reserved FROM pesanan WHERE idpesanan=? FOR UPDATE", [id],
      );
      const order = rows[0];
      if (!order) fail(404, "Pesanan tidak ditemukan.");
      if (order.status !== "pending") fail(409, "Hanya pesanan pending yang dapat diproses.");
      if (status === "rejected" && order.stock_reserved && order.event_id) {
        await connection.execute("UPDATE keranjang SET stok_tiket=stok_tiket+? WHERE id=?", [order.quantity, order.event_id]);
      }
      await connection.execute("UPDATE pesanan SET status=?,stock_reserved=? WHERE idpesanan=?", [
        status, status === "rejected" ? 0 : order.stock_reserved, id,
      ]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return NextResponse.json({ order: await getOrder(id) });
  });
}
