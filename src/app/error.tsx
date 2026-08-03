"use client";

import { LinkButton } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
      <AlertTriangle className="h-16 w-16 text-rust mx-auto mb-6" />
      <h1 className="font-display text-3xl text-forest mb-3">Something Went Wrong</h1>
      <p className="text-sm text-ink-soft mb-8">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-3 justify-center">
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
        <LinkButton href="/">Go Home</LinkButton>
      </div>
    </div>
  );
}
