import prisma from "@/lib/prisma";
import LeadsTable from "./LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-10 animate-fade-in">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Leads Management</h1>
          <p className="text-sm text-[#8a8278]">Track and convert incoming inquiries.</p>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <LeadsTable initialLeads={leads} />
      </div>
    </div>
  );
}
