import { z } from "zod";

const envSchema = z.object({
  // Server-side only — never exposed to the client. The Next.js server is
  // the only thing that ever talks to cartr-api directly; the browser only
  // ever talks to this Next.js app's own Route Handlers.
  CARTR_API_URL: z.string().url().default("http://localhost:4100"),

  // The platform's own base domain — proxy.ts uses this to tell a
  // `{slug}.` subdomain apart from a merchant's custom domain. Defaults to
  // a local dev value; real deployments must set this explicitly.
  PLATFORM_DOMAIN: z.string().min(1).default("cartr.local"),
});

const parsed = envSchema.safeParse({
  CARTR_API_URL: process.env.CARTR_API_URL,
  PLATFORM_DOMAIN: process.env.PLATFORM_DOMAIN,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;
