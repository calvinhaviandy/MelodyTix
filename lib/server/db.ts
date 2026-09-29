import mysql, { type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var melodytixPool: Pool | undefined;
}

function makePool(): Pool {
  return mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "db_concert",
    ssl: process.env.DB_SSL === "true" ? { minVersion: "TLSv1.2" } : undefined,
    charset: "utf8mb4",
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
    decimalNumbers: true,
  });
}

export function db(): Pool {
  if (!globalThis.melodytixPool) globalThis.melodytixPool = makePool();
  return globalThis.melodytixPool;
}

export type { PoolConnection, ResultSetHeader, RowDataPacket };
