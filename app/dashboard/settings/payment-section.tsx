import { Merchant, PaymentAccount, Bank } from "@/lib/types";
import { PayoutAccountForm } from "./payout-account-form";
import { IconCheckCircle } from "@/components/icons";

export function PaymentSection({
  merchant,
  paymentAccount,
  banks,
}: {
  merchant: Merchant;
  paymentAccount: PaymentAccount | null;
  banks: Bank[];
}) {
  if (!paymentAccount) {
    return <PayoutAccountForm banks={banks} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md bg-success-light px-4 py-3 text-sm text-success">
        <IconCheckCircle className="h-4 w-4 shrink-0" />
        Your store is set up to receive payments in {merchant.currency}.
      </div>
      <div className="rounded-md border border-grey-200 p-4 text-sm">
        <p className="text-dark">{paymentAccount.bankName}</p>
        <p className="text-grey-500">
          {paymentAccount.accountName} · ****{paymentAccount.accountNumber.slice(-4)}
        </p>
      </div>
      <p className="text-xs text-grey-400">
        Delivery-zone-based fees aren&apos;t supported yet — delivery is currently free for every
        order.
      </p>
    </div>
  );
}
