import { RoomStatus } from "@prisma/client";
import { z } from "zod";

export const createRoomSchema = z.object({
  propertyId: z.string().min(1),
  roomNumber: z.string().min(1),
  monthlyRent: z.number().positive(),
  status: z.nativeEnum(RoomStatus).optional()
});

export const createTenantSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  profileData: z.record(z.unknown()).optional()
});

export const createInvoiceSchema = z.object({
  roomId: z.string().min(1),
  tenantId: z.string().min(1),
  billingYear: z.number().int().min(2000),
  billingMonth: z.number().int().min(1).max(12),
  dueDate: z.string().datetime(),
  amount: z.number().positive()
});

export const dashboardFilterSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).optional()
});
