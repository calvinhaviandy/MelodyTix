import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "pg";
import { postgresConnectionString } from "../lib/server/db";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Set DATABASE_URL_UNPOOLED or DATABASE_URL before migrating PostgreSQL.");
  const client = new Client({ connectionString: postgresConnectionString(connectionString) });
  await client.connect();
  try {
    const schema = await readFile(resolve("database/schema.sql"), "utf8");
    const modern = await readFile(resolve("database/modern.sql"), "utf8");
    await client.query("BEGIN");
    await client.query(schema);
    await client.query(modern);
    await client.query("COMMIT");
    console.log("MelodyTix PostgreSQL migration complete. Existing rows were preserved.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
