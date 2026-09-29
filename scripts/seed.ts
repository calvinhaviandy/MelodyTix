import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { Client } from "pg";
import { postgresConnectionString } from "../lib/server/db";

loadEnvConfig(process.cwd());

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";
if (!adminEmail || !adminPassword || adminPassword.length < 8) {
  throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 8 characters) before seeding.");
}

type UserRow = { id: number; level: string };

const demos = [
  { title: "[DEMO] Sheila on 7 — Menjemput Mimpi", days: 35, city: "Jakarta", venue: "Istora Senayan", image: "sheila.jpg", price: 425000, stock: 160, featured: true, description: "Malam penuh lagu yang tumbuh bersama kita. Saksikan pertunjukan demo Sheila on 7 dengan energi panggung dan singalong yang tak terlupakan." },
  { title: "[DEMO] NOAH — Suara Dalam", days: 49, city: "Bandung", venue: "Eldorado Dome", image: "noah.jpg", price: 390000, stock: 140, featured: true, description: "Jelajahi perjalanan musik dan nostalgia dalam konser demo NOAH. Informasi acara ini hanya untuk mencoba fitur MelodyTix." },
  { title: "[DEMO] Hindia — Di Ujung Malam", days: 63, city: "Yogyakarta", venue: "Jogja Expo Center", image: "hindia.jpg", price: 315000, stock: 180, featured: true, description: "Lagu, cerita, dan ruang untuk bernyanyi bersama. Acara demo ini dibuat untuk pengalaman mencoba aplikasi." },
  { title: "[DEMO] MALIQ & D'Essentials — Satu Frekuensi", days: 77, city: "Surabaya", venue: "Grand City Convention Hall", image: "maliq.jpeg", price: 350000, stock: 200, featured: false, description: "Nikmati groove hangat dan hits favorit dalam suasana intim. Ini adalah data demo untuk pengujian aplikasi." },
  { title: "[DEMO] Dewa 19 — Lintas Generasi", days: 91, city: "Jakarta", venue: "Beach City International Stadium", image: "dewa2.jpg", price: 495000, stock: 220, featured: false, description: "Satu panggung, puluhan lagu ikonik, dan malam yang penuh kenangan. Acara ini adalah konten demo MelodyTix." },
  { title: "[DEMO] Coldplay — Music of the Spheres", days: 105, city: "Jakarta", venue: "Gelora Bung Karno", image: "coldplay.jpeg", price: 525000, stock: 120, featured: false, description: "Rasakan atmosfer stadium dan visual penuh warna dalam konser bertema Coldplay. Ini hanya konten demo untuk pengujian aplikasi lokal." },
];

function bangkokDatetime(daysAhead: number): string {
  const when = new Date(Date.now() + daysAhead * 86400_000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(when);
  const part = (type: string) => parts.find((value) => value.type === type)?.value || "00";
  return `${part("year")}-${part("month")}-${part("day")} 19:00:00`;
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Set DATABASE_URL_UNPOOLED or DATABASE_URL before seeding PostgreSQL.");
  const client = new Client({ connectionString: postgresConnectionString(connectionString) });
  await client.connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query<UserRow>("SELECT id,level FROM \"user\" WHERE email=$1 LIMIT 1", [adminEmail]);
    if (existing.rows[0] && existing.rows[0].level !== "admin") {
      throw new Error("ADMIN_EMAIL belongs to an existing customer. Choose a different email; seed will not promote a customer silently.");
    }
    if (!existing.rows[0]) {
      const username = (process.env.ADMIN_USERNAME?.trim() || "melodytix_admin").slice(0, 100);
      const hash = await bcrypt.hash(adminPassword, 12);
      await client.query(
        "INSERT INTO \"user\" (username,password,nama,email,level) VALUES ($1,$2,$3,$4,'admin')",
        [username, hash, process.env.ADMIN_NAME?.trim() || "MelodyTix Admin", adminEmail],
      );
      console.log(`Created admin account ${adminEmail}.`);
    } else {
      console.log(`Admin account ${adminEmail} already exists; password unchanged.`);
    }

    // Repair an early local demo row that referenced an image no longer shipped.
    const replacement = demos[5];
    const replacementExists = await client.query<{ id: number }>(
      "SELECT id FROM keranjang WHERE nama_konser=$1 LIMIT 1", [replacement.title],
    );
    if (!replacementExists.rows.length) {
      await client.query(
        `UPDATE keranjang SET nama_konser=$1,gambar=$2,image_url=$3,city=$4,venue=$5,harga=$6,deskripsi=$7
         WHERE nama_konser='[DEMO] Seventeen — Cerita Kita' AND is_demo=1`,
        [replacement.title, replacement.image, `/images/${replacement.image}`, replacement.city,
          replacement.venue, replacement.price, replacement.description],
      );
    }

    let created = 0;
    for (const demo of demos) {
      const rows = await client.query<{ id: number }>(
        "SELECT id FROM keranjang WHERE nama_konser=$1 LIMIT 1", [demo.title],
      );
      if (rows.rows.length) continue;
      await client.query(
        `INSERT INTO keranjang
         (nama_konser,waktu,gambar,harga,stok_tiket,deskripsi,venue,city,featured,is_demo,is_active,image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,1,$11)`,
        [demo.title, bangkokDatetime(demo.days), demo.image, demo.price, demo.stock,
          demo.description, demo.venue, demo.city, Number(demo.featured), 1, `/images/${demo.image}`],
      );
      created++;
    }
    await client.query("COMMIT");
    console.log(`Demo seed complete: ${created} new events; ${demos.length - created} already present.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
