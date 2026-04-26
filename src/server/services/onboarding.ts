import { prisma } from "@/server/prisma";

type OnboardingInput = {
  propertyId: string;
  roomId: string;
  roomNumber: string;
  tenantName: string;
  phone: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityAmount: number;
};

export async function runOneClickOnboarding(input: OnboardingInput) {
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        fullName: input.tenantName,
        phone: input.phone
      }
    });

    const lease = await tx.leaseContract.create({
      data: {
        roomId: input.roomId,
        tenantId: tenant.id,
        startDate,
        endDate,
        monthlyRent: input.monthlyRent,
        securityAmount: input.securityAmount,
        status: "ACTIVE"
      }
    });

    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth(), 5);

    const invoice = await tx.rentInvoice.create({
      data: {
        roomId: input.roomId,
        tenantId: tenant.id,
        billingYear: now.getFullYear(),
        billingMonth: now.getMonth() + 1,
        dueDate,
        amount: input.monthlyRent,
        status: "PENDING"
      }
    });

    await tx.depositLedger.create({
      data: {
        leaseContractId: lease.id,
        amount: input.securityAmount,
        type: "DEPOSIT_IN",
        effectiveDate: now
      }
    });

    await tx.room.update({
      where: { id: input.roomId },
      data: {
        status: "OCCUPIED",
        currentTenantName: input.tenantName
      }
    });

    return { tenant, lease, invoice };
  });
}
