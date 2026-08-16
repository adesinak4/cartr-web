import Link from "next/link";
import { ConfirmationClient } from "./confirmation-client";
import { IconClock } from "@/components/icons";

export default async function ConfirmationPage(
  props: PageProps<"/s/[slug]/checkout/confirmation">,
) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const reference =
    typeof searchParams?.tx_ref === "string" ? searchParams.tx_ref : undefined;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <ConfirmationClient slug={slug} />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-light text-blue">
        <IconClock className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-semibold text-dark">Payment submitted</h1>
      <p className="max-w-sm text-sm text-grey-500">
        We&apos;re confirming your payment — this can take a moment. You&apos;ll receive an
        update once your order is confirmed.
      </p>
      {reference && (
        <p className="rounded-md bg-grey-100 px-3 py-1.5 font-mono text-xs text-grey-500">
          Ref: {reference}
        </p>
      )}
      <div className="flex gap-3">
        <Link
          href={`/s/${slug}`}
          className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
        >
          Continue shopping
        </Link>
        <Link
          href={`/s/${slug}`}
          className="rounded-md border border-grey-200 px-4 py-2 text-sm font-medium text-dark transition hover:bg-grey-100"
        >
          Back to store
        </Link>
      </div>
    </div>
  );
}
