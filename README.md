# Cartr Web — Merchant Dashboard

Next.js (App Router) frontend for [`cartr-api`](../cartr-api), replacing the static
HTML/CSS/JS prototype that used to live in `/home/kisameholmes/code/cartr`. That prototype
remains as a design/UX reference only — nothing here talks to it, and nothing there gets touched
by this project.

**Phase 1 scope (current)**: the merchant dashboard only. Public storefront and admin panel are
later phases — see `.claude/plans/mighty-mixing-fountain.md` for the full roadmap this was built
against.

## Setup

```bash
pnpm install
cp .env.local.example .env.local   # point CARTR_API_URL at your local cartr-api
pnpm dev
```

Requires a running `cartr-api` (see that repo's own README). Since `cartr-api` has no merchant
signup flow yet, seed one for local dev:

```bash
cd ../cartr-api
MERCHANT_SEED_EMAIL=dev@cartr.ng \
MERCHANT_SEED_PASSWORD=devpassword123 \
MERCHANT_SEED_SLUG=dev-store \
MERCHANT_SEED_STORE_NAME="Dev Store" \
pnpm seed:merchant
```

Then log in at `http://localhost:3000/login` with those credentials.

## Architecture

- **Auth**: access (15m) + refresh (7d) tokens from `cartr-api`, stored as httpOnly cookies —
  never exposed to client-side JS. Set by `app/api/auth/{login,logout}/route.ts`, which proxy the
  corresponding `cartr-api` endpoints.
- **Route guard + silent refresh**: `proxy.ts` (Next.js 16's replacement for the `middleware.ts`
  convention) runs before every `/dashboard/*` request, checks whether the access token is fresh
  enough, and — if not — refreshes proactively using the refresh-token cookie before the request
  reaches any page. This is deliberate, not incidental: Server Components can read cookies but
  can't set them mid-render, so a reactive "refresh on 401 during a data fetch" approach has
  nowhere to persist the new token. Doing it in `proxy.ts` (which runs pre-render and can set
  response cookies) is the only place a refresh can both happen and stick.
- **API client**: `lib/api-client.ts` (low-level, envelope-aware, typed `ApiError` keyed on
  `cartr-api`'s domain error codes) and `lib/api-server.ts` (the authenticated wrapper Server
  Components actually call, pulling the access token from cookies).
- **Design tokens**: `app/globals.css` ports the color/spacing/radius tokens from the old static
  prototype's `assets/css/styles.css` into a Tailwind v4 `@theme` block, so the rebuild doesn't
  reinvent the visual language from scratch.

## Not yet built

Everything past the dashboard shell + home page (products, orders, settings — including the new
theme picker and custom domain setup, subscription) — home page (login → real dashboard data) is
the first verified slice; the rest of Phase 1 follows the same established pattern
(`apiGet`/`apiMutate` + a page). Public storefront and admin panel are separate, later phases.

Real merchant self-signup remains a `cartr-api` gap, not something this project solves —
`pnpm seed:merchant` there is a dev-only stand-in.
