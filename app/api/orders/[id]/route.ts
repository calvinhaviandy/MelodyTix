import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { fail, safe } from "@/lib/server/http";
import { getOrder } from "@/lib/server/models";
import { parseId } from "@/lib/server/validation";

type Params = { params: Promise<{ id: string }> };

export function GET(_request: Request, { params }: Params) {
  return safe(async () => {
    const user = await requireUser();
    const order = await getOrder(parseId((await params).id));
    if (!order) fail(404, "Pesanan tidak ditemukan.");
    if (user.role !== "admin" && order.user?.id !== user.id) {
      fail(403, "Anda tidak dapat melihat pesanan ini.");
    }
    return NextResponse.json({ order });
  });
}
