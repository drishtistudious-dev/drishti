import prisma from "@/lib/prisma";
import { format } from "date-fns";
import BentoGrid from "@/components/BentoGrid";
// Server Component
export default async function AdminDashboard() {
  // Fetch high-level metrics
  const totalBookings = await prisma.booking.findMany();
  const totalRevenue = totalBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  
  const upcomingShoots = totalBookings.filter(b => b.startDate >= new Date() && b.status !== "Cancelled");
  
  const allLeads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }});
  const activeLeads = allLeads.filter(l => l.status === "New" || l.status === "Contacted");

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { customer: true }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 2xl:p-16 animate-fade-in relative z-10 max-w-[120rem] mx-auto">
      <div className="mb-8 sm:mb-12 2xl:mb-16">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-display text-white mb-2 sm:mb-3 tracking-tight">Dashboard Overview</h1>
        <p className="text-xs sm:text-sm 2xl:text-lg text-[#8a8278] font-light">Welcome to the Drishti Admin Management Portal.</p>
      </div>

      {/* KPI Bento Grid */}
      <BentoGrid metrics={{ totalRevenue, upcomingShoots: upcomingShoots.length, activeLeads: activeLeads.length, totalClients: await prisma.customer.count() }} />

      {/* Activity Lists - Hoverboard style */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 2xl:gap-12">
        
        {/* Recent Bookings */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 p-5 sm:p-8 2xl:p-12 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6 sm:mb-8 2xl:mb-10">
            <h2 className="text-lg sm:text-xl 2xl:text-3xl font-display text-white tracking-wide">Recent Bookings</h2>
            <div className="w-8 h-[1px] bg-[#f2ca50]/50"></div>
          </div>
          <div className="flex flex-col gap-3">
            {recentBookings.map(b => (
              <div key={b.id} className="group relative p-3 sm:p-4 2xl:p-6 rounded-2xl bg-white/[0.01] border border-transparent hover:border-[#f2ca50]/30 hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(242,202,80,0.1)] transition-all duration-500 flex justify-between items-center cursor-pointer overflow-hidden hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f2ca50]/0 via-[#f2ca50]/15 to-[#f2ca50]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-sm 2xl:text-lg font-semibold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors">{b.type}</p>
                  <p className="text-xs 2xl:text-base text-[#8a8278] mt-1">{b.customer.name}</p>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-xs 2xl:text-base text-[#e5e2e1] font-medium mb-1.5">{format(b.startDate, "MMM d, yyyy")}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold border ${
                    b.status === "Completed" ? "border-green-500/30 text-green-500 bg-green-500/10" : 
                    b.status === "Confirmed" ? "border-blue-400/30 text-blue-400 bg-blue-400/10" : 
                    "border-[#f2ca50]/30 text-[#f2ca50] bg-[#f2ca50]/10"
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <p className="py-8 text-center text-sm text-[#8a8278]">No bookings found.</p>
            )}
          </div>
        </div>

        {/* New Leads */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 p-5 sm:p-8 2xl:p-12 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6 sm:mb-8 2xl:mb-10">
            <h2 className="text-lg sm:text-xl 2xl:text-3xl font-display text-white tracking-wide">New Leads</h2>
            <div className="w-8 h-[1px] bg-white/20"></div>
          </div>
          <div className="flex flex-col gap-3">
            {allLeads.slice(0, 5).map(l => (
              <div key={l.id} className="group relative p-3 sm:p-4 2xl:p-6 rounded-2xl bg-white/[0.01] border border-transparent hover:border-white/30 hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 flex justify-between items-center cursor-pointer overflow-hidden hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-sm 2xl:text-lg font-semibold text-[#e5e2e1] group-hover:text-white transition-colors">{l.name}</p>
                  <p className="text-xs 2xl:text-base text-[#8a8278] mt-1">{l.email || l.phone}</p>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-xs 2xl:text-base text-[#e5e2e1] font-medium mb-1.5">{l.source}</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold border border-green-500/30 text-green-500 bg-green-500/10">
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
            {allLeads.length === 0 && (
              <p className="py-8 text-center text-sm text-[#8a8278]">No leads found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
