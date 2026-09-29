import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { safe } from "@/lib/server/http";
import { listOrders } from "@/lib/server/models";

export function GET() {
  return safe(async () => {
    await requireAdmin();
    return NextResponse.json({ orders: await listOrders() });
  });
}
