import prisma from "@/lib/prisma";
import { Users, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import AddStaffModal from "./AddStaffModal";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" }
  });

  const staff = await prisma.staff.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-10 animate-fade-in">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">People Directory</h1>
          <p className="text-sm text-[#8a8278]">Manage your clients and studio staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Clients Directory */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-[#f2ca50]" size={20} />
            <h2 className="text-xl font-display text-white">Client Directory</h2>
          </div>
          
          <div className="flex flex-col divide-y divide-[#1a1a1a]">
            {clients.map(c => (
              <div key={c.id} className="py-4 flex justify-between items-center group">
                <div>
                  <p className="text-sm font-semibold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors">{c.name}</p>
                  <p className="text-xs text-[#8a8278]">{c.email || c.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white mb-1">Joined {format(c.createdAt, "MMM yyyy")}</p>
                </div>
              </div>
            ))}
            {clients.length === 0 && (
              <p className="py-4 text-sm text-[#8a8278]">No clients found.</p>
            )}
          </div>
        </div>

        {/* Staff Directory */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#f2ca50]" size={20} />
              <h2 className="text-xl font-display text-white">Studio Staff</h2>
            </div>
            <AddStaffModal />
          </div>
          
          <div className="flex flex-col divide-y divide-[#1a1a1a]">
            {staff.map(s => (

              <div key={s.id} className="py-4 flex justify-between items-center group">
                <div>
                  <p className="text-sm font-semibold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors">{s.name}</p>
                  <p className="text-xs text-[#8a8278]">{s.email || s.phone}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#f2ca50]/30 text-[#f2ca50] bg-[#f2ca50]/10">
                    {s.role}
                  </span>
                </div>
              </div>
            ))}
            {staff.length === 0 && (
              <p className="py-4 text-sm text-[#8a8278]">No staff accounts found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
