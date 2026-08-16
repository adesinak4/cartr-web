import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { AdminMerchant } from "@/lib/types";
import { SuspendToggleButton } from "../suspend-toggle-button";
import { Badge } from "@/components/badge";
import { IconArrowLeft, IconGlobe } from "@/components/icons";

export default async function AdminMerchantDetailPage(
  props: PageProps<"/admin/merchants/[id]">,
) {
  const { id } = await props.params;
  const merchant = await apiGet<AdminMerchant>(`/admin/merchants/${id}`);
  const isActive = merchant.accountStatus === "active";

  const initials = merchant.storeName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/merchants"
          className="inline-flex items-center gap-1 text-sm text-grey-500 hover:text-dark"
        >
          <IconArrowLeft className="h-4 w-4" /> Merchants
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-light text-base font-semibold text-blue">
                  {initials}
                </span>
                <div>
                  <p className="text-lg font-semibold text-dark">{merchant.storeName}</p>
                  <p className="text-sm text-grey-400">{merchant.slug}</p>
                </div>
              </div>
              <Badge status={merchant.accountStatus} />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-grey-200 pt-4">
              <div>
                <p className="text-xs text-grey-400">Store</p>
                <p className="mt-1 text-sm font-medium text-dark">{merchant.storeName}</p>
              </div>
              <div>
                <p className="text-xs text-grey-400">Subscription</p>
                <p className="mt-1 text-sm font-medium capitalize text-dark">
                  {merchant.subscriptionStatus.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-grey-400">Joined</p>
                <p className="mt-1 text-sm font-medium text-dark">
                  {new Date(merchant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Admin actions</h2>
            <SuspendToggleButton
              merchantId={merchant.id}
              merchantName={merchant.storeName}
              isActive={isActive}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Contact</h2>
            <a
              href={`/s/${merchant.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-blue hover:underline"
            >
              <IconGlobe className="h-4 w-4 shrink-0" />
              cartr.ng/{merchant.slug}
            </a>
          </div>

          <div
            className={`rounded-lg p-6 ${
              isActive ? "bg-success-light" : "bg-error-light"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                isActive ? "text-success" : "text-error"
              }`}
            >
              Account status
            </p>
            <p className={`mt-1 text-lg font-semibold ${isActive ? "text-success" : "text-error"}`}>
              {isActive ? "Active & verified" : "Suspended"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
