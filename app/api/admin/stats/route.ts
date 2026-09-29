import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { requireAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { safe } from "@/lib/server/http";

type StatsRow = RowDataPacket & { events: number; users: number; orders: number; pending: number; approved: number; rejected: number; revenue: number };

export function GET() {
  return safe(async () => {
    await requireAdmin();
    const [rows] = await db().query<StatsRow[]>(
      `SELECT
        (SELECT COUNT(*) FROM keranjang WHERE is_active=1) AS events,
        (SELECT COUNT(*) FROM user) AS users,
        (SELECT COUNT(*) FROM pesanan) AS orders,
        (SELECT COUNT(*) FROM pesanan WHERE status='pending') AS pending,
        (SELECT COUNT(*) FROM pesanan WHERE status IN ('approved','accept')) AS approved,
        (SELECT COUNT(*) FROM pesanan WHERE status IN ('rejected','deny')) AS rejected,
        (SELECT COALESCE(SUM(total_harga),0) FROM pesanan WHERE status IN ('approved','accept')) AS revenue`,
    );
    return NextResponse.json({ stats: rows[0] });
  });
}
