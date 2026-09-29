import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/auth";
import { db, type QueryResultRow } from "@/lib/server/db";
import { assertSameOrigin, fail, readJson, safe } from "@/lib/server/http";
import { getOrder } from "@/lib/server/models";
import { parseId } from "@/lib/server/validation";

type Params = { params: Promise<{ id: string }> };
type StatusRow = QueryResultRow & { status: string; event_id: number | null; quantity: number; stock_reserved: number };

export function PATCH(request: Request, { params }: Params) {
  return safe(async () => {
    assertSameOrigin(request);
    await requireAdmin();
    const id = parseId((await params).id);
    const { status } = z.object({ status: z.enum(["approved", "rejected"]) }).parse(await readJson(request));
    const connection = await db().connect();
    try {
      await connection.query("BEGIN");
      const { rows } = await connection.query<StatusRow>(
        "SELECT status,event_id,quantity,stock_reserved FROM pesanan WHERE idpesanan=$1 FOR UPDATE", [id],
      );
      const order = rows[0];
      if (!order) fail(404, "Pesanan tidak ditemukan.");
      if (order.status !== "pending") fail(409, "Hanya pesanan pending yang dapat diproses.");
      if (status === "rejected" && order.stock_reserved && order.event_id) {
        await connection.query("UPDATE keranjang SET stok_tiket=stok_tiket+$1 WHERE id=$2", [order.quantity, order.event_id]);
      }
      await connection.query("UPDATE pesanan SET status=$1,stock_reserved=$2 WHERE idpesanan=$3", [
        status, status === "rejected" ? 0 : order.stock_reserved, id,
      ]);
      await connection.query("COMMIT");
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
    return NextResponse.json({ order: await getOrder(id) });
  });
}
