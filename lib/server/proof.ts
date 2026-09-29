import { fail } from "./http";

export const MAX_PROOF_BYTES = 4 * 1024 * 1024;

export async function readProof(value: FormDataEntryValue | null): Promise<{ data: Buffer; mime: string; name: string }> {
  if (!(value instanceof File)) fail(400, "Unggah bukti transfer terlebih dahulu.");
  if (value.size === 0 || value.size > MAX_PROOF_BYTES) fail(400, "Ukuran bukti transfer maksimal 4 MiB.");
  const bytes = Buffer.from(await value.arrayBuffer());
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isWebp = bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  const mime = isJpeg ? "image/jpeg" : isPng ? "image/png" : isWebp ? "image/webp" : null;
  if (!mime) fail(400, "Bukti transfer harus berupa JPG, PNG, atau WebP.");
  const safeName = value.name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 255) || "bukti-transfer";
  return { data: bytes, mime, name: safeName };
}
