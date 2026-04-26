import { NextRequest } from "next/server";
import { DocumentType } from "@prisma/client";
import { z } from "zod";
import { requireSession } from "@/server/auth";
import { created, fail } from "@/server/api-response";
import { prisma } from "@/server/prisma";

const addDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  mimeType: z.string().min(1),
  fileSize: z.number().int().nonnegative().default(0)
});

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(request: NextRequest, { params }: RouteContext) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const parsed = addDocumentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid document payload", 400, parsed.error.flatten());
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: params.id } });
  if (!tenant) return fail("NOT_FOUND", "Tenant not found", 404);

  const document = await prisma.tenantDocument.create({
    data: {
      tenantId: params.id,
      type: parsed.data.type,
      fileName: parsed.data.fileName,
      fileUrl: parsed.data.fileUrl,
      mimeType: parsed.data.mimeType,
      fileSize: parsed.data.fileSize
    }
  });

  return created(document);
}
