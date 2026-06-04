import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { format } from "date-fns";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_drishti_key_123");

export default async function SchedulePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) redirect("/login");

  let phone = "";
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    phone = payload.phone as string;
  } catch (error) {
    redirect("/login");
  }

  const employee = await prisma.staff.findUnique({
    where: { phone },
    include: {
      assignments: {
        include: {
          booking: {
            include: { 
              customer: true,
              assignments: { include: { staff: true } }
            }
          }
        },
        orderBy: { booking: { startDate: 'asc' } }
      }
    }
  });

  if (!employee) redirect("/login");

  const upcoming = employee.assignments.filter(a => a.booking.startDate >= new Date() && a.booking.status !== "Cancelled");
  const past = employee.assignments.filter(a => a.booking.startDate < new Date() && a.booking.status !== "Cancelled");

  return (
    <div className="p-10 animate-fade-in relative z-10 h-full overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-display text-[#1a1a1a] mb-2">My Schedule</h1>
        <p className="text-[#5c5955] text-sm">View your upcoming and past shoots.</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-display text-[#d4af37] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            Upcoming Shoots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.length === 0 && (
              <p className="text-[#8a8278] text-sm p-6 border border-[#e5e0d8] border-dashed rounded-2xl bg-[#faf9f6] text-center">No upcoming shoots assigned.</p>
            )}
            {upcoming.map(a => (
              <div key={a.id} className="bg-white border border-[#e5e0d8] rounded-2xl p-6 shadow-sm hover:border-[#d4af37]/50 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#d4af37] block mb-1">{a.role}</span>
                    <h3 className="text-lg font-display text-[#1a1a1a]">{a.booking.type}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1a1a1a] font-medium">{format(a.booking.startDate, "MMM d, yyyy")}</p>
                    <p className="text-[#8a8278] text-sm">{format(a.booking.startDate, "h:mm a")}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#f4f2ee]">
                  <p className="text-sm text-[#5c5955]">Client: <span className="text-[#1a1a1a] font-medium">{a.booking.customer.name}</span></p>
                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-[#8a8278] uppercase tracking-widest mb-1">Crew List</p>
                    {a.booking.assignments.map((crew: any) => (
                      <div key={crew.id} className="text-sm flex items-center justify-between bg-[#faf9f6] px-3 py-2 rounded-lg border border-[#e5e0d8]">
                        <span className="text-[#2d2a26] font-medium">{crew.staff.name} {crew.staff.id === employee.id ? <span className="text-xs text-[#8a8278] ml-1 font-normal">(You)</span> : ""}</span>
                        <span className="text-xs text-[#d4af37] font-semibold">{crew.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-display text-[#1a1a1a] mb-4 opacity-70 mt-12">Past Shoots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
            {past.length === 0 && (
              <p className="text-[#8a8278] text-sm p-6">No past shoots.</p>
            )}
            {past.map(a => (
              <div key={a.id} className="bg-[#faf9f6] border border-[#e5e0d8] rounded-2xl p-6 grayscale hover:grayscale-0 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[#1a1a1a] font-medium">{a.booking.type}</h3>
                  <p className="text-[#8a8278] text-sm font-medium">{format(a.booking.startDate, "MMM d, yyyy")}</p>
                </div>
                <p className="text-sm text-[#5c5955]">Role: <span className="font-semibold text-[#8a8278]">{a.role}</span></p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
