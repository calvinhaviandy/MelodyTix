import { NextResponse } from "next/server";
import { currentUser } from "@/lib/server/auth";
import { safe } from "@/lib/server/http";

export function GET() {
  return safe(async () => NextResponse.json({ user: await currentUser() }));
}
