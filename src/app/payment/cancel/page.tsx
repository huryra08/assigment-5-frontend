"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { XCircle } from "lucide-react";

function CancelContent() {
  const params = useSearchParams();
  const transactionId = params.get("transactionId");

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
      <XCircle className="h-16 w-16 text-signal mx-auto mb-6" />
      <h1 className="font-display text-3xl text-forest mb-3">Payment Cancelled</h1>
      <p className="text-sm text-ink-soft mb-2">You cancelled the checkout — your order is still pending payment.</p>
      {transactionId && (
        <p className="font-mono text-xs text-ink-soft/70 mb-8">Transaction: {transactionId}</p>
      )}
      <LinkButton href="/dashboard/customer" size="lg" variant="outline">
        Back to My Orders
      </LinkButton>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <CancelContent />
    </Suspense>
  );
}
