"use client";

import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function InnerForm({ onPaid }: { onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed. Check your card details.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onPaid();
    } else {
      toast.error("Payment could not be confirmed.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting ? "Processing…" : "Pay now"}
      </Button>
    </form>
  );
}

export function StripePaymentForm({ clientSecret, onPaid }: { clientSecret: string; onPaid: () => void }) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance: {
          variables: {
            colorPrimary: "#bf5730",
            colorBackground: "#faf7ee",
            colorText: "#21261f",
            fontFamily: "Inter, system-ui, sans-serif",
            borderRadius: "0px",
          },
        },
      }}
    >
      <InnerForm onPaid={onPaid} />
    </Elements>
  );
}
