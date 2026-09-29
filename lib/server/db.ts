import { Pool, types, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var melodytixPool: Pool | undefined;
}

// Legacy event and order timestamps are Bangkok wall times. Return those
// PostgreSQL values as strings so models.ts can apply Asia/Bangkok explicitly.
types.setTypeParser(types.builtins.TIMESTAMP, (value) => value);
types.setTypeParser(types.builtins.TIMESTAMPTZ, (value) => new Date(value).toISOString());

export function postgresConnectionString(value: string): string {
  const url = new URL(value);
  // Neon supplies sslmode=require. pg currently interprets it as verify-full,
  // but its next major version will weaken that alias. Keep certificate checks.
  if (url.searchParams.get("sslmode") === "require") {
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}

function makePool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required for PostgreSQL.");
  return new Pool({
    connectionString: postgresConnectionString(connectionString),
    max: 5,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 10_000,
  });
}

export function db(): Pool {
  if (!globalThis.melodytixPool) globalThis.melodytixPool = makePool();
  return globalThis.melodytixPool;
}

export type { PoolClient, QueryResult, QueryResultRow };
