import { RoomCard } from "@/components/rooms/room-card";
import { prisma } from "@/server/prisma";

export default async function RoomsPage() {
  const rooms = await prisma.room
    .findMany({
      where: { deletedAt: null },
      orderBy: { roomNumber: "asc" },
      take: 60
    })
    .catch(() => []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          roomNumber={room.roomNumber}
          status={room.status === "VACANT" ? "VACANT" : "OCCUPIED"}
          tenantName={room.currentTenantName ?? undefined}
        />
      ))}
    </div>
  );
}
