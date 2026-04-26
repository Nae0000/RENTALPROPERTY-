import { RoomCreateForm } from "@/components/forms/room-create-form";
import { RoomCard } from "@/components/rooms/room-card";
import { Card } from "@/components/ui/card";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/translations";
import { prisma } from "@/server/prisma";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const lang = getLang();
  const property = await prisma.property.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" }
  });

  const rooms = await prisma.room
    .findMany({
      where: { deletedAt: null },
      orderBy: { roomNumber: "asc" },
      take: 60
    })
    .catch(() => []);

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold">{t(lang, "rooms.title")}</h2>
        <p className="text-sm text-muted-foreground">{t(lang, "rooms.subtitle")}</p>
      </Card>

      <RoomCreateForm propertyId={property?.id ?? null} lang={lang} />

      {rooms.length === 0 ? (
        <Card>
          <p className="font-medium">{t(lang, "rooms.emptyTitle")}</p>
          <p className="text-sm text-muted-foreground">{t(lang, "rooms.emptyDesc")}</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              roomNumber={room.roomNumber}
              status={room.status}
              tenantName={room.currentTenantName ?? undefined}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
}
