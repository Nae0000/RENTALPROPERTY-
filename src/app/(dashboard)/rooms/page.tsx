import { RoomCard } from "@/components/rooms/room-card";
import { Card } from "@/components/ui/card";
import { prisma } from "@/server/prisma";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
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
        <h2 className="text-lg font-semibold">Rooms</h2>
        <p className="text-sm text-muted-foreground">
          Manage room availability, maintenance status, and current tenant assignment.
        </p>
      </Card>

      {rooms.length === 0 ? (
        <Card>
          <p className="font-medium">No rooms found</p>
          <p className="text-sm text-muted-foreground">
            Add the first room record from your onboarding flow or create rooms through the Rooms API.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              roomNumber={room.roomNumber}
              status={room.status}
              tenantName={room.currentTenantName ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
