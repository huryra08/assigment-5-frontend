"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--paper)",
          color: "var(--ink)",
          border: "1px solid var(--line)",
          fontFamily: "var(--font-body)",
        },
      }}
    />
  );
}
