import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";
import { env } from "../env.js";

// Tvar payloadu z formuláře. Validaci dělá Fastify přes JSON schema,
// takže do handleru se nedostane nic neočekávaného.
const inquiryBodySchema = {
  type: "object",
  required: ["name", "email"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 2, maxLength: 200 },
    email: { type: "string", format: "email", maxLength: 320 },
    phone: { type: "string", maxLength: 40 },
    people: { type: "string", maxLength: 10 },
    dateFrom: { type: "string", maxLength: 10 },
    dateTo: { type: "string", maxLength: 10 },
    rentalType: { type: "string", enum: ["short", "long"] },
    message: { type: "string", maxLength: 5000 },
    // Honeypot — skryté pole, které vyplní jen bot.
    website: { type: "string", maxLength: 200 },
  },
} as const;

type InquiryBody = {
  name: string;
  email: string;
  phone?: string;
  people?: string;
  dateFrom?: string;
  dateTo?: string;
  rentalType?: "short" | "long";
  message?: string;
  website?: string;
};

/** Prázdný řetězec z formuláře znamená "nevyplněno", ne prázdnou hodnotu. */
function nullIfBlank(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Vrátí YYYY-MM-DD nebo null. Cokoliv jiného zahodíme, ať nespadne insert. */
function dateOrNull(value: string | undefined): string | null {
  const trimmed = nullIfBlank(value);
  if (!trimmed) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

/** Počet osob jako smallint, mimo rozsah → null. */
function peopleOrNull(value: string | undefined): number | null {
  const trimmed = nullIfBlank(value);
  if (!trimmed) return null;
  const n = Number.parseInt(trimmed, 10);
  return Number.isInteger(n) && n > 0 && n <= 100 ? n : null;
}

export async function registerPekarnaRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: InquiryBody }>(
    "/pekarna/inquiry",
    {
      schema: { body: inquiryBodySchema },
      config: {
        rateLimit: {
          max: env.inquiryRateMax,
          timeWindow: "1 hour",
        },
      },
    },
    async (request, reply) => {
      const body = request.body;

      // Bot vyplnil honeypot → tváříme se, že je vše v pořádku, ale nic neuložíme.
      // Odmítnutí by botovi řeklo, že pole odhalujeme.
      if (nullIfBlank(body.website)) {
        request.log.info({ ip: request.ip }, "honeypot zachytil odeslání");
        return reply.code(202).send({ ok: true });
      }

      const { rows } = await pool.query<{ id: string }>(
        `insert into pekarna.inquiry
           (name, email, phone, people, date_from, date_to, rental_type, message, source_ip, user_agent)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         returning id`,
        [
          body.name.trim(),
          body.email.trim().toLowerCase(),
          nullIfBlank(body.phone),
          peopleOrNull(body.people),
          dateOrNull(body.dateFrom),
          dateOrNull(body.dateTo),
          body.rentalType ?? "short",
          nullIfBlank(body.message),
          request.ip,
          request.headers["user-agent"]?.slice(0, 500) ?? null,
        ],
      );

      const id = rows[0]?.id;
      request.log.info({ id }, "uložena nová poptávka");

      // TODO: notifikace mailem přes relay (Resend / Postmark).
      // GCP blokuje port 25, takže vlastní SMTP ze stroje nepůjde.

      return reply.code(201).send({ ok: true, id });
    },
  );
}
