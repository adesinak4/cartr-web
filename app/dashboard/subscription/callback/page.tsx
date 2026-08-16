import Link from "next/link";

// Confirmation itself happens asynchronously via cartr-api's webhook, not
// here — this page is just where Flutterwave sends the merchant back.
export default function SubscriptionCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-grey-100 p-8 text-center">
      <h1 className="text-xl font-semibold text-dark">Payment submitted</h1>
      <p className="max-w-sm text-sm text-grey-500">
        We&apos;re confirming your payment — this can take a moment. Your subscription
        status will update automatically once it&apos;s processed.
      </p>
      <Link
        href="/dashboard/subscription"
        className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
      >
        Back to subscription
      </Link>
    </div>
  );
}
