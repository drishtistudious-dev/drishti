import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { format } from "date-fns";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_drishti_key_123");

export default async function AnnouncementsPage() {
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

  const employee = await prisma.staff.findUnique({ where: { phone } });
  if (!employee) redirect("/login");

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });

  return (
    <div className="p-10 animate-fade-in relative z-10 h-full overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-display text-[#1a1a1a] mb-2">Studio Updates</h1>
        <p className="text-[#5c5955] text-sm">Important announcements and memos from the admin team.</p>
      </div>

      <div className="max-w-3xl flex flex-col gap-6">
        {announcements.length === 0 && (
          <p className="text-[#8a8278] p-8 border border-[#e5e0d8] border-dashed rounded-2xl bg-[#faf9f6] text-center">No announcements available yet.</p>
        )}
        
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white border border-[#e5e0d8] hover:border-[#d4af37]/30 hover:shadow-md transition-all rounded-2xl p-6 relative overflow-hidden group">
            {/* Subtle left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] to-[#f4f2ee] opacity-30 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-display text-[#1a1a1a]">{ann.title}</h2>
              <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase px-3 py-1.5 bg-[#d4af37]/5 rounded-full border border-[#d4af37]/10">
                {format(ann.createdAt, "MMM d, yyyy")}
              </span>
            </div>
            
            <p className="text-[#2d2a26] whitespace-pre-wrap leading-relaxed mb-6">{ann.content}</p>
            
            <div className="pt-4 border-t border-[#f4f2ee] flex items-center gap-2 text-sm text-[#8a8278]">
              <span>Posted by</span>
              <span className="text-[#1a1a1a] font-medium">{ann.author.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
