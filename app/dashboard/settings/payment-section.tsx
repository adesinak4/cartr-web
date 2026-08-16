import { Merchant } from "@/lib/types";
import { IconCheckCircle } from "@/components/icons";

export function PaymentSection({ merchant }: { merchant: Merchant }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md bg-success-light px-4 py-3 text-sm text-success">
        <IconCheckCircle className="h-4 w-4 shrink-0" />
        Your store is connected to accept payments in {merchant.currency}.
      </div>
      <p className="text-sm text-grey-500">
        Payments are processed automatically at checkout — there&apos;s nothing further to
        configure here.
      </p>
      <p className="text-xs text-grey-400">
        Delivery-zone-based fees aren&apos;t supported yet — delivery is currently free for every
        order.
      </p>
    </div>
  );
}
