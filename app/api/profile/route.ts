import { NextResponse } from "next/server";
import { findUserById, requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { assertSameOrigin, readJson, safe } from "@/lib/server/http";
import { profileSchema } from "@/lib/server/validation";

export function GET() {
  return safe(async () => NextResponse.json({ user: await requireUser() }));
}

export function PATCH(request: Request) {
  return safe(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = profileSchema.parse(await readJson(request));
    const fields: string[] = [];
    const values: (string | number)[] = [];
    if (input.name !== undefined) { fields.push("nama=?"); values.push(input.name); }
    if (input.username !== undefined) { fields.push("username=?"); values.push(input.username); }
    if (input.email !== undefined) { fields.push("email=?"); values.push(input.email.toLowerCase()); }
    values.push(user.id);
    await db().execute(`UPDATE user SET ${fields.join(",")} WHERE id=?`, values);
    return NextResponse.json({ user: await findUserById(user.id) });
  });
}
