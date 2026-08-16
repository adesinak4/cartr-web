import Link from "next/link";
import { apiPublicGet } from "@/lib/api-public";
import { Plan } from "@/lib/types";
import { WHATSAPP_LINK } from "@/lib/constants";
import {
  IconBox,
  IconChartBar,
  IconCheckCircle,
  IconCog,
  IconGlobe,
  IconStar,
  IconWhatsApp,
} from "@/components/icons";

async function getPlans(): Promise<Plan[]> {
  try {
    return await apiPublicGet<Plan[]>("/plans");
  } catch {
    // Landing page must render even if cartr-api is briefly unreachable —
    // the pricing section just falls back to empty rather than crashing
    // the whole page.
    return [];
  }
}

const FEATURES = [
  {
    icon: <IconBox className="h-5 w-5" />,
    title: "Beautiful storefronts",
    body: "Your store looks great on every device — mobile, tablet, desktop. No design experience needed.",
  },
  {
    icon: <IconGlobe className="h-5 w-5" />,
    title: "Your own domain",
    body: "Every merchant gets a real domain name included — no extra charge, no technical setup required.",
  },
  {
    icon: <IconCog className="h-5 w-5" />,
    title: "Payments built in",
    body: "Accept card, bank transfer, and USSD payments from day one. Money lands in your account directly.",
  },
  {
    icon: <IconChartBar className="h-5 w-5" />,
    title: "Real-time dashboard",
    body: "Track orders, revenue, and top products from anywhere. Know exactly how your store is doing.",
  },
  {
    icon: <IconWhatsApp className="h-5 w-5" />,
    title: "WhatsApp order alerts",
    body: "Get an instant WhatsApp notification the moment a customer places an order. Never miss a sale.",
  },
  {
    icon: <IconCheckCircle className="h-5 w-5" />,
    title: "Done-for-you setup",
    body: "We build your entire store for you. You just provide your products — we handle the rest.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I set up my store in 20 minutes during my lunch break. By evening I had my first order. Cartr genuinely changed how I run my fashion business.",
    name: "Aisha Bello",
    store: "Zara Collections, Lagos",
  },
  {
    quote:
      "Before Cartr I was managing orders in a WhatsApp group. Now everything is organised, I can see my revenue, and customers love the experience.",
    name: "Emeka Nwosu",
    store: "TechGadgets NG, Abuja",
  },
  {
    quote:
      "The payment integration is seamless. Money comes in, I fulfill the order. No stress. I tell every business owner I know to try Cartr.",
    name: "Taiwo Adeyemi",
    store: "Crunchies Snacks, Port Harcourt",
  },
];

