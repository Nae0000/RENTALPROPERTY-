import { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/server/auth";
import { created, fail } from "@/server/api-response";
import { runOneClickOnboarding } from "@/server/services/onboarding";

const onboardingSchema = z.object({
  propertyId: z.string().min(1),
  roomId: z.string().min(1),
  roomNumber: z.string().min(1),
  tenantName: z.string().min(2),
  phone: z.string().min(8),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  monthlyRent: z.number().positive(),
  securityAmount: z.number().nonnegative()
});

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = onboardingSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid onboarding payload", 400, parsed.error.flatten());
  }

  const result = await runOneClickOnboarding(parsed.data);
  return created(result);
}
