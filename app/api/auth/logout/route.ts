import { NextResponse } from "next/server";
import { endSession } from "@/lib/server/auth";
import { assertSameOrigin, safe } from "@/lib/server/http";

export function POST(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    await endSession();
    return NextResponse.json({ ok: true });
  });
}
