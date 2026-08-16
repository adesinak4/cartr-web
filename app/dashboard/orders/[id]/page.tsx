import Link from "next/link";
import { apiGet } from "@/lib/api-server";
import { Customer, OrderWithItems } from "@/lib/types";
import { StatusActions } from "./status-actions";
import { Badge } from "@/components/badge";
import { IconArrowLeft, IconMail, IconMapPin, IconPhone } from "@/components/icons";

export default async function OrderDetailPage(
  props: PageProps<"/dashboard/orders/[id]">,
) {
  const { id } = await props.params;
  const order = await apiGet<OrderWithItems>(`/orders/${id}`);
  const customer = await apiGet<Customer>(`/customers/${order.customerId}`);

  const initials = customer.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="p-8">
      <Link
        href="/dashboard/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm text-grey-500 hover:text-dark"
      >
        <IconArrowLeft className="h-4 w-4" /> Orders
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-white p-6 shadow-card">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-dark">
                  Order {order.id.slice(0, 8)}
                </h1>
                <p className="mt-1 text-sm text-grey-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <Badge status={order.status} />
            </div>

            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-grey-200 text-grey-500">
                  <th className="pb-2 font-normal">Product</th>
                  <th className="pb-2 font-normal">Qty</th>
                  <th className="pb-2 font-normal">Price</th>
                  <th className="pb-2 font-normal">Line total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-grey-200 last:border-0">
                    <td className="py-2">{item.productNameSnapshot}</td>
                    <td className="py-2">{item.qty}</td>
                    <td className="py-2">{item.priceSnapshot}</td>
                    <td className="py-2">{item.lineTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex flex-col items-end gap-1 text-sm">
              <p className="text-grey-500">
                Subtotal: {order.currency} {order.subtotal}
              </p>
              <p className="text-grey-500">
                Delivery: {order.currency} {order.deliveryFee}
              </p>
              <p className="font-medium text-dark">
                Total: {order.currency} {order.total}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-card">
            <h2 className="mb-3 text-sm font-medium text-grey-500">Update status</h2>
            <StatusActions orderId={order.id} status={order.status} />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-light text-sm font-semibold text-blue">
              {initials}
            </span>
            <div>
              <p className="text-sm font-medium text-dark">{customer.name}</p>
              {customer.email && <p className="text-xs text-grey-400">{customer.email}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-grey-200 pt-4 text-sm">
            <div className="flex items-center gap-2 text-blue">
              <IconPhone className="h-4 w-4" />
              {customer.phone}
            </div>
            <div className="flex items-start gap-2 text-orange">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-dark">
                {order.deliveryStreet}, {order.deliveryCity}, {order.deliveryState}
              </span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-grey-400">
                <IconMail className="h-4 w-4" />
                {customer.email}
              </div>
            )}
          </div>
          {order.note && (
            <div className="mt-4 rounded-md bg-blue-light p-3 text-xs text-blue">
              {order.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
