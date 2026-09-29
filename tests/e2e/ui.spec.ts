import { randomBytes } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { expect, request as playwrightRequest, test, type APIRequestContext, type Page } from "@playwright/test";
import mysql, { type RowDataPacket } from "mysql2/promise";

loadEnvConfig(process.cwd());

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:8000";
const runId = `${Date.now()}_${randomBytes(3).toString("hex")}`;
const password = `CodexUI!${runId}`;
const proofPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==",
  "base64",
);

type Event = { id: number; title: string; stock: number; price: number; city: string };
type User = { id: number; username: string; email: string };
type Order = { id: number; status: string };

const usernames = new Set<string>();
const eventTitles = new Set<string>();
const apiContexts: APIRequestContext[] = [];

async function apiContext(): Promise<APIRequestContext> {
  const api = await playwrightRequest.newContext({ baseURL });
  apiContexts.push(api);
  return api;
}

async function adminApi(): Promise<APIRequestContext> {
  expect(process.env.ADMIN_EMAIL, "ADMIN_EMAIL harus tersedia di .env.local").toBeTruthy();
  expect(process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD harus tersedia di .env.local").toBeTruthy();
  const api = await apiContext();
  const response = await api.post("/api/auth/login", {
    data: { identifier: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
  });
  expect(response.status(), (await response.text()).slice(0, 300)).toBe(200);
  return api;
}

async function createEvent(api: APIRequestContext, label: string, options: { city?: string; stock?: number } = {}): Promise<Event> {
  const title = `codex_e2e_${runId}_${label} Live`;
  eventTitles.add(title);
  const response = await api.post("/api/events", {
    data: {
      title,
      startsAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      venue: "Arena E2E",
      city: options.city ?? "Bandung",
      description: "Konser sementara untuk uji browser MelodyTix.",
      imageUrl: "/images/sheila.jpg",
      price: 125000,
      stock: options.stock ?? 5,
      featured: false,
      isDemo: true,
    },
  });
  expect(response.status(), (await response.text()).slice(0, 300)).toBe(201);
  return ((await response.json()) as { event: Event }).event;
}

async function createCustomer(label: string): Promise<{ api: APIRequestContext; user: User }> {
  const username = `codex_e2e_${runId}_${label}`;
  const email = `${username}@example.test`;
  usernames.add(username);
  const api = await apiContext();
  const response = await api.post("/api/auth/register", {
    data: { name: `Test ${label}`, username, email, password },
  });
  expect(response.status(), (await response.text()).slice(0, 300)).toBe(201);
  return { api, user: ((await response.json()) as { user: User }).user };
}

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.page, `Page width ${dimensions.page}px exceeds viewport ${dimensions.viewport}px`).toBeLessThanOrEqual(dimensions.viewport + 2);
}

