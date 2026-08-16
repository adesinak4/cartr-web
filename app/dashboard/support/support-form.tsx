"use client";

import { FormEvent, useState } from "react";
import { WHATSAPP_LINK, SUPPORT_EMAIL } from "@/lib/constants";

const SUBJECTS = [
  "I can't log in to my account",
  "Payment issue",
  "Order not appearing in dashboard",
  "I want to cancel my subscription",
  "Other",
];

export function SupportForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // No ticketing backend exists yet — be honest rather than fake a
    // "message sent" confirmation that doesn't actually go anywhere.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-md bg-blue-light p-4 text-sm text-blue">
        We don&apos;t have a ticketing system yet. For a real reply, please reach us on{" "}
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="underline">
          WhatsApp
        </a>{" "}
        or email <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="subject" className="mb-1 block text-sm text-grey-500">
          Subject
        </label>
        <select
          id="subject"
          required
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="">Select a topic</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm text-grey-500">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="w-full rounded-md border border-grey-200 px-3 py-2 text-sm outline-none focus:border-blue"
        />
      </div>
      <button
        type="submit"
        className="w-fit rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
      >
        Send message
      </button>
    </form>
  );
}
