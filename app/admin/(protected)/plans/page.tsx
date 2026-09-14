import { apiGet } from "@/lib/api-server";
import { AdminPlanWithPrices } from "@/lib/types";
import { PlanCard } from "./plan-card";
import { CreatePlanForm } from "./create-plan-form";

export default async function AdminPlansPage() {
  const plans = await apiGet<AdminPlanWithPrices[]>("/admin/plans");

  return (
    <div className="p-8">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-dark">Plans & fees</h1>
        <CreatePlanForm />
      </div>
      <p className="mb-6 text-sm text-grey-500">
        Prices are charged as one lump sum for the whole commitment period, not a recurring
        monthly amount.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
