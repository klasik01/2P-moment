// ============================================================
// 2P Moment API — sdílený backend pro frontendy na Netlify.
//
// Endpointy jsou jmenné podle aplikace:
//   POST /pekarna/inquiry
//   GET  /health
// ============================================================

import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";

import { env } from "./env.js";
import { pool, closePool } from "./db.js";
import { registerPekarnaRoutes } from "./routes/pekarna.js";

const app = Fastify({
  logger: {
    level: env.nodeEnv === "production" ? "info" : "debug",
  },
  // Běžíme za Caddy — bez tohohle by request.ip byl vždy IP proxy
  // a rate limiting by platil pro všechny dohromady.
  trustProxy: true,
  bodyLimit: 64 * 1024,
});

// ---- CORS ----
// Allowlist konkrétních originů. Nikdy "*" — endpointy zapisují data.
await app.register(cors, {
  origin: env.corsOrigins,
  methods: ["GET", "POST"],
  credentials: false,
  maxAge: 86_400,
});

// ---- Rate limiting ----
// Globální strop; přísnější limity si nastavují jednotlivé routy
// přes `config.rateLimit`.
await app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
});

// ---- Health check ----
app.get("/health", async (_request, reply) => {
  try {
    await pool.query("select 1");
    return { ok: true };
  } catch (err) {
    app.log.error(err, "health check — databáze neodpovídá");
    return reply.code(503).send({ ok: false });
  }
});

// ---- Routy aplikací ----
await app.register(registerPekarnaRoutes);

// ---- Start ----
try {
  await app.listen({ port: env.port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err, "server se nepodařilo nastartovat");
  process.exit(1);
}

// ---- Graceful shutdown ----
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, async () => {
    app.log.info(`${signal} — ukončuji`);
    await app.close();
    await closePool();
    process.exit(0);
  });
}
