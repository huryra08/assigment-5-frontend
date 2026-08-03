"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { rentalApi, paymentApi, ApiError } from "@/lib/api";
import type { RentalOrder } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Landmark, ExternalLink, BadgeCheck } from "lucide-react";

export default function OrderPayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [starting, setStarting] = useState(false);
  const [confirming, setConfirming] = useState(false);


  
  const [pendingTxn, setPendingTxn] = useState<{ transactionId: string; checkoutUrl?: string } | null>(null);

  const load = () => {
    if (!id) return;
    rentalApi.get(id).then(setOrder).catch(() => setOrder(null));
  };

  useEffect(load, [id]);

  if (!order) {
    return <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-ink-soft text-sm">Loading order…</div>;
  }

  const alreadyPaid = order.paymentStatus === "COMPLETED";

  const startPayment = async () => {
    setStarting(true);
    try {
      const result = await paymentApi.create({ rentalOrderId: order.id, provider: "SSLCOMMERZ" });
      setPendingTxn({ transactionId: result.payment.transactionId, checkoutUrl: result.checkoutUrl });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't start that payment.");
    } finally {
      setStarting(false);
    }
  };

  const goToCheckout = () => {
    if (pendingTxn?.checkoutUrl) {
      window.location.href = pendingTxn.checkoutUrl;
    } else {
      toast.error("No checkout URL returned by SSLCommerz.");
    }
  };

  const confirmManually = async () => {
    if (!pendingTxn) return;
    setConfirming(true);
    try {
      await paymentApi.confirm({ transactionId: pendingTxn.transactionId, status: "COMPLETED" });
      toast.success("Payment confirmed!");
      router.push(`/payment/success?transactionId=${pendingTxn.transactionId}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't confirm that payment.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <p className="tag-label text-rust mb-2">Order {order.orderNumber}</p>
      <h1 className="font-display text-2xl text-forest mb-6">Rental Order</h1>

      <div className="border border-line bg-paper p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </div>
        <p className="text-sm text-ink-soft mb-4">
          {formatDate(order.startDate)} &rarr; {formatDate(order.endDate)}
        </p>
        <div className="space-y-2 border-t border-line pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.gear?.name ?? "Gear item"} &times; {item.quantity}
              </span>
              <span className="font-mono">{formatMoney(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-line mt-4 pt-4 font-medium">
          <span>Total</span>
          <span className="font-mono text-forest text-lg">{formatMoney(order.totalAmount)}</span>
        </div>
      </div>

      {alreadyPaid ? (
        <div className="border border-forest/30 bg-forest/5 p-5 text-center">
          <p className="text-forest font-medium">This order is already paid.</p>
        </div>
      ) : !pendingTxn ? (
        <div className="border border-line bg-paper p-5">
          <p className="tag-label text-rust mb-4">Pay for this order</p>
          <Button onClick={startPayment} disabled={starting} className="w-full justify-center">
            <Landmark className="h-4 w-4" />
            {starting ? "Starting…" : "Pay with SSLCommerz"}
          </Button>
        </div>
      ) : (
        <div className="border border-line bg-paper p-5 space-y-4">
          <div>
            <p className="tag-label text-rust mb-1">Payment session started</p>
            <p className="font-mono text-xs text-ink-soft">{pendingTxn.transactionId}</p>
          </div>

          <Button onClick={goToCheckout} className="w-full justify-center">
            <ExternalLink className="h-4 w-4" />
            Continue to SSLCommerz
          </Button>

          <div className="border-t border-line pt-4">
            <p className="text-xs text-ink-soft mb-3">
              Already completed the payment on SSLCommerz&apos;s page, or testing locally? Confirm it here.
            </p>
            <Button
              variant="outline"
              onClick={confirmManually}
              disabled={confirming}
              className="w-full justify-center"
            >
              <BadgeCheck className="h-4 w-4" />
              {confirming ? "Confirming…" : "I've Completed This Payment"}
            </Button>
          </div>
        </div>
      )}

      {order.status === "RETURNED" && (
        <div className="mt-6 border border-signal/40 bg-signal/10 p-5 flex items-center justify-between">
          <p className="text-sm">Gear returned — how was it?</p>
          <Button size="sm" onClick={() => router.push(`/dashboard/customer/orders/${order.id}/review`)}>
            Leave a review
          </Button>
        </div>
      )}
    </div>
  );
}