import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import mysql from "mysql2/promise";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const databaseName = process.env.DB_NAME || "db_concert";
  if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) throw new Error("DB_NAME contains invalid characters.");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: false,
    charset: "utf8mb4",
  });

  async function runSql(path: string): Promise<void> {
    let sql = await readFile(resolve(path), "utf8");
    if (path === "database/schema.sql") {
      // The legacy bootstrap file names db_concert. The modern project honors
      // DB_NAME while retaining the three original CREATE TABLE definitions.
      sql = sql.replace(/CREATE DATABASE IF NOT EXISTS db_concert[\s\S]*?;/i, "").replace(/USE db_concert\s*;/i, "");
    }
    // Schema files intentionally contain no stored procedures or semicolons in strings.
    for (const statement of sql.split(";").map((part) => part.trim()).filter(Boolean)) {
      await connection.query(statement);
    }
  }

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${databaseName}\``);
    await runSql("database/schema.sql");
    await runSql("database/modern.sql");
    console.log("MelodyTix database migration complete. Existing rows were preserved.");
  } finally {
    await connection.end();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
