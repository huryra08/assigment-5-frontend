export function GearCardSkeleton() {
  return (
    <div className="bg-paper border border-line animate-pulse">
      <div className="aspect-[4/3] bg-canvas-raised" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-16 bg-canvas-raised" />
        <div className="h-4 w-3/4 bg-canvas-raised" />
        <div className="h-4 w-1/3 bg-canvas-raised" />
      </div>
    </div>
  );
}
