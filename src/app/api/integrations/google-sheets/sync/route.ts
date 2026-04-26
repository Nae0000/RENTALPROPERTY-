import { NextRequest } from "next/server";
import { requireSession } from "@/server/auth";
import { fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const idempotencyKey = request.headers.get("x-idempotency-key");
  if (!idempotencyKey) {
    return fail("MISSING_IDEMPOTENCY_KEY", "x-idempotency-key header is required");
  }

  const latestSnapshot = await prisma.reportSnapshot.findFirst({
    orderBy: [{ year: "desc" }, { month: "desc" }]
  });

  if (!latestSnapshot) {
    return fail("NO_SNAPSHOT", "No report snapshot available to sync", 404);
  }

  const job = await prisma.syncJob.create({
    data: {
      reportSnapshotId: latestSnapshot.id,
      provider: "google-sheets",
      status: "QUEUED"
    }
  });

  return ok({
    jobId: job.id,
    status: job.status,
    message: "Sync job queued. Implement worker in src/server/integrations/google-sheets.ts"
  });
}
