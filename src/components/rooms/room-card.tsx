import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

type RoomCardProps = {
  roomNumber: string;
  status: "VACANT" | "OCCUPIED" | "MAINTENANCE";
  tenantName?: string;
  lang: Lang;
};

export function RoomCard({ roomNumber, status, tenantName, lang }: RoomCardProps) {
  const tone = status === "VACANT" ? "success" : status === "OCCUPIED" ? "danger" : "neutral";
  const statusKey =
    status === "VACANT" ? "rooms.status.vacant" : status === "OCCUPIED" ? "rooms.status.occupied" : "rooms.status.maintenance";

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{roomNumber}</h3>
        <Badge tone={tone}>{t(lang, statusKey)}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{tenantName ?? t(lang, "rooms.noTenant")}</p>
      <div className="flex gap-2">
        <Button variant="outline">{t(lang, "rooms.view")}</Button>
        <Button>{t(lang, "rooms.edit")}</Button>
      </div>
    </Card>
  );
}
