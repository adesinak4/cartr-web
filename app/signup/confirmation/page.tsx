import Link from "next/link";
import { ConfirmationClient } from "./confirmation-client";
import { IconStoreSlash } from "@/components/icons";

export default async function OnboardingConfirmationPage(
  props: PageProps<"/signup/confirmation">,
) {
  const searchParams = await props.searchParams;
  const draftId = typeof searchParams?.tx_ref === "string" ? searchParams.tx_ref : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-grey-100 p-8 text-center">
      {draftId ? (
        <ConfirmationClient draftId={draftId} />
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-light text-error">
            <IconStoreSlash className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-semibold text-dark">Something went wrong</h1>
          <p className="max-w-sm text-sm text-grey-500">
            We couldn&apos;t find your payment reference. If you completed a payment, please
            contact us — otherwise, start signup again.
          </p>
          <Link
            href="/signup"
            className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
          >
            Back to signup
          </Link>
        </>
      )}
    </div>
  );
}