export default async function LandingPage() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-grey-200 bg-white px-6 py-4">
        <span className="text-lg font-semibold text-blue">Cartr</span>
        <nav className="hidden items-center gap-6 text-sm text-grey-500 sm:flex">
          <a href="#features" className="hover:text-dark">
            Features
          </a>
          <a href="#how" className="hover:text-dark">
            How it works
          </a>
          <a href="#pricing" className="hover:text-dark">
            Pricing
          </a>
          <a href="#testimonials" className="hover:text-dark">
            Stories
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-dark hover:text-blue">
            Log in
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <IconWhatsApp className="h-4 w-4" />
            Get started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 py-24 text-center text-white"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,10,10,0.92) 0%, rgba(27,47,255,0.85) 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            Built for Nigerian merchants
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Stop Selling in DMs.
            <br />
            <span className="text-orange">Own Your Store.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Get your own online store, your own domain name, and your first customers — all
            within 48 hours.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-orange px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              <IconWhatsApp className="h-4 w-4" />
              Chat Us on WhatsApp
            </a>
            <Link
              href="/s/demo"
              className="rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              See a live demo
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/60">Join merchants already selling on Cartr</p>
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6 text-sm">
            <div>
              <p className="text-xl font-semibold">48hrs</p>
              <p className="text-white/60">To go live</p>
            </div>
            <div>
              <p className="text-xl font-semibold">₦0</p>
              <p className="text-white/60">Setup fee</p>
            </div>
            <div>
              <p className="text-xl font-semibold">100%</p>
              <p className="text-white/60">Yours to keep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue">Features</p>
          <h2 className="mt-2 text-2xl font-semibold text-dark sm:text-3xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-grey-500">
            We built Cartr for small businesses that need to move fast — not enterprises with IT
            departments.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-blue-light text-blue">
                  {f.icon}
                </div>
                <p className="font-medium text-dark">{f.title}</p>
                <p className="mt-1 text-sm text-grey-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="bg-dark px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            &ldquo;You work hard. Your store should too.&rdquo;
          </h2>
          <p className="mt-6 text-sm font-medium text-white/60">Right now, this is you:</p>
          <ul className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm text-white/80">
            <li>• Posting products one by one on Instagram</li>
            <li>• Typing prices into DMs all day</li>
            <li>• Losing sales when you don&apos;t reply fast enough</li>
            <li>• Sending account numbers manually and waiting for alerts</li>
            <li>• No record of your customers or your revenue</li>
          </ul>
        </div>
      </section>

      {/* Domain / ownership */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue">Ownership</p>
          <h2 className="mt-2 text-2xl font-semibold text-dark sm:text-3xl">
            Your store. Your name. Your rules.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-grey-500">
            Most platforms give you a link like <code>cartr.ng/yourstore</code>. That means your
            business lives on someone else&apos;s address. With Cartr, every merchant gets their
            own domain name — a real web address that belongs to you and only you.
          </p>
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-4 text-left text-sm">
            <div className="rounded-lg border border-grey-200 p-4">
              <p className="font-medium text-grey-400">Without Cartr</p>
              <p className="mt-1 text-grey-500">cartr.ng/yourstore</p>
            </div>
            <div className="rounded-lg border border-blue bg-blue-light p-4">
              <p className="font-medium text-blue">With Cartr</p>
              <p className="mt-1 text-dark">yourstore.com.ng</p>
            </div>
          </div>
          <p className="mt-6 text-xs text-grey-400">
            Your domain is included in your plan from Day 1. No extra charge. No technical setup.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-grey-100 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-dark sm:text-3xl">
            Three steps to selling online
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Chat us on WhatsApp",
                body: "Tell us about your business. We'll ask the right questions and get your store ready.",
              },
              {
                step: "2",
                title: "We build your store",
                body: "Send us your product photos and prices. We set everything up — including your domain.",
              },
              {
                step: "3",
                title: "Share & start selling",
                body: "Your store goes live within 48 hours. Share the link and watch orders come in.",
              },
            ].map((s) => (
              <div key={s.step}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white">
                  {s.step}
                </div>
                <p className="font-medium text-dark">{s.title}</p>
                <p className="mt-1 text-sm text-grey-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      {plans.length > 0 && (
        <section id="pricing" className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue">Pricing</p>
            <h2 className="mt-2 text-2xl font-semibold text-dark sm:text-3xl">
              Simple pricing. No surprises.
            </h2>
            <p className="mt-3 text-sm text-grey-500">
              Your domain included from Day 1. Chat with us for full billing details.
            </p>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
              {plans.map((plan, i) => {
                const popular = i === plans.length - 1 && plans.length > 1;
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border p-6 text-left ${
                      popular ? "border-blue shadow-card-md" : "border-grey-200"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-3 left-6 rounded-full bg-orange px-3 py-1 text-xs font-medium text-white">
                        Most Popular
                      </span>
                    )}
                    <p className="font-medium text-dark">{plan.name}</p>
                    <p className="mt-2 text-2xl font-semibold text-dark">
                      ₦{plan.monthlyPrice}
                      <span className="text-sm font-normal text-grey-400"> / month</span>
                    </p>
                    <p className="mt-1 text-xs text-grey-400">
                      {plan.transactionFeePercent}% per transaction
                    </p>
                    {plan.features?.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm text-grey-500">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-6 block rounded-md px-4 py-2 text-center text-sm font-medium transition ${
                        popular
                          ? "bg-blue text-white hover:bg-blue-dark"
                          : "border border-grey-200 text-dark hover:bg-grey-100"
                      }`}
                    >
                      Get Started
                    </a>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-grey-500">
              Not sure which plan is right for you?{" "}
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="text-blue hover:underline">
                Send us a WhatsApp message
              </a>
              .
            </p>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section id="testimonials" className="bg-dark px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange">
            Merchant stories
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Real people, real results</h2>
          <div className="mt-12 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-lg bg-white/5 p-6">
                <div className="mb-3 flex gap-0.5 text-orange">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm text-white/80">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-medium">{t.name}</p>
                <p className="text-xs text-white/50">{t.store}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Stop Selling in DMs.
            <br />
            Start Selling Properly.
          </h2>
          <p className="mt-4 text-sm text-white/80">
            Get your own online store, your own domain name, and your first customers — all
            within 48 hours. Chat us and we&apos;ll get started today.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-blue transition hover:bg-white/90"
          >
            <IconWhatsApp className="h-4 w-4" />
            Chat Us on WhatsApp
          </a>
          <p className="mt-3 text-xs text-white/60">We typically reply within a few hours.</p>
        </div>
      </section>

      <footer className="border-t border-grey-200 px-6 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <span className="text-lg font-semibold text-blue">Cartr</span>
            <p className="mt-2 max-w-xs text-sm text-grey-500">
              The simplest way for Nigerian micro-merchants to sell online. Your store. Your
              domain. Your rules.
            </p>
          </div>
          <div className="text-sm text-grey-500">
            <p className="mb-2 font-medium text-dark">Product</p>
            <ul className="space-y-1.5">
              <li>
                <a href="#features" className="hover:text-dark">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-dark">
                  Pricing
                </a>
              </li>
              <li>
                <Link href="/s/demo" className="hover:text-dark">
                  Demo store
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-dark">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-sm text-grey-500">
            <p className="mb-2 font-medium text-dark">Company</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/signup" className="hover:text-dark">
                  Create a free store
                </Link>
              </li>
              <li className="text-grey-400">Privacy policy</li>
              <li className="text-grey-400">Terms of service</li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-5xl border-t border-grey-200 pt-6 text-xs text-grey-400">
          © {new Date().getFullYear()} Cartr Technologies Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
