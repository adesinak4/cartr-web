import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { AdminOrderDetail, AdminMerchant } from "@/lib/types";
import { Badge } from "@/components/badge";
import { IconArrowLeft } from "@/components/icons";
import { RefundButton } from "../refund-button";

const REFUNDABLE_STATUSES = new Set(["confirmed", "shipped", "delivered"]);

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params;
  const order = await apiGet<AdminOrderDetail>(`/admin/orders/${id}`);
  const merchant = await apiGet<AdminMerchant>(`/admin/merchants/${order.tenantId}`);

  return (
    <div className="p-8">
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm text-grey-500 hover:text-dark"
      >
        <IconArrowLeft className="h-4 w-4" /> Orders
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-dark">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-grey-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <Badge status={order.status} />
            </div>

            <div className="border-t border-grey-200 pt-4">
              <h2 className="mb-2 text-sm font-medium text-grey-500">Items</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-grey-500">
                    <th className="pb-2 font-normal">Item</th>
                    <th className="pb-2 font-normal">Qty</th>
                    <th className="pb-2 font-normal text-right">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-grey-200">
                      <td className="py-2">{item.productNameSnapshot}</td>
                      <td className="py-2 text-grey-500">{item.qty}</td>
                      <td className="py-2 text-right text-dark">₦{item.lineTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 space-y-1 border-t border-grey-200 pt-4 text-sm">
                <div className="flex justify-between text-grey-500">
                  <span>Subtotal</span>
                  <span>₦{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-grey-500">
                  <span>Delivery fee</span>
                  <span>₦{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-dark">
                  <span>Total</span>
                  <span>
                    ₦{order.total} {order.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {REFUNDABLE_STATUSES.has(order.status) && (
            <div className="rounded-lg bg-white p-6 shadow-card">
              <h2 className="mb-3 text-sm font-medium text-grey-500">Admin actions</h2>
              <RefundButton orderId={order.id} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Store</h2>
            <Link
              href={`/admin/merchants/${merchant.id}`}
              className="text-sm font-medium text-blue hover:underline"
            >
              {merchant.storeName}
            </Link>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Delivery address</h2>
            <p className="text-sm text-dark">{order.deliveryStreet}</p>
            <p className="text-sm text-grey-500">
              {order.deliveryCity}, {order.deliveryState}
            </p>
            {order.note && (
              <p className="mt-3 rounded-md bg-grey-100 p-3 text-xs text-grey-500">{order.note}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
