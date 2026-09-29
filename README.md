# MelodyTix

MelodyTix adalah aplikasi tiket konser berbasis **Next.js 16, React 19, TypeScript, MariaDB, dan Motion**. Situs ini berjalan sebagai demo lokal. Konser bawaan berlabel `[DEMO]`; alur unggah bukti hanya untuk simulasi dan **tidak meminta transfer uang sungguhan**.

## Fitur

- Katalog konser dengan pencarian, filter kota dan ketersediaan, serta detail acara.
- Pendaftaran, login, profil, dan penggantian kata sandi.
- Pemesanan tiket dengan pemeriksaan stok secara transaksional, unggah gambar simulasi, riwayat, status, dan invoice yang bisa dicetak setelah disetujui.
- Dashboard admin untuk mengelola konser, meninjau pesanan, melihat bukti secara privat, dan mengelola peran pengguna.
- Tampilan responsif dan animasi yang mengikuti pengaturan *reduced motion* perangkat.

## Kebutuhan

- Node.js 20.9 atau lebih baru dan npm.
- MariaDB/MySQL lokal yang berjalan. Database default bernama `db_concert`.
- Google Chrome jika ingin menjalankan pengujian browser Playwright.

Tidak ada dependensi PHP, Composer, atau bundler lama untuk aplikasi baru.

## Menjalankan di lokal

```powershell
git clone https://github.com/calvinhaviandy/MelodyTix.git
cd MelodyTix
npm install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Isi `.env.local` dengan koneksi database dan `ADMIN_PASSWORD` yang kuat. File ini diabaikan Git. Untuk instalasi MariaDB via WinGet yang tidak memasang service, server dapat dijalankan di PowerShell dengan:

```powershell
$mariaHome = (Get-ChildItem "$env:ProgramFiles\MariaDB *" -Directory | Select-Object -First 1).FullName
$mariaServer = Join-Path $mariaHome 'bin\mariadbd.exe'
$mariaConfig = Join-Path $mariaHome 'data\my.ini'
Start-Process -FilePath $mariaServer -ArgumentList @("--defaults-file=`"$mariaConfig`"", '--bind-address=127.0.0.1', '--innodb-buffer-pool-size=128M') -WindowStyle Hidden
```

Jalankan migrasi, buat data demo, lalu mulai situs dari akar repository:

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

Buka [http://127.0.0.1:8000](http://127.0.0.1:8000). `npm run db:migrate` aman dijalankan ulang dan menambah kolom/tabel tanpa menghapus data lama. `npm run db:seed` aman dijalankan ulang; ia membuat enam konser demo dan satu admin dari `ADMIN_EMAIL`/`ADMIN_PASSWORD` bila belum ada. Akun lama dengan hash MD5 akan diperbarui ke bcrypt saat login berhasil.

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

Suite Playwright mencakup API serta alur browser desktop dan mobile. Pengujian membuat akun/pesanan khusus sementara dan membersihkannya setelah selesai. Jika situs berjalan di port lain, atur `E2E_BASE_URL` untuk sesi PowerShell tersebut.

## Struktur utama

- `app/` — halaman React dan API Next.js.
- `components/` — komponen antarmuka.
- `lib/server/` — autentikasi, koneksi database, dan model server.
- `database/` — skema awal dan migrasi tambahan.
- `scripts/` — migrasi dan data demo.
- `tests/e2e/` — pengujian Playwright.

Nomor rekening pada aplikasi PHP lama adalah contoh dan tidak digunakan. Untuk menerima pembayaran nyata, integrasi penyedia pembayaran dan proses operasional perlu disiapkan secara terpisah.

Jika nanti dihosting melalui HTTPS, atur `COOKIE_SECURE=true`. Pada demo lokal HTTP, biarkan `false`. Pesanan yang menunggu verifikasi menahan stok sampai admin menyetujui atau menolaknya; penerapan publik memerlukan kebijakan kedaluwarsa/cancel tambahan.
