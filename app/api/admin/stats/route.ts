import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { db, type QueryResultRow } from "@/lib/server/db";
import { safe } from "@/lib/server/http";

type StatsRow = QueryResultRow & { events: string; users: string; orders: string; pending: string; approved: string; rejected: string; revenue: string };

export function GET() {
  return safe(async () => {
    await requireAdmin();
    const { rows } = await db().query<StatsRow>(
      `SELECT
        (SELECT COUNT(*) FROM keranjang WHERE is_active=1) AS events,
        (SELECT COUNT(*) FROM "user") AS users,
        (SELECT COUNT(*) FROM pesanan) AS orders,
        (SELECT COUNT(*) FROM pesanan WHERE status='pending') AS pending,
        (SELECT COUNT(*) FROM pesanan WHERE status IN ('approved','accept')) AS approved,
        (SELECT COUNT(*) FROM pesanan WHERE status IN ('rejected','deny')) AS rejected,
        (SELECT COALESCE(SUM(total_harga),0) FROM pesanan WHERE status IN ('approved','accept')) AS revenue`,
    );
    return NextResponse.json({ stats: Object.fromEntries(Object.entries(rows[0]).map(([key, value]) => [key, Number(value)])) });
  });
}
