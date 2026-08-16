import { WHATSAPP_LINK, SUPPORT_EMAIL } from "@/lib/constants";
import { SupportForm } from "./support-form";
import { IconMail, IconWhatsApp } from "@/components/icons";

const FAQS = [
  "How do I connect my payment provider?",
  "How do I add a custom domain?",
  "Why is my store showing as closed?",
  "How do I export my orders?",
  "How do I change my subscription?",
];

export default function SupportPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Support</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-card transition hover:shadow-card-md"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-light text-success">
            <IconWhatsApp className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-dark">WhatsApp support</p>
            <p className="text-sm text-grey-500">Usually replies in under 10 minutes</p>
          </div>
        </a>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-card transition hover:shadow-card-md"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-light text-blue">
            <IconMail className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-dark">Email support</p>
            <p className="text-sm text-grey-500">{SUPPORT_EMAIL} · 24hr response</p>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <section className="rounded-lg bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-medium text-grey-500">Send a message</h2>
          <SupportForm />
        </section>
        <section className="rounded-lg bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-medium text-grey-500">Quick answers</h2>
          <ul className="flex flex-col gap-2 text-sm text-blue">
            {FAQS.map((q) => (
              <li key={q} className="cursor-default hover:underline">
                {q}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
