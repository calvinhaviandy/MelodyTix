import { requireUser } from "@/lib/server/auth";
import { db, type QueryResultRow } from "@/lib/server/db";
import { fail, safe } from "@/lib/server/http";
import { parseId } from "@/lib/server/validation";

type Params = { params: Promise<{ id: string }> };
type ProofRow = QueryResultRow & { user_id: number | null; username: string; buktitf: Buffer; tipe_file: string; proof_name: string | null };

export function GET(_request: Request, { params }: Params) {
  return safe(async () => {
    const user = await requireUser();
    const id = parseId((await params).id);
    const { rows } = await db().query<ProofRow>(
      "SELECT user_id,username,buktitf,tipe_file,proof_name FROM pesanan WHERE idpesanan=$1 LIMIT 1", [id],
    );
    const proof = rows[0];
    if (!proof) fail(404, "Bukti transfer tidak ditemukan.");
    if (user.role !== "admin" && proof.user_id !== user.id) {
      fail(403, "Anda tidak dapat melihat bukti transfer ini.");
    }
    const mime = ["image/jpeg", "image/png", "image/webp"].includes(proof.tipe_file) ? proof.tipe_file : "application/octet-stream";
    const name = (proof.proof_name || `bukti-${id}`).replace(/[^a-zA-Z0-9._ -]/g, "_");
    return new Response(new Uint8Array(proof.buktitf), {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `inline; filename="${name}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  });
}
