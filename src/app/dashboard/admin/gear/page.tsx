"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { Gear } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/utils";

export default function AdminGearPage() {
  const [gear, setGear] = useState<Gear[] | null>(null);

  useEffect(() => {
    adminApi.allGear().then(setGear).catch(() => setGear([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <p className="tag-label text-rust mb-2">Admin dashboard</p>
      <h1 className="font-display text-3xl text-forest mb-8">All Gear Listings</h1>

      {!gear && <p className="text-sm text-ink-soft">Loading…</p>}
      {gear && gear.length === 0 && <p className="text-sm text-ink-soft">No gear listed on the platform yet.</p>}

      {gear && gear.length > 0 && (
        <div className="border border-line bg-paper overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="tag-label text-ink-soft border-b border-line text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price/day</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {gear.map((g) => (
                <tr key={g.id} className="border-b border-line last:border-0">
                  <td className="p-3 font-medium">{g.name}</td>
                  <td className="p-3 text-ink-soft">{g.provider?.name ?? "—"}</td>
                  <td className="p-3 text-ink-soft">{g.category?.name ?? "—"}</td>
                  <td className="p-3 font-mono">{formatMoney(g.pricePerDay)}</td>
                  <td className="p-3">
                    <StatusBadge status={g.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
