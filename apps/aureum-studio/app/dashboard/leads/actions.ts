"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const STATUSES = ["New", "Contacted", "Qualified", "Booked", "Lost"] as const;

export type LeadStatus = (typeof STATUSES)[number];

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });
  revalidatePath("/dashboard/leads");
}

export { STATUSES };
