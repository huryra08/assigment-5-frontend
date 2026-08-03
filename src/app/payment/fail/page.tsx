"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

function FailContent() {
  const params = useSearchParams();
  const transactionId = params.get("transactionId");

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
      <AlertTriangle className="h-16 w-16 text-rust mx-auto mb-6" />
      <h1 className="font-display text-3xl text-forest mb-3">Payment Failed</h1>
      <p className="text-sm text-ink-soft mb-2">Something went wrong processing your payment. No charge was made.</p>
      {transactionId && (
        <p className="font-mono text-xs text-ink-soft/70 mb-8">Transaction: {transactionId}</p>
      )}
      <LinkButton href="/dashboard/customer" size="lg" variant="outline">
        Back to My Orders
      </LinkButton>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={null}>
      <FailContent />
    </Suspense>
  );
}
