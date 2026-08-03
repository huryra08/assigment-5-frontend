"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { gearApi } from "@/lib/api";
import type { Gear } from "@/lib/types";
import { GearForm } from "@/components/gear-form";

export default function EditGearPage() {
  const { id } = useParams<{ id: string }>();
  const [gear, setGear] = useState<Gear | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    gearApi.get(id).then(setGear).catch(() => setError("Couldn't load that gear."));
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <p className="tag-label text-rust mb-2">Provider dashboard</p>
      <h1 className="font-display text-3xl text-forest mb-8">Edit Gear</h1>
      {error && <p className="text-rust-deep text-sm">{error}</p>}
      {!gear && !error && <p className="text-sm text-ink-soft">Loading…</p>}
      {gear && <GearForm existing={gear} />}
    </div>
  );
}
