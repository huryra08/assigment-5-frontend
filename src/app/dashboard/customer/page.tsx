"use client";

import { useEffect, useState } from "react";
import { rentalApi, paymentApi } from "@/lib/api";
import type { RentalOrder, Payment } from "@/lib/types";
import { OrderRow } from "@/components/order-row";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatMoney } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { LinkButton } from "@/components/ui/button";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<RentalOrder[] | null>(null);
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [tab, setTab] = useState<"orders" | "payments">("orders");

  useEffect(() => {
    rentalApi.list().then(setOrders).catch(() => setOrders([]));
    paymentApi.mine().then(setPayments).catch(() => setPayments([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <p className="tag-label text-rust mb-2">My account</p>
      <h1 className="font-display text-3xl text-forest mb-1">Hey, {user?.name.split(" ")[0]}</h1>
      <p className="text-sm text-ink-soft mb-8">Track your rentals, payments, and reviews.</p>

      <div className="flex gap-6 border-b border-line mb-6 text-sm">
        <button
          onClick={() => setTab("orders")}
          className={`pb-3 border-b-2 font-medium ${tab === "orders" ? "border-rust text-rust-deep" : "border-transparent text-ink-soft"}`}
        >
          Rental Orders
        </button>
        <button
          onClick={() => setTab("payments")}
          className={`pb-3 border-b-2 font-medium ${tab === "payments" ? "border-rust text-rust-deep" : "border-transparent text-ink-soft"}`}
        >
          Payment History
        </button>
      </div>

      {tab === "orders" && (
        <div className="space-y-3">
          {!orders && <p className="text-sm text-ink-soft">Loading orders…</p>}
          {orders && orders.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-sm text-ink-soft mb-4">You haven&apos;t rented anything yet.</p>
              <LinkButton href="/gear" size="sm">
                Browse Gear
              </LinkButton>
            </div>
          )}
          {orders?.map((o) => (
            <OrderRow key={o.id} order={o} detailHref={`/dashboard/customer/orders/${o.id}/pay`} />
          ))}
        </div>
      )}

      {tab === "payments" && (
        <div className="space-y-3">
          {!payments && <p className="text-sm text-ink-soft">Loading payments…</p>}
          {payments && payments.length === 0 && (
            <p className="text-sm text-ink-soft">No payments yet.</p>
          )}
          {payments?.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center border border-line bg-paper p-4"
            >
              <p className="font-mono text-xs text-ink-soft">{p.transactionId}</p>
              <p className="text-xs text-ink-soft">{formatDate(p.createdAt)}</p>
              <p className="text-xs">{p.provider}</p>
              <StatusBadge status={p.status} />
              <p className="font-mono text-sm text-forest text-right sm:text-left">{formatMoney(p.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
