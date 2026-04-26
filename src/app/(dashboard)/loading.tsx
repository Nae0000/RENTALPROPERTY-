import { Card } from "@/components/ui/card";

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`h-4 animate-pulse rounded bg-muted ${className ?? "w-full"}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <Card>
        <SkeletonLine className="w-40" />
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <SkeletonLine className="mb-2 w-24" />
            <SkeletonLine className="w-32" />
          </Card>
        ))}
      </div>
      <Card>
        <SkeletonLine className="mb-2 w-56" />
        <SkeletonLine />
        <SkeletonLine className="mt-2 w-4/5" />
      </Card>
    </div>
  );
}
