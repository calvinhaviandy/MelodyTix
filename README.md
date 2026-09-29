# MelodyTix

MelodyTix adalah aplikasi tiket konser berbasis **Next.js 16, React 19, TypeScript, PostgreSQL (Neon), dan Motion**. Konser bawaan berlabel `[DEMO]`; alur unggah bukti hanya untuk simulasi dan **tidak meminta transfer uang sungguhan**.

## Fitur

- Katalog konser dengan pencarian, filter kota dan ketersediaan, serta detail acara.
- Pendaftaran, login, profil, dan penggantian kata sandi.
- Pemesanan tiket dengan pemeriksaan stok secara transaksional, unggah gambar simulasi, riwayat, status, dan invoice yang bisa dicetak setelah disetujui.
- Dashboard admin untuk mengelola konser, meninjau pesanan, melihat bukti secara privat, dan mengelola peran pengguna.
- Tampilan responsif dan animasi yang mengikuti pengaturan *reduced motion* perangkat.

## Kebutuhan

- Node.js 20.9 atau lebih baru dan npm.
- Database PostgreSQL, misalnya cabang development Neon dari integrasi Vercel atau server PostgreSQL lokal.
- Google Chrome jika ingin menjalankan pengujian browser Playwright.

Tidak ada dependensi PHP, Composer, atau bundler lama untuk aplikasi baru.

## Menjalankan di lokal

```powershell
git clone https://github.com/calvinhaviandy/MelodyTix.git
cd MelodyTix
npm install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Isi `DATABASE_URL` di `.env.local` dengan connection string PostgreSQL untuk **development** dan ganti `ADMIN_PASSWORD` dengan kata sandi kuat. URL Neon biasanya berisi `sslmode=require`; jika menggunakan PostgreSQL lokal tanpa TLS, hapus parameter itu. Gunakan cabang/database Neon terpisah dari Production saat mengembangkan atau menjalankan tes. Jika `DATABASE_URL_UNPOOLED` juga diisi, pastikan kedua URL menunjuk ke cabang/database yang sama karena skrip migrasi dan seed mengutamakan URL langsung. File `.env.local` diabaikan Git dan tidak boleh dibagikan.

Jalankan migrasi, buat data demo, lalu mulai situs dari akar repository:

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

Buka [http://127.0.0.1:8000](http://127.0.0.1:8000). `npm run db:migrate` menyiapkan skema PostgreSQL dan aman dijalankan ulang. `npm run db:seed` membuat enam konser demo dan satu admin dari `ADMIN_EMAIL`/`ADMIN_PASSWORD` bila belum ada. Akun lama dengan hash MD5, jika diimpor dari sistem lama, akan diperbarui ke bcrypt saat login berhasil.

Untuk menjalankan hasil build:

```powershell
npm run build
npm run start
```

## Pengujian

Saat situs berjalan di port 8000:

```powershell
npm run typecheck
npm run test:e2e
```

Suite Playwright mencakup API serta alur browser desktop dan mobile. Pengujian membuat akun/pesanan khusus sementara dan membersihkannya setelah selesai. Pastikan `DATABASE_URL` yang dibaca Playwright menunjuk ke **database yang sama** dengan situs lokal. Gunakan cabang/database development; jangan arahkan pengujian ke Production. Jika situs berjalan di port lain, atur `E2E_BASE_URL` untuk sesi PowerShell tersebut.

## Struktur utama

- `app/` — halaman React dan API Next.js.
- `components/` — komponen antarmuka.
- `lib/server/` — autentikasi, koneksi database, dan model server.
- `database/` — skema awal dan migrasi tambahan.
- `scripts/` — migrasi dan data demo.
- `tests/e2e/` — pengujian Playwright.

## Deploy ke Vercel

Gunakan integrasi **Neon PostgreSQL** dari [Vercel Marketplace](https://vercel.com/marketplace/neon/neon). Buat resource Neon baru untuk proyek MelodyTix dan hubungkan ke lingkungan Production. Integrasi menyediakan `DATABASE_URL` secara otomatis; aplikasi memakainya untuk semua akses database. Pilih region Neon Singapore (`ap-southeast-1`) yang dekat dengan region fungsi Vercel `sin1` di `vercel.json`.

Setelah resource terhubung, periksa **Vercel Project → Settings → Environment Variables** untuk Production:

| Variabel | Isi |
| --- | --- |
| `DATABASE_URL` | Connection string PostgreSQL dari integrasi Neon; wajib |
| `DATABASE_URL_UNPOOLED` | Connection string langsung dari integrasi Neon; opsional untuk skrip migrasi/seed |
| `COOKIE_SECURE` | `true` untuk domain HTTPS Vercel |

Jalankan `npm run db:migrate` dan `npm run db:seed` dari mesin lokal dengan `DATABASE_URL` yang menunjuk ke **database Neon Production** sebelum menguji deployment Production. Gunakan `ADMIN_PASSWORD` baru untuk admin Production. Variabel `ADMIN_EMAIL` dan `ADMIN_PASSWORD` hanya dipakai saat menjalankan seed; jangan simpan keduanya sebagai variabel runtime Vercel. Data dari MariaDB lama tidak tersalin otomatis ke PostgreSQL; skema dan data demo dibuat baru oleh perintah tersebut. Simpan URL database dan kredensial di luar Git.

Untuk Preview dan Development, hubungkan cabang/database Neon terpisah supaya perubahan skema dan data tes tidak memengaruhi Production. Perubahan variabel Vercel hanya berlaku untuk deployment baru; lakukan deploy ulang setelah menggantinya. [Vercel menjelaskan](https://vercel.com/docs/postgres) bahwa database PostgreSQL baru disediakan melalui integrasi Marketplace, dan [variabel lingkungan](https://vercel.com/docs/environment-variables) diinjeksi ke deployment berikutnya.

Unggahan bukti simulasi dibatasi **4 MiB** agar tetap di bawah batas payload Vercel Functions sebesar 4,5 MB. Bukti disimpan sebagai `BYTEA` dalam PostgreSQL, bukan di filesystem Vercel. Akun Hobby Vercel dibatasi untuk penggunaan pribadi nonkomersial; penjualan tiket sungguhan memerlukan paket yang sesuai dan integrasi pembayaran nyata.

Nomor rekening pada aplikasi PHP lama adalah contoh dan tidak digunakan. Untuk menerima pembayaran nyata, integrasi penyedia pembayaran dan proses operasional perlu disiapkan secara terpisah.

Pada demo lokal HTTP, biarkan `COOKIE_SECURE=false`; URL Neon tetap memakai TLS melalui `sslmode=require`. Pesanan yang menunggu verifikasi menahan stok sampai admin menyetujui atau menolaknya; penerapan publik memerlukan kebijakan kedaluwarsa/cancel tambahan.
