import Link from "next/link";
import Image from "next/image";
import type { Gear } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { Star } from "lucide-react";

export function GearCard({ gear }: { gear: Gear }) {
  const image = gear.images?.[0];
  const reviewCount = gear._count?.reviews ?? 0;

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group block bg-paper border border-line hover:border-rust transition-colors"
    >
      <div className="relative aspect-[4/3] bg-canvas-raised overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={gear.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft/50 tag-label">
            No Photo
          </div>
        )}
        {gear.status !== "AVAILABLE" && (
          <span className="absolute top-2 left-2 tag-label bg-ink/80 text-paper px-2 py-1">
            {gear.status.replace(/_/g, " ")}
          </span>
        )}
        {gear.isFeatured && (
          <span className="absolute top-2 right-2 tag-label bg-rust text-paper px-2 py-1">Featured</span>
        )}
      </div>
      <div className="p-4">
        <p className="tag-label text-moss mb-1">{gear.category?.name ?? "Gear"}</p>
        <h3 className="font-display text-base text-ink leading-tight mb-1 line-clamp-1">{gear.name}</h3>
        {gear.brand && <p className="text-xs text-ink-soft mb-2">{gear.brand}</p>}
        <div className="flex items-center justify-between mt-3">
          <p className="font-mono text-lg text-forest">
            {formatMoney(gear.pricePerDay)}
            <span className="text-xs text-ink-soft"> /day</span>
          </p>
          {reviewCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-ink-soft">
              <Star className="h-3.5 w-3.5 fill-signal text-signal" />
              {reviewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
