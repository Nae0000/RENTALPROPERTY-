import { Card } from "@/components/ui/card";

export default function CalendarLoading() {
  return (
    <div className="space-y-4">
      <Card className="h-24 animate-pulse bg-muted/40" />
      <Card className="h-40 animate-pulse bg-muted/40" />
      <Card className="h-64 animate-pulse bg-muted/40" />
    </div>
  );
}
