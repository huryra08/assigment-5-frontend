import { cn } from "@/lib/utils";
import { slugStatus } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-signal/20 text-signal border-signal/40",
  CONFIRMED: "bg-forest/15 text-forest border-forest/40",
  PICKED_UP: "bg-moss/20 text-moss border-moss/40",
  ONGOING: "bg-moss/20 text-moss border-moss/40",
  RETURNED: "bg-ink/10 text-ink-soft border-ink/25",
  CANCELLED: "bg-rust/15 text-rust-deep border-rust/40",
  OVERDUE: "bg-rust/20 text-rust-deep border-rust/50",
  COMPLETED: "bg-forest/15 text-forest border-forest/40",
  FAILED: "bg-rust/15 text-rust-deep border-rust/40",
  REFUNDED: "bg-ink/10 text-ink-soft border-ink/25",
  AVAILABLE: "bg-forest/15 text-forest border-forest/40",
  RENTED: "bg-signal/20 text-signal border-signal/40",
  MAINTENANCE: "bg-rust/15 text-rust-deep border-rust/40",
  UNAVAILABLE: "bg-ink/10 text-ink-soft border-ink/25",
  ACTIVE: "bg-forest/15 text-forest border-forest/40",
  BLOCKED: "bg-rust/15 text-rust-deep border-rust/40",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "tag-label inline-flex items-center border px-2 py-1",
        STATUS_STYLES[status] || "bg-ink/10 text-ink-soft border-ink/25"
      )}
    >
      {slugStatus(status)}
    </span>
  );
}
