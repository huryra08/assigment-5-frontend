"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { gearApi, categoryApi } from "@/lib/api";
import type { Gear, Category } from "@/lib/types";
import { GearCard } from "@/components/gear-card";
import { GearCardSkeleton } from "@/components/gear-card-skeleton";
import { Input, Select, Label } from "@/components/ui/input";
import { Search } from "lucide-react";

function GearBrowse() {
  const searchParams = useSearchParams();
  const [gear, setGear] = useState<Gear[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    gearApi
      .list()
      .then(setGear)
      .catch(() => setError("Couldn't load gear. Check that the API server is running."));
  }, []);

  const filtered = useMemo(() => {
    if (!gear) return [];
    return gear.filter((g) => {
      if (g.status !== "AVAILABLE") return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const hit =
          g.name.toLowerCase().includes(term) ||
          g.description.toLowerCase().includes(term) ||
          (g.brand?.toLowerCase().includes(term) ?? false);
        if (!hit) return false;
      }
      if (category && g.categoryId !== category) return false;
      const price = Number(g.pricePerDay);
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;
      return true;
    });
  }, [gear, searchTerm, category, minPrice, maxPrice]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <p className="tag-label text-rust mb-2">Full inventory</p>
      <h1 className="font-display text-3xl sm:text-4xl text-forest mb-8">Browse Gear</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-5 border border-line bg-paper p-5 h-fit">
          <div>
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
              <Input
                className="pl-8"
                placeholder="Tent, bike, kayak…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Price per day</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </aside>

        <div>
          {error && <p className="text-rust-deep text-sm mb-4">{error}</p>}

          {!gear && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <GearCardSkeleton key={i} />
              ))}
            </div>
          )}

          {gear && (
            <>
              <p className="text-sm text-ink-soft mb-4">{filtered.length} items available</p>
              {filtered.length === 0 ? (
                <p className="text-ink-soft text-sm">No gear matches those filters. Try widening your search.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((g) => (
                    <GearCard key={g.id} gear={g} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GearPage() {
  return (
    <Suspense fallback={null}>
      <GearBrowse />
    </Suspense>
  );
}
