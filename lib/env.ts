import { z } from "zod";

const envSchema = z.object({
  // Server-side only — never exposed to the client. The Next.js server is
  // the only thing that ever talks to cartr-api directly; the browser only
  // ever talks to this Next.js app's own Route Handlers.
  CARTR_API_URL: z.string().url().default("http://localhost:4100"),

  // Web app base URL — exposed to client & server for generating callback/redirect URLs.
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // The app's own hostname — app.cartr.com.ng in production. proxy.ts uses
  // this to tell "this request is for the app itself" apart from "this is a
  // merchant's standalone custom domain, resolve it." Defaults to a local
  // dev value; real deployments must set this explicitly.
  PLATFORM_DOMAIN: z.string().min(1).default("app.cartr.local"),

  // Google OAuth client ID — safe to expose (client IDs aren't secret, only
  // client secrets are, and this flow never uses one). Optional: when unset,
  // the "Continue with Google" button simply doesn't render anywhere —
  // matches cartr-api's own GOOGLE_CLIENT_ID honest-degradation behavior.
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
});

const parsed = envSchema.safeParse({
  CARTR_API_URL: process.env.CARTR_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  PLATFORM_DOMAIN: process.env.PLATFORM_DOMAIN,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;
