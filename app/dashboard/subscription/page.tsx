import { apiGet } from "@/lib/api-server";
import { Plan, SubscriptionSummary } from "@/lib/types";
import { CheckoutButton } from "./checkout-button";
import { PlanPicker } from "./plan-picker";
import { BillingHistoryButton } from "./billing-history-button";

const STATUS_LABELS: Record<SubscriptionSummary["subscriptionStatus"], string> = {
  trialing: "Trial",
  active: "Active",
  past_due: "Past due",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<SubscriptionSummary["subscriptionStatus"], string> = {
  trialing: "bg-blue-light text-blue",
  active: "bg-success-light text-success",
  past_due: "bg-warning-light text-warning",
  cancelled: "bg-error-light text-error",
};

export default async function SubscriptionPage() {
  const [subscription, plans] = await Promise.all([
    apiGet<SubscriptionSummary>("/subscriptions/me"),
    apiGet<Plan[]>("/plans"),
  ]);

  const needsPayment =
    subscription.subscriptionStatus === "past_due" ||
    (subscription.subscriptionStatus === "trialing" && !subscription.paymentMethod);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark">Subscription</h1>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-grey-500">Status</p>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm ${STATUS_STYLES[subscription.subscriptionStatus]}`}
            >
              {STATUS_LABELS[subscription.subscriptionStatus]}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {subscription.paymentMethod && (
              <p className="text-sm text-grey-500">
                {subscription.paymentMethod.cardType} ending in{" "}
                {subscription.paymentMethod.cardLast4}
              </p>
            )}
            <BillingHistoryButton />
          </div>
        </div>

        {subscription.subscriptionStatus === "trialing" && subscription.trialEndsAt && (
          <p className="mt-4 text-sm text-grey-500">
            Trial ends {new Date(subscription.trialEndsAt).toLocaleDateString()}.
          </p>
        )}

        {subscription.subscriptionStatus === "past_due" && (
          <div className="mt-4 rounded-md bg-warning-light p-3 text-sm text-warning">
            Your last payment failed
            {subscription.billingRetryCount > 0
              ? ` (attempt ${subscription.billingRetryCount})`
              : ""}
            . Update your payment method to avoid your store being closed.
          </div>
        )}

        {subscription.subscriptionStatus === "cancelled" && (
          <div className="mt-4 rounded-md bg-error-light p-3 text-sm text-error">
            Your subscription has been cancelled due to non-payment. Your storefront is
            no longer accepting orders until this is resolved.
          </div>
        )}

        {subscription.subscriptionStatus === "active" &&
          subscription.currentPeriodEnd && (
            <p className="mt-4 text-sm text-grey-500">
              Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
            </p>
          )}

        {needsPayment && (
          <div className="mt-4">
            <CheckoutButton
              label={
                subscription.subscriptionStatus === "past_due"
                  ? "Update payment method"
                  : "Add payment method"
              }
            />
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-medium text-grey-500">Plans</h2>
        <PlanPicker
          plans={plans}
          currentPlanId={subscription.planId}
          pendingPlanId={subscription.pendingPlanId}
        />
      </div>
    </div>
  );
}
