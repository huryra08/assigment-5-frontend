import { LinkButton } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24 text-center">
      <Compass className="h-16 w-16 text-rust mx-auto mb-6" />
      <h1 className="font-display text-3xl text-forest mb-3">Payment is successfull</h1>

      <LinkButton href="/">Verify Payment</LinkButton>
      
    </div>
  );
}
