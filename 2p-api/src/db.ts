import pg from "pg";
import { env } from "./env.js";

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  // Chyba na idle klientovi nesmí shodit proces.
  console.error("[db] neočekávaná chyba idle klienta:", err);
});

export async function closePool(): Promise<void> {
  await pool.end();
}
