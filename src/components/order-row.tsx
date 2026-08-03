import Link from "next/link";
import type { RentalOrder } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

export function OrderRow({ order, detailHref }: { order: RentalOrder; detailHref: string }) {
  return (
    <Link
      href={detailHref}
      className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center border border-line bg-paper p-4 hover:border-rust transition-colors"
    >
      <div className="col-span-2 sm:col-span-1">
        <p className="font-mono text-xs text-ink-soft">{order.orderNumber}</p>
        <p className="text-sm font-medium">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="text-xs text-ink-soft">
        {formatDate(order.startDate)} &rarr; {formatDate(order.endDate)}
      </div>
      <div>
        <StatusBadge status={order.status} />
      </div>
      <div>
        <StatusBadge status={order.paymentStatus} />
      </div>
      <div className="text-right sm:text-left font-mono text-sm text-forest">
        {formatMoney(order.totalAmount)}
      </div>
    </Link>
  );
}
