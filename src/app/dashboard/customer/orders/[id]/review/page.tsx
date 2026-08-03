"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { rentalApi, reviewApi, ApiError } from "@/lib/api";
import type { RentalOrder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LeaveReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [gearId, setGearId] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    rentalApi.get(id).then((o) => {
      setOrder(o);
      setGearId(o.items[0]?.gearId ?? "");
    });
  }, [id]);

  if (!order) {
    return <div className="mx-auto max-w-xl px-4 sm:px-6 py-16 text-ink-soft text-sm">Loading order…</div>;
  }

  const handleSubmit = async () => {
    if (!gearId) {
      toast.error("Choose which gear you're reviewing.");
      return;
    }
    setSubmitting(true);
    try {
      await reviewApi.create({ gearId, rentalOrderId: order.id, rating, comment: comment || undefined });
      toast.success("Thanks for the review!");
      router.push("/dashboard/customer");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't submit that review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-14">
      <p className="tag-label text-rust mb-2">Order {order.orderNumber}</p>
      <h1 className="font-display text-2xl text-forest mb-8">Leave a review</h1>

      <div className="space-y-5 border border-line bg-paper p-5">
        {order.items.length > 1 && (
          <div>
            <Label>Which item?</Label>
            <select
              className="w-full bg-paper border border-ink/25 px-3 py-2.5 text-sm"
              value={gearId}
              onChange={(e) => setGearId(e.target.value)}
            >
              {order.items.map((item) => (
                <option key={item.id} value={item.gearId}>
                  {item.gear?.name ?? item.gearId}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <Label>Rating</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)}>
                <Star
                  className={cn("h-7 w-7", n <= rating ? "fill-signal text-signal" : "text-line")}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Comment (optional)</Label>
          <Textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the gear?" />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit review"}
        </Button>
      </div>
    </div>
  );
}
