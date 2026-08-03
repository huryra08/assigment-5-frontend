"use client";

import { useEffect, useState } from "react";
import { rentalApi, ApiError } from "@/lib/api";
import type { RentalOrder, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatMoney } from "@/lib/utils";
import { toast } from "sonner";

const NEXT_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }[]>> = {
  PENDING: [
    { label: "Confirm", next: "CONFIRMED" },
    { label: "Cancel", next: "CANCELLED" },
  ],
  CONFIRMED: [{ label: "Mark Picked Up", next: "PICKED_UP" }],
  PICKED_UP: [{ label: "Mark Returned", next: "RETURNED" }],
  ONGOING: [{ label: "Mark Returned", next: "RETURNED" }],
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[] | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    rentalApi.providerOrders().then(setOrders).catch(() => setOrders([]));
  };

  useEffect(load, []);

  const updateStatus = async (order: RentalOrder, next: OrderStatus) => {
    setUpdating(order.id);
    try {
      await rentalApi.updateStatus(order.id, next);
      toast.success(`Order ${order.orderNumber} updated`);
      setOrders((prev) => prev?.map((o) => (o.id === order.id ? { ...o, status: next } : o)) ?? null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update that order.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <p className="tag-label text-rust mb-2">Provider dashboard</p>
      <h1 className="font-display text-3xl text-forest mb-8">Incoming Orders</h1>

      {!orders && <p className="text-sm text-ink-soft">Loading orders…</p>}
      {orders && orders.length === 0 && <p className="text-sm text-ink-soft">No orders yet.</p>}

      <div className="space-y-3">
        {orders?.map((order) => {
          const actions = NEXT_ACTIONS[order.status] ?? [];
          return (
            <div key={order.id} className="border border-line bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-xs text-ink-soft">{order.orderNumber}</p>
                  <p className="text-sm text-ink-soft">
                    {order.customer?.name} &middot; {formatDate(order.startDate)} &rarr; {formatDate(order.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-ink-soft">
                    <span>
                      {item.gear?.name ?? "Item"} &times; {item.quantity}
                    </span>
                    <span className="font-mono">{formatMoney(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-line pt-3">
                <span className="font-mono text-forest">{formatMoney(order.totalAmount)}</span>
                <div className="flex gap-2">
                  {actions.map((action) => (
                    <Button
                      key={action.label}
                      size="sm"
                      variant={action.next === "CANCELLED" ? "danger" : "secondary"}
                      disabled={updating === order.id}
                      onClick={() => updateStatus(order, action.next)}
                    >
                      {action.label}
                    </Button>
                  ))}
                  {actions.length === 0 && <span className="text-xs text-ink-soft">No actions available</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
