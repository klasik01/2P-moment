// Načtení a validace prostředí. Když něco chybí, spadneme hned při startu,
// ne až u prvního requestu.

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Chybí povinná env proměnná: ${key}`);
  return value;
}

function int(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) throw new Error(`Env ${key} musí být číslo, dostal jsem "${raw}"`);
  return n;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: int("PORT", 5310),
  databaseUrl: required("DATABASE_URL"),

  /** Povolené originy frontendů, oddělené čárkou. Nikdy "*". */
  corsOrigins: required("CORS_ORIGINS")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  /** Kolik poptávek smí jedna IP odeslat za hodinu. */
  inquiryRateMax: int("INQUIRY_RATE_MAX", 5),
};