test.describe("MelodyTix browser flows", () => {
  test.setTimeout(90_000);

  test.afterAll(async () => {
    await Promise.all(apiContexts.map((api) => api.dispose()));
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "db_concert",
    });
    try {
      const userIds: number[] = [];
      const eventIds: number[] = [];
      for (const username of usernames) {
        const [rows] = await connection.execute<(RowDataPacket & { id: number })[]>(
          "SELECT id FROM `user` WHERE username=?", [username],
        );
        userIds.push(...rows.map((row) => row.id));
      }
      for (const title of eventTitles) {
        const [rows] = await connection.execute<(RowDataPacket & { id: number })[]>(
          "SELECT id FROM keranjang WHERE nama_konser=?", [title],
        );
        eventIds.push(...rows.map((row) => row.id));
      }
      await connection.beginTransaction();
      if (userIds.length || eventIds.length) {
        const clauses: string[] = [];
        const params: number[] = [];
        if (userIds.length) {
          clauses.push(`user_id IN (${userIds.map(() => "?").join(",")})`);
          params.push(...userIds);
        }
        if (eventIds.length) {
          clauses.push(`event_id IN (${eventIds.map(() => "?").join(",")})`);
          params.push(...eventIds);
        }
        await connection.execute(`DELETE FROM pesanan WHERE ${clauses.join(" OR ")}`, params);
      }
      for (const id of eventIds) await connection.execute("DELETE FROM keranjang WHERE id=?", [id]);
      for (const id of userIds) await connection.execute("DELETE FROM `user` WHERE id=?", [id]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  });

  test("landing search, filters, event detail, quantity, and responsive navigation", async ({ page }, testInfo) => {
    const admin = await adminApi();
    const available = await createEvent(admin, "discover", { city: "Bandung", stock: 5 });
    const soldOut = await createEvent(admin, "soldout", { city: "Surabaya", stock: 0 });

    await page.goto("/");
    await expect(page.locator(".home-hero h1")).toContainText("Datang untuk");
    const availableCard = page.getByRole("link", { name: `Lihat ${available.title}` });
    const soldOutCard = page.getByRole("link", { name: `Lihat ${soldOut.title}` });
    await expect(availableCard).toBeVisible();
    await expect(soldOutCard).toBeVisible();
    await assertNoHorizontalOverflow(page);

    const search = page.getByRole("textbox", { name: "Cari konser" });
    await search.fill(available.title);
    await expect(availableCard).toBeVisible();
    await expect(soldOutCard).toHaveCount(0);
    await search.clear();
    await page.getByLabel("Filter kota").selectOption({ label: "Bandung" });
    await expect(availableCard).toBeVisible();
    await expect(soldOutCard).toHaveCount(0);
    await page.getByLabel("Filter kota").selectOption({ label: "Semua kota" });
    await page.getByLabel("Filter ketersediaan").selectOption({ label: "Habis" });
    await expect(soldOutCard).toBeVisible();
    await expect(availableCard).toHaveCount(0);
    await page.getByLabel("Filter ketersediaan").selectOption({ label: "Semua" });

    await availableCard.click();
    await expect(page.getByRole("heading", { name: available.title })).toBeVisible();
    await expect(page.getByText("EVENT DEMO")).toBeVisible();
    await expect(page.getByText("Jangan lakukan transfer uang sungguhan.", { exact: false })).toBeVisible();
    await expect(page.locator(".booking-total strong")).toContainText("125.000");
    await page.getByRole("button", { name: "Tambah jumlah" }).click();
    await expect(page.locator(".stepper span")).toHaveText("2");
    await expect(page.locator(".booking-total strong")).toContainText("250.000");
    await page.getByRole("button", { name: "Kurangi jumlah" }).click();
    await expect(page.locator(".stepper span")).toHaveText("1");
    await expect(page.getByRole("button", { name: "Masuk untuk pesan" })).toBeVisible();
    await assertNoHorizontalOverflow(page);

    if (testInfo.project.name === "mobile-chrome") {
      await page.getByRole("button", { name: "Buka menu" }).click();
      const mobileNav = page.getByRole("navigation", { name: "Navigasi seluler" });
      await expect(mobileNav.getByRole("link", { name: "Jelajahi konser" })).toBeVisible();
      await mobileNav.getByRole("link", { name: "Masuk" }).click();
      await expect(page).toHaveURL(/\/login$/);
    } else {
      await page.getByRole("link", { name: "Masuk", exact: true }).click();
      await expect(page).toHaveURL(/\/login$/);
    }
    await expect(page.getByRole("heading", { name: "Masuk ke ritme." })).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Buat akunmu." })).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "Masuk untuk melihat akunmu" })).toBeVisible();
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Akses khusus admin" })).toBeVisible();
  });

  test("register, demo order, account settings, logout and login", async ({ page }, testInfo) => {
    const admin = await adminApi();
    const concert = await createEvent(admin, "customerflow", { stock: 5 });
    const username = `codex_e2e_${runId}_browser_${testInfo.project.name.replace(/[^a-z]/g, "")}`;
    const email = `${username}@example.test`;
    usernames.add(username);

    await page.goto("/register");
    await page.getByLabel("Nama lengkap").fill("Test Browser Melody");
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Kata sandi").fill(password);
    await page.getByRole("button", { name: "Daftar sekarang" }).click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.locator(".page-heading h1")).toContainText("Halo, Test");
    await assertNoHorizontalOverflow(page);

    await page.goto(`/events/${concert.id}`);
    await expect(page.getByRole("heading", { name: concert.title })).toBeVisible();
    await page.getByRole("button", { name: "Tambah jumlah" }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: "codex-e2e-proof.png", mimeType: "image/png", buffer: proofPng,
    });
    await expect(page.getByText("codex-e2e-proof.png")).toBeVisible();
    await page.getByRole("button", { name: "Pesan tiket" }).click();
    await expect(page).toHaveURL(/\/orders\/\d+$/);
    await expect(page.getByRole("heading", { name: "Detail pesanan." })).toBeVisible();
    await expect(page.getByRole("heading", { name: concert.title })).toBeVisible();
    await expect(page.getByText("Menunggu verifikasi").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Lihat bukti yang diunggah" })).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "Riwayat pesanan" })).toBeVisible();
    await expect(page.getByRole("link", { name: new RegExp(concert.title) })).toBeVisible();
    await page.getByRole("button", { name: "Profil" }).click();
    await page.getByLabel("Nama lengkap").fill("Browser Setelah Edit");
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByRole("status")).toContainText("Profil berhasil diperbarui");
    await page.getByRole("button", { name: "Keamanan" }).click();
    await page.getByLabel("Kata sandi saat ini").fill(password);
    const newPassword = `New!${password}`;
    await page.getByLabel("Kata sandi baru").fill(newPassword);
    await page.getByRole("button", { name: "Ubah kata sandi" }).click();
    await expect(page.getByRole("status")).toContainText("Kata sandi berhasil diubah");
    await assertNoHorizontalOverflow(page);

    let logout = page.getByRole("button", { name: "Keluar", exact: true });
    if (!(await logout.isVisible()) && testInfo.project.name === "mobile-chrome") {
      await page.getByRole("button", { name: "Buka menu" }).click({ timeout: 10_000 });
      logout = page.getByRole("navigation", { name: "Navigasi seluler" }).getByRole("button", { name: "Keluar" });
    }
    await expect(logout).toBeVisible();
    await logout.click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/login");
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Kata sandi").fill(newPassword);
    await page.getByRole("button", { name: "Masuk", exact: true }).click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.locator(".page-heading h1")).toContainText("Halo, Browser");
  });

  test("admin manages an event and user, approves an order, and customer can print invoice", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill(process.env.ADMIN_EMAIL || "");
    await page.getByLabel("Kata sandi").fill(process.env.ADMIN_PASSWORD || "");
    await page.getByRole("button", { name: "Masuk", exact: true }).click();
    await expect(page).toHaveURL(/\/account$/);
    await page.goto("/admin/events");
    await expect(page.getByRole("heading", { name: "Kelola konser." })).toBeVisible();
    await assertNoHorizontalOverflow(page);

    const title = `codex_e2e_${runId}_adminui Live`;
    eventTitles.add(title);
    await page.getByRole("button", { name: "Tambah konser" }).first().click();
    const modal = page.getByRole("dialog", { name: "Tambah konser" });
    await modal.getByLabel("Nama konser").fill(title);
    await modal.getByLabel("Tanggal & waktu (WIB)").fill(new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
    await modal.getByLabel("Kota").fill("Jakarta");
    await modal.getByLabel("Venue").fill("Arena Pertama");
    await modal.getByLabel("Harga tiket (Rp)").fill("75000");
    await modal.getByLabel("Stok tiket").fill("3");
    await modal.getByLabel("Deskripsi").fill("Acara demo sementara untuk uji manajemen konser.");
    await modal.getByRole("button", { name: "Simpan konser" }).click();
    await expect(page.locator(".form-success")).toContainText("Konser berhasil ditambahkan");
    const eventRow = page.locator(".admin-event-row").filter({ hasText: title });
    await expect(eventRow).toBeVisible();
    await eventRow.getByRole("button", { name: `Edit ${title}` }).click();
    const editModal = page.getByRole("dialog", { name: "Edit konser" });
    await editModal.getByLabel("Venue").fill("Arena Setelah Edit");
    await editModal.getByRole("button", { name: "Simpan konser" }).click();
    await expect(page.locator(".form-success")).toContainText("Konser berhasil diperbarui");

    const admin = await adminApi();
    const listingResponse = await admin.get("/api/events");
    expect(listingResponse.status()).toBe(200);
    const listing = (await listingResponse.json()) as { events: Event[] };
    const concert = listing.events.find((event) => event.title === title);
    expect(concert).toBeTruthy();
    const customer = await createCustomer("adminreview");

    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Pengguna." })).toBeVisible();
    const userRow = page.locator(".user-row").filter({ hasText: `@${customer.user.username}` });
    await expect(userRow).toBeVisible();
    await userRow.locator("select").selectOption("admin");
    await expect(page.locator(".form-success")).toContainText("diubah menjadi admin");
    await expect(userRow.locator("select")).toHaveValue("admin");
    await userRow.locator("select").selectOption("customer");
    await expect(page.locator(".form-success")).toContainText("diubah menjadi pengguna");
    await expect(userRow.locator("select")).toHaveValue("customer");
    await assertNoHorizontalOverflow(page);

    const orderResponse = await customer.api.post("/api/orders", {
      multipart: {
        eventId: String(concert!.id), quantity: "1",
        proof: { name: "codex-e2e-proof.png", mimeType: "image/png", buffer: proofPng },
      },
    });
    expect(orderResponse.status(), (await orderResponse.text()).slice(0, 300)).toBe(201);
    const placed = ((await orderResponse.json()) as { order: Order }).order;

    await page.goto("/admin/orders");
    await expect(page.getByRole("heading", { name: "Verifikasi pesanan." })).toBeVisible();
    await page.getByRole("button", { name: "Menunggu", exact: true }).click();
    const orderCard = page.locator(".admin-order-card").filter({ hasText: title });
    await expect(orderCard).toBeVisible();
    await orderCard.getByRole("button", { name: "Setujui" }).click();
    await expect(page.locator(".form-success")).toContainText(`Pesanan #${placed.id} disetujui`);
    await page.getByRole("button", { name: "Disetujui", exact: true }).click();
    await expect(orderCard.getByText("Tiket diterbitkan")).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Ringkasan." })).toBeVisible();
    await expect(page.locator(".stat-card").filter({ hasText: "Total konser" }).locator("strong")).toHaveText(/[1-9]/);
    await expect(page.locator(".stat-card").filter({ hasText: "Total pesanan" }).locator("strong")).toHaveText(/[1-9]/);
    await page.goto("/admin/events");
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator(".admin-event-row").filter({ hasText: title }).getByRole("button", { name: `Hapus ${title}` }).click();
    await expect(page.locator(".admin-event-row").filter({ hasText: title })).toHaveCount(0);

    // The approved order remains viewable after the event is removed from the catalog.
    const logout = await page.request.post("/api/auth/logout");
    expect(logout.status()).toBe(200);
    await page.goto("/login");
    await page.getByLabel("Username").fill(customer.user.username);
    await page.getByLabel("Kata sandi").fill(password);
    await page.getByRole("button", { name: "Masuk", exact: true }).click();
    await expect(page).toHaveURL(/\/account$/);
    await page.goto(`/orders/${placed.id}`);
    await expect(page.getByRole("heading", { name: "Detail pesanan." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tiketmu siap!" })).toBeVisible();
    const printButton = page.getByRole("button", { name: "Cetak tiket / invoice" });
    await expect(printButton).toBeVisible();
    await page.evaluate(() => {
      window.print = () => { document.body.dataset.e2ePrintCalled = "yes"; };
    });
    await printButton.click();
    await expect(page.locator("body")).toHaveAttribute("data-e2e-print-called", "yes");
    await assertNoHorizontalOverflow(page);
  });
});
