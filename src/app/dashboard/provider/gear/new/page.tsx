import { GearForm } from "@/components/gear-form";

export default function NewGearPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <p className="tag-label text-rust mb-2">Provider dashboard</p>
      <h1 className="font-display text-3xl text-forest mb-8">List New Gear</h1>
      <GearForm />
    </div>
  );
}
