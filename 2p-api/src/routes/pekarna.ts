import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";
import { env } from "../env.js";

const INQUIRY_TYPES = ["ubytovani", "sklad", "vyroba", "kancelar", "ostatni"] as const;

type InquiryTypeValue = (typeof INQUIRY_TYPES)[number];

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
    inquiryType: { type: "string", enum: INQUIRY_TYPES },
    message: { type: "string", maxLength: 5000 },
    // Honeypot — skryté pole, které vyplní jen bot.
    website: { type: "string", maxLength: 200 },
  },
} as const;

type InquiryBody = {
  name: string;
  email: string;
  phone?: string;
  inquiryType?: InquiryTypeValue;
  message?: string;
  website?: string;
};

/** Prázdný řetězec z formuláře znamená "nevyplněno", ne prázdnou hodnotu. */
function nullIfBlank(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
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
           (name, email, phone, inquiry_type, message, source_ip, user_agent)
         values ($1, $2, $3, $4, $5, $6, $7)
         returning id`,
        [
          body.name.trim(),
          body.email.trim().toLowerCase(),
          nullIfBlank(body.phone),
          body.inquiryType ?? "ostatni",
          nullIfBlank(body.message),
          request.ip,
          request.headers["user-agent"]?.slice(0, 500) ?? null,
        ],
      );

      const id = rows[0]?.id;
      request.log.info({ id, type: body.inquiryType }, "uložena nová poptávka");

      // TODO: notifikace mailem přes relay (Resend / Postmark).
      // GCP blokuje port 25, takže vlastní SMTP ze stroje nepůjde.

      return reply.code(201).send({ ok: true, id });
    },
  );
}
