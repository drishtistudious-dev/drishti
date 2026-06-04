"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  MessageCircle, 
  Camera, 
  Gem,
  User,
  Baby,
  Package,
  GlassWater,
  Film
} from "lucide-react";
import { format } from "date-fns";
import ChatBot from "../../components/ChatBot";

interface Booking {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  advancePaid: number;
  createdAt?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const SERVICES = [
  { label: "Wedding", icon: Gem },
  { label: "Portrait", icon: User },
  { label: "Newborn", icon: Baby },
  { label: "Product", icon: Package },
  { label: "Events", icon: GlassWater },
  { label: "Cinematic", icon: Film },
];

export default function PortalDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      fetch(`/api/bookings?email=${encodeURIComponent(u.email)}`)
        .then(r => r.json())
        .then(d => setBookings(d.bookings || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const upcoming = bookings.filter(b => new Date(b.startDate) >= new Date() && b.status !== "Cancelled");
  const completed = bookings.filter(b => b.status === "Completed");
  const balance = bookings.reduce((sum, b) => sum + (b.totalAmount - b.advancePaid), 0);
  const totalSpent = bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e5e2e1] flex flex-col font-sans selection:bg-[#f2ca50] selection:text-black">
      
      {/* ─── Hero Section ─── */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] min-h-[450px] sm:min-h-[650px] 2xl:min-h-[800px] flex items-end pb-8 sm:pb-16 px-4 sm:px-8 md:px-16 2xl:px-24 animate-fade-in">
        <div className="absolute inset-0 bg-cover bg-top" style={{ backgroundImage: `url('/drishti_r.png')` }} />
        
        {/* Only dim the bottom so text is readable, leaving the top completely bright */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-[10px] text-[#f2ca50] tracking-[0.3em] font-medium uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#f2ca50]"></span>
              Client Portal
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl 2xl:text-8xl font-light tracking-tight leading-tight mb-2 text-white">
              Welcome, <i className="text-[#f2ca50]">{firstName}</i>.
            </h1>
            <p className="text-[#e5e2e1] font-light text-xs sm:text-sm md:text-base 2xl:text-xl max-w-lg 2xl:max-w-2xl">
              Manage your upcoming sessions, view project details, and connect with your producer.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/portal/bookings/new"
              className="bg-white text-black px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#f2ca50] transition-colors flex items-center gap-3 rounded-sm">
              New Session
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Content Container (Interactive Luxury) ─── */}
      <div className="flex-1 w-full max-w-7xl 2xl:max-w-[100rem] mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-12 2xl:py-20 flex flex-col gap-6 sm:gap-12 2xl:gap-16 relative z-10">
        
        {/* Sleek Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 2xl:gap-8">
          {[
            { label: "UPCOMING", value: String(upcoming.length).padStart(2, "0"), icon: Camera },
            { label: "COMPLETED", value: String(completed.length).padStart(2, "0"), icon: Film },
            { label: "INVESTED", value: `₹${totalSpent > 0 ? totalSpent.toLocaleString("en-IN") : "0"}`, icon: Gem },
            { label: "BALANCE", value: `₹${balance > 0 ? balance.toLocaleString("en-IN") : "0"}`, icon: Package }
          ].map((stat, i) => (
            <div key={i} className="relative p-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#f2ca50]/30 via-transparent to-transparent group hover:from-[#f2ca50]/60 transition-all duration-500">
              <div className="h-full w-full bg-[#0d0d0d] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#f2ca50]/15 transition-colors duration-500"></div>
                <stat.icon size={22} className="text-[#f2ca50] mb-3 sm:mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500 w-5 h-5 sm:w-6 sm:h-6 2xl:w-8 2xl:h-8" strokeWidth={1.2} />
                <p className="text-[9px] sm:text-[10px] 2xl:text-xs text-[#8a8278] tracking-[0.1em] sm:tracking-[0.2em] font-semibold uppercase mb-1 sm:mb-2 line-clamp-1">{stat.label}</p>
                <p className="font-display text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl text-white font-light">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8 2xl:gap-12">
          
          {/* Main Area: Active Projects */}
          <div className="lg:col-span-2 2xl:col-span-3 flex flex-col gap-6 2xl:gap-10">
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-display text-white">Active Projects</h2>
              </div>
              <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-[#f2ca50]/10 p-5 sm:p-8 md:p-12 min-h-[300px] group flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f2ca50]/5 via-[#0a0a0a] to-[#0a0a0a] opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {loading ? (
                  <div className="relative z-10 w-full flex flex-col gap-4">
                    {[1,2,3].map(i => <div key={i} className="h-20 bg-[#111] rounded-2xl animate-pulse" />)}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Camera size={64} strokeWidth={0.5} className="text-[#f2ca50] mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(242,202,80,0.3)]" />
                    <p className="text-[#e5e2e1] text-lg font-light relative z-10 mb-10 max-w-sm leading-relaxed">
                      You don't have any active projects or upcoming sessions in your portfolio.
                    </p>
                    <Link href="/portal/bookings/new" className="relative z-10 px-8 py-4 bg-transparent border border-[#f2ca50] text-[#f2ca50] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[#f2ca50] hover:text-black transition-all duration-300">
                      Start One Now
                    </Link>
                  </div>
                ) : (
                  <div className="relative z-10 w-full flex flex-col gap-4">
                    {bookings.slice(0, 5).map(b => {
                       const statusColor = b.status === "Completed" ? "#4caf82" : b.status === "Confirmed" ? "#6495ed" : b.status === "Cancelled" ? "#ff5252" : "#f2ca50";
                       return (
                         <Link key={b.id} href="/portal/bookings" className="group/item flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:border-[#f2ca50]/30 hover:bg-[#111] transition-all duration-300">
                           <div className="flex flex-col gap-1.5">
                             <span className="text-lg font-display text-[#e5e2e1] group-hover/item:text-[#f2ca50] transition-colors">{b.type}</span>
                             <span className="text-[10px] text-[#5a5248] tracking-widest uppercase">{format(new Date(b.startDate), "MMMM d, yyyy")}</span>
                           </div>
                           <div className="flex items-center gap-8 mt-4 sm:mt-0">
                             <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: statusColor, background: statusColor }} />
                               <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8a8278]">{b.status}</span>
                             </div>
                             <span className="text-sm font-light text-white w-24 text-right">
                               {b.totalAmount > 0 ? `₹${b.totalAmount.toLocaleString("en-IN")}` : "—"}
                             </span>
                           </div>
                         </Link>
                       )
                    })}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-display text-white mb-6 px-2 mt-4">Quick Book</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {SERVICES.map((service) => (
                  <Link key={service.label} href="/portal/bookings/new" className="group relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0d0d0d] overflow-hidden border border-white/5 hover:border-[#f2ca50]/40 transition-all duration-500 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center min-h-[100px] sm:min-h-[140px]">
                    {/* Hover Sweep Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2ca50]/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                    <service.icon size={28} strokeWidth={1} className="text-[#f2ca50] group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-white text-[9px] tracking-[0.2em] font-semibold uppercase">{service.label}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area: Activity & Support */}
          <div className="flex flex-col gap-6">
            <section>
              <h2 className="text-xl font-display text-white mb-6 px-2">Recent Activity</h2>
              <div className="p-5 sm:p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 min-h-[200px] flex flex-col">
                {bookings.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[#6a6258] text-sm font-light">No recent activity.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {bookings.slice(0, 4).map((b, i) => {
                       const dotColor = b.status === "Completed" ? "#4caf82" : b.status === "Confirmed" ? "#6495ed" : "#f2ca50";
                       return (
                         <div key={i} className="flex gap-4 items-start group">
                           <div className="mt-2 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] flex-shrink-0" style={{ color: dotColor, background: dotColor }} />
                           <div className="flex flex-col gap-1.5">
                             <span className="text-sm text-white font-light group-hover:text-[#f2ca50] transition-colors">{b.type}</span>
                             <div className="flex items-center gap-2 text-[10px] text-[#5a5248] uppercase tracking-wider">
                               <span>{b.status}</span>
                               <span>•</span>
                               <span>{format(new Date(b.createdAt || b.startDate), "MMM d")}</span>
                             </div>
                           </div>
                         </div>
                       )
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="mt-4">
              <div className="relative p-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#f2ca50]/40 via-transparent to-transparent">
                <div className="h-full w-full bg-gradient-to-br from-[#0d0d0d] to-[#1a1508] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#f2ca50]/15 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h3 className="text-[10px] text-[#f2ca50] tracking-[0.2em] font-bold uppercase mb-4 relative z-10 flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-[#f2ca50]"></span>
                    Producer Support
                  </h3>
                  <p className="text-[#e5e2e1] text-sm font-light leading-relaxed mb-10 relative z-10">
                    Connect directly with your dedicated studio producer for immediate assistance, project updates, or scheduling changes.
                  </p>
                  <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-3 px-6 py-3 bg-[#f2ca50] text-black text-[10px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white transition-colors relative z-10 w-fit">
                    <MessageCircle size={14} />
                    Chat Now
                  </button>
                  <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                </div>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
}
