import { prisma } from "@/lib/prisma";
import KanbanBoard from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-white">Leads</h1>
      <KanbanBoard leads={leads} />
    </div>
  );
}
