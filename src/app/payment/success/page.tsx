"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const transactionId = params.get("transactionId");

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
      <CheckCircle2 className="h-16 w-16 text-forest mx-auto mb-6" />
      <h1 className="font-display text-3xl text-forest mb-3">Payment Successful</h1>
      <p className="text-sm text-ink-soft mb-2">Your rental is confirmed. Time to hit the trail.</p>
      {transactionId && (
        <p className="font-mono text-xs text-ink-soft/70 mb-8">Transaction: {transactionId}</p>
      )}
      <LinkButton href="/dashboard/customer" size="lg">
        View My Orders
      </LinkButton>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
