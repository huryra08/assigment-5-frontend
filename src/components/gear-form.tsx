"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { categoryApi, gearApi, ApiError } from "@/lib/api";
import type { Category, Gear } from "@/lib/types";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

type Spec = { key: string; value: string };

export function GearForm({ existing }: { existing?: Gear }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [brand, setBrand] = useState(existing?.brand ?? "");
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
  const [pricePerDay, setPricePerDay] = useState(String(existing?.pricePerDay ?? ""));
  const [quantity, setQuantity] = useState(String(existing?.quantity ?? "1"));
  const [status, setStatus] = useState(existing?.status ?? "AVAILABLE");
  const [isFeatured, setIsFeatured] = useState(existing?.isFeatured ?? false);
  const [images, setImages] = useState<string[]>(existing?.images?.length ? existing.images : [""]);
  const [specs, setSpecs] = useState<Spec[]>(
    existing?.specifications
      ? Object.entries(existing.specifications).map(([key, value]) => ({ key, value: String(value) }))
      : []
  );

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Choose a category.");
      return;
    }
    setSubmitting(true);

    const payload = {
      name,
      description,
      brand: brand || undefined,
      categoryId,
      pricePerDay: Number(pricePerDay),
      quantity: Number(quantity),
      status,
      isFeatured,
      images: images.map((i) => i.trim()).filter(Boolean),
      specifications: specs.reduce<Record<string, string>>((acc, s) => {
        if (s.key.trim()) acc[s.key.trim()] = s.value;
        return acc;
      }, {}),
    };

    try {
      if (existing) {
        await gearApi.update(existing.id, payload);
        toast.success("Gear updated.");
      } else {
        await gearApi.create(payload);
        toast.success("Gear listed.");
      }
      router.push("/dashboard/provider");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save that gear.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    if (!confirm(`Remove "${existing.name}" from your inventory?`)) return;
    try {
      await gearApi.remove(existing.id);
      toast.success("Gear removed.");
      router.push("/dashboard/provider");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't remove that gear.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="4-Person Tent" />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="What makes this gear great?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Brand</Label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="REI Co-op" />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Price / day (USD)</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Quantity in stock</Label>
          <Input type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as Gear["status"])}>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Feature this item on the homepage
      </label>

      <div>
        <Label>Image URLs</Label>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={img}
                onChange={(e) => setImages((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                placeholder="https://…"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="px-2 text-ink-soft hover:text-rust"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setImages((prev) => [...prev, ""])}
          className="mt-2 flex items-center gap-1 text-xs text-rust font-medium"
        >
          <Plus className="h-3.5 w-3.5" /> Add another image
        </button>
      </div>

      <div>
        <Label>Specifications</Label>
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Weight"
                value={s.key}
                onChange={(e) =>
                  setSpecs((prev) => prev.map((v, idx) => (idx === i ? { ...v, key: e.target.value } : v)))
                }
              />
              <Input
                placeholder="2.3 kg"
                value={s.value}
                onChange={(e) =>
                  setSpecs((prev) => prev.map((v, idx) => (idx === i ? { ...v, value: e.target.value } : v)))
                }
              />
              <button
                type="button"
                onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-ink-soft hover:text-rust"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSpecs((prev) => [...prev, { key: "", value: "" }])}
          className="mt-2 flex items-center gap-1 text-xs text-rust font-medium"
        >
          <Plus className="h-3.5 w-3.5" /> Add spec
        </button>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : existing ? "Save changes" : "List gear"}
        </Button>
        {existing && (
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
