import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_drishti_key_123");

export default async function EmployeeDashboard() {
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

  const upcomingAssignments = employee.assignments.filter(
    a => a.booking.startDate >= new Date() && a.booking.status !== "Cancelled"
  );
  const nextShoot = upcomingAssignments[0];

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { author: true }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 2xl:p-16 animate-fade-in relative z-10 h-full max-w-[120rem] mx-auto">
      <div className="mb-8 sm:mb-12 2xl:mb-16">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-display text-[#1a1a1a] mb-3 tracking-tight">Let's create some magic today, {employee.name}!</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8 2xl:gap-12">
        
        {/* Next Schedule Bento */}
        <div className="lg:col-span-2 2xl:col-span-3 rounded-2xl sm:rounded-[2rem] bg-white border border-[#e5e0d8] p-5 sm:p-8 2xl:p-12 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-6 sm:mb-8 2xl:mb-10 relative z-10">
            <h2 className="text-lg sm:text-xl 2xl:text-3xl font-display text-[#1a1a1a] tracking-wide">Next Schedule</h2>
            <div className="w-8 h-[1px] bg-[#d4af37]/50"></div>
          </div>
          
          {nextShoot ? (
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 2xl:gap-8 p-4 sm:p-6 2xl:p-8 rounded-2xl bg-[#faf9f6] border border-[#e5e0d8]">
                <div className="flex-1">
                  <span className="text-[10px] 2xl:text-xs font-bold tracking-[0.2em] uppercase text-[#d4af37] block mb-2">{nextShoot.role}</span>
                  <p className="text-xl sm:text-2xl 2xl:text-4xl font-display text-[#1a1a1a] mb-1">{nextShoot.booking.type}</p>
                  <p className="text-xs sm:text-sm 2xl:text-lg text-[#5c5955] mb-4">Client: <span className="text-[#1a1a1a] font-medium">{nextShoot.booking.customer.name}</span></p>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-[#8a8278] uppercase tracking-widest mb-1">Your Team For This Shoot</p>
                    {nextShoot.booking.assignments.map((crew: any) => (
                      <div key={crew.id} className="text-sm flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#e5e0d8] shadow-sm">
                        <span className="text-[#2d2a26] font-medium">{crew.staff.name} {crew.staff.id === employee.id ? <span className="text-xs text-[#8a8278] ml-1 font-normal">(You)</span> : ""}</span>
                        <span className="text-xs text-[#d4af37] font-semibold">{crew.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <p className="text-2xl sm:text-3xl 2xl:text-5xl font-display text-[#1a1a1a] font-light">{format(nextShoot.booking.startDate, "MMM d, yyyy")}</p>
                  <p className="text-xs sm:text-sm 2xl:text-lg text-[#5c5955] mt-1">{format(nextShoot.booking.startDate, "h:mm a")}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center relative z-10 bg-[#faf9f6] rounded-2xl border border-[#e5e0d8] border-dashed">
              <p className="text-[#8a8278]">No upcoming shoots assigned.</p>
            </div>
          )}
        </div>

        {/* Announcements Bento */}
        <div className="lg:col-span-1 rounded-2xl sm:rounded-[2rem] bg-white border border-[#e5e0d8] p-5 sm:p-8 2xl:p-12 shadow-sm">
          <div className="flex items-center justify-between mb-6 2xl:mb-8">
            <h2 className="text-lg sm:text-xl 2xl:text-3xl font-display text-[#1a1a1a] tracking-wide">Updates</h2>
            <div className="w-8 h-[1px] bg-[#e5e0d8]"></div>
          </div>
          
          <div className="flex flex-col gap-4">
            {announcements.map(ann => (
              <div key={ann.id} className="p-5 rounded-2xl bg-[#faf9f6] border border-[#e5e0d8] hover:border-[#d4af37]/30 transition-colors">
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1">{ann.title}</h3>
                <p className="text-xs text-[#5c5955] mb-3 line-clamp-2 leading-relaxed">{ann.content}</p>
                <div className="flex justify-between items-center text-[9px] text-[#8a8278] uppercase tracking-wider font-semibold">
                  <span>{ann.author.name}</span>
                  <span className="text-[#d4af37]">{format(ann.createdAt, "MMM d")}</span>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-sm text-[#8a8278] text-center py-8 bg-[#faf9f6] rounded-2xl border border-[#e5e0d8] border-dashed">No recent updates.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
