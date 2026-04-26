import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type RoomCardProps = {
  roomNumber: string;
  status: "VACANT" | "OCCUPIED" | "MAINTENANCE";
  tenantName?: string;
};

export function RoomCard({ roomNumber, status, tenantName }: RoomCardProps) {
  const tone = status === "VACANT" ? "success" : status === "OCCUPIED" ? "danger" : "neutral";

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{roomNumber}</h3>
        <Badge tone={tone}>{status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{tenantName ?? "No active tenant"}</p>
      <div className="flex gap-2">
        <Button variant="outline">View</Button>
        <Button>Edit</Button>
      </div>
    </Card>
  );
}
