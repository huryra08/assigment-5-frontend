"use client";

import { useEffect, useState } from "react";
import { gearApi, rentalApi } from "@/lib/api";
import type { Gear, RentalOrder } from "@/lib/types";
import { LinkButton } from "@/components/ui/button";
import { GearCard } from "@/components/gear-card";
import { OrderRow } from "@/components/order-row";
import { Plus } from "lucide-react";

export default function ProviderDashboard() {
  const [gear, setGear] = useState<Gear[] | null>(null);
  const [orders, setOrders] = useState<RentalOrder[] | null>(null);

  useEffect(() => {
    gearApi.mine().then(setGear).catch(() => setGear([]));
    rentalApi.providerOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  const activeRentals = orders?.filter((o) => ["CONFIRMED", "PICKED_UP", "ONGOING"].includes(o.status)).length ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === "PENDING").length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="tag-label text-rust mb-2">Provider dashboard</p>
          <h1 className="font-display text-3xl text-forest">Your Gear Shop</h1>
        </div>
        <LinkButton href="/dashboard/provider/gear/new">
          <Plus className="h-4 w-4" /> Add Gear
        </LinkButton>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-line bg-paper p-5">
          <p className="tag-label text-ink-soft mb-1">Total Gear</p>
          <p className="font-display text-3xl text-forest">{gear?.length ?? "—"}</p>
        </div>
        <div className="border border-line bg-paper p-5">
          <p className="tag-label text-ink-soft mb-1">Active Rentals</p>
          <p className="font-display text-3xl text-forest">{orders ? activeRentals : "—"}</p>
        </div>
        <div className="border border-line bg-paper p-5">
          <p className="tag-label text-ink-soft mb-1">Pending Orders</p>
          <p className="font-display text-3xl text-rust">{orders ? pendingOrders : "—"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-forest">Your Inventory</h2>
        <LinkButton href="/dashboard/provider/orders" variant="outline" size="sm">
          Manage Orders
        </LinkButton>
      </div>

      {!gear && <p className="text-sm text-ink-soft">Loading gear…</p>}
      {gear && gear.length === 0 && (
        <div className="border border-dashed border-line p-8 text-center">
          <p className="text-sm text-ink-soft mb-4">You haven&apos;t listed any gear yet.</p>
          <LinkButton href="/dashboard/provider/gear/new" size="sm">
            List your first item
          </LinkButton>
        </div>
      )}
      {gear && gear.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {gear.map((g) => (
            <div key={g.id} className="relative">
              <GearCard gear={g} />
              <LinkButton
                href={`/dashboard/provider/gear/${g.id}/edit`}
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 !px-3 !py-1.5"
              >
                Edit
              </LinkButton>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl text-forest mb-4">Recent Orders</h2>
      <div className="space-y-3">
        {!orders && <p className="text-sm text-ink-soft">Loading orders…</p>}
        {orders && orders.length === 0 && <p className="text-sm text-ink-soft">No orders yet.</p>}
        {orders?.slice(0, 5).map((o) => (
          <OrderRow key={o.id} order={o} detailHref="/dashboard/provider/orders" />
        ))}
      </div>
    </div>
  );
}
