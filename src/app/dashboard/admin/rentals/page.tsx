"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { RentalOrder } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatMoney } from "@/lib/utils";

export default function AdminRentalsPage() {
  const [orders, setOrders] = useState<RentalOrder[] | null>(null);

  useEffect(() => {
    adminApi.allRentals().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <p className="tag-label text-rust mb-2">Admin dashboard</p>
      <h1 className="font-display text-3xl text-forest mb-8">All Rental Orders</h1>

      {!orders && <p className="text-sm text-ink-soft">Loading…</p>}
      {orders && orders.length === 0 && <p className="text-sm text-ink-soft">No rental orders yet.</p>}

      <div className="space-y-3">
        {orders?.map((order) => (
          <div key={order.id} className="border border-line bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-ink-soft">{order.orderNumber}</p>
                <p className="text-sm">
                  {order.customer?.name} &middot; {formatDate(order.startDate)} &rarr; {formatDate(order.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={order.status} />
                <StatusBadge status={order.paymentStatus} />
                <span className="font-mono text-forest">{formatMoney(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
