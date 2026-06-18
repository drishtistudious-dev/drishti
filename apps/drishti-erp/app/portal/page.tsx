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
  Film,
  Users,
  ShieldCheck,
  Check,
  X,
  Loader2,
  CalendarDays,
  Bell
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
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
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
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  const fetchData = async (currentUser: UserData) => {
    try {
      if (currentUser.role === "Admin") {
        const [bookingsRes, adminDataRes] = await Promise.all([
          fetch("/api/bookings?all=true"),
          fetch("/api/admin/data")
        ]);
        const bData = await bookingsRes.json();
        const aData = await adminDataRes.json();
        setBookings(bData.bookings || []);
        setAdminData(aData);
      } else if (currentUser.role === "Crew") {
        const res = await fetch(`/api/bookings?staffEmail=${encodeURIComponent(currentUser.email)}`);
        const d = await res.json();
        setBookings(d.bookings || []);
      } else {
        const res = await fetch(`/api/bookings?email=${encodeURIComponent(currentUser.email)}`);
        const d = await res.json();
        setBookings(d.bookings || []);
      }
    } catch (err) {
      console.error("Error fetching portal dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      fetchData(u);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok && user) {
        await fetchData(user);
      }
    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f2ca50]" size={40} />
      </div>
    );
  }

  if (!user) return null;

  // RENDER CORRESPONDING DASHBOARD VIEW
  if (user.role === "Admin") {
    return <AdminDashboardView user={user} bookings={bookings} adminData={adminData} onUpdateStatus={handleUpdateStatus} updatingId={updatingBookingId} />;
  }

  if (user.role === "Crew") {
    return <CrewDashboardView user={user} bookings={bookings} />;
  }

  return <ClientDashboardView user={user} bookings={bookings} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />;
}

// ─── CLIENT DASHBOARD VIEW ───
function ClientDashboardView({ user, bookings, isChatOpen, setIsChatOpen }: { 
  user: UserData; 
  bookings: Booking[]; 
  isChatOpen: boolean; 
  setIsChatOpen: (o: boolean) => void 
}) {
  const upcoming = bookings.filter(b => new Date(b.startDate) >= new Date() && b.status !== "Cancelled");
  const completed = bookings.filter(b => b.status === "Completed");
  const balance = bookings.reduce((sum, b) => sum + (b.totalAmount - b.advancePaid), 0);
  const totalSpent = bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  const firstName = user.name.split(" ")[0] || "there";

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e5e2e1] flex flex-col font-sans selection:bg-[#f2ca50] selection:text-black">
      {/* Hero */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] min-h-[450px] sm:min-h-[650px] flex items-end pb-8 sm:pb-16 px-4 sm:px-8 md:px-16 animate-fade-in">
        <div className="absolute inset-0 bg-cover bg-top" style={{ backgroundImage: `url('/drishti_r.png')` }} />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-[10px] text-[#f2ca50] tracking-[0.3em] font-medium uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#f2ca50]"></span>
              Client Portal
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-light tracking-tight leading-tight mb-2 text-white">
              Welcome, <i className="text-[#f2ca50]">{firstName}</i>.
            </h1>
            <p className="text-[#e5e2e1] font-light text-xs sm:text-sm md:text-base max-w-lg">
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

      {/* Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-12 flex flex-col gap-6 sm:gap-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { label: "UPCOMING", value: String(upcoming.length).padStart(2, "0"), icon: Camera },
            { label: "COMPLETED", value: String(completed.length).padStart(2, "0"), icon: Film },
            { label: "INVESTED", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: Gem },
            { label: "BALANCE", value: `₹${balance.toLocaleString("en-IN")}`, icon: Package }
          ].map((stat, i) => (
            <div key={i} className="relative p-[1px] rounded-2xl bg-gradient-to-b from-[#f2ca50]/30 via-transparent to-transparent group hover:from-[#f2ca50]/60 transition-all duration-500">
              <div className="h-full w-full bg-[#0d0d0d] rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/5 rounded-full blur-3xl group-hover:bg-[#f2ca50]/15 transition-colors duration-500"></div>
                <stat.icon size={22} className="text-[#f2ca50] mb-3 sm:mb-6 opacity-80 transition-transform duration-500 w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.2} />
                <p className="text-[9px] sm:text-[10px] text-[#8a8278] tracking-[0.2em] font-semibold uppercase mb-1 sm:mb-2">{stat.label}</p>
                <p className="font-display text-2xl sm:text-3xl md:text-5xl text-white font-light">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section>
              <h2 className="text-xl font-display text-white mb-6 px-2">Active Projects</h2>
              <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-[#f2ca50]/10 p-5 sm:p-8 md:p-12 min-h-[300px] flex flex-col">
                {bookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Camera size={64} strokeWidth={0.5} className="text-[#f2ca50] mb-6 drop-shadow-[0_0_15px_rgba(242,202,80,0.3)]" />
                    <p className="text-[#e5e2e1] text-lg font-light mb-10 max-w-sm">
                      You don't have any active projects or upcoming sessions in your portfolio.
                    </p>
                    <Link href="/portal/bookings/new" className="px-8 py-4 border border-[#f2ca50] text-[#f2ca50] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[#f2ca50] hover:text-black transition-all">
                      Start One Now
                    </Link>
                  </div>
                ) : (
                  <div className="w-full flex flex-col gap-4">
                    {bookings.slice(0, 5).map(b => {
                      const statusColor = b.status === "Completed" ? "#4caf82" : b.status === "Confirmed" ? "#6495ed" : b.status === "Cancelled" ? "#ff5252" : "#f2ca50";
                      return (
                        <Link key={b.id} href="/portal/bookings" className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:border-[#f2ca50]/30 hover:bg-[#111] transition-all">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-lg font-display text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors">{b.type}</span>
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
                  <Link key={service.label} href="/portal/bookings/new" className="group relative p-4 sm:p-6 rounded-2xl bg-[#0d0d0d] overflow-hidden border border-white/5 hover:border-[#f2ca50]/40 transition-all flex flex-col items-center justify-center gap-3 text-center min-h-[100px] sm:min-h-[140px]">
                    <service.icon size={28} strokeWidth={1} className="text-[#f2ca50] group-hover:scale-110 transition-all" />
                    <span className="text-white text-[9px] tracking-[0.2em] font-semibold uppercase">{service.label}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

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
              <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-[#f2ca50]/40 via-transparent to-transparent">
                <div className="h-full w-full bg-gradient-to-br from-[#0d0d0d] to-[#1a1508] rounded-2xl p-6 sm:p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#f2ca50]/15 rounded-full blur-3xl"></div>
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

// ─── ADMIN DASHBOARD VIEW ───
interface AdminDashboardViewProps {
  user: UserData;
  bookings: Booking[];
  adminData: any;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  updatingId: string | null;
}

function AdminDashboardView({ user, bookings, adminData, onUpdateStatus, updatingId }: AdminDashboardViewProps) {
  const stats = adminData?.stats || {
    totalBookings: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    totalRevenue: 0,
    totalReceived: 0,
    totalOutstanding: 0
  };
  const customers = adminData?.customers || [];
  const staff = adminData?.staff || [];
  const pendingRequests = bookings.filter(b => b.status === "Pending");

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e5e2e1] flex flex-col font-sans p-6 sm:p-8 md:p-12">
      {/* Title */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#f2ca50] tracking-[0.3em] font-medium uppercase mb-1 flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#f2ca50]" />
            Administrative Control
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-light">
            Studio <span className="text-[#f2ca50] italic font-normal">Dashboard</span>
          </h1>
        </div>
        <div className="bg-[rgba(242,202,80,0.08)] border border-[rgba(242,202,80,0.18)] px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#4caf82] rounded-full animate-pulse"></div>
          <span className="text-[10px] tracking-widest text-[#8a8278] uppercase font-bold">Admin Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "PENDING REQUESTS", value: stats.pendingCount, color: "#f2ca50", sub: "Requires approval" },
          { label: "CONFIRMED ACTIVE", value: stats.confirmedCount, color: "#6495ed", sub: "Currently blocked" },
          { label: "TOTAL REVENUE", value: `₹${stats.totalRevenue.toLocaleString()}`, color: "#4caf82", sub: `Outstanding: ₹${stats.totalOutstanding.toLocaleString()}` },
          { label: "TOTAL CLIENTS", value: customers.length, color: "#ffffff", sub: `${staff.length} Active Crew Staff` }
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl"></div>
            <div>
              <p className="text-[9px] text-[#8a8278] tracking-[0.2em] font-bold uppercase mb-1">{s.label}</p>
              <p className="font-display text-xl sm:text-2xl font-semibold leading-none" style={{ color: s.color }}>{s.value}</p>
            </div>
            <p className="text-[10px] text-[#5a5248] mt-3">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Admin Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Confirm Booking Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="glass-card rounded-2xl p-6 border border-white/5 relative">
            <h2 className="text-lg font-display text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#f2ca50] rounded-full"></span>
              Pending Approval Requests ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="py-12 text-center text-[#5a5248]">
                <Camera size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">All booking requests are up to date. No pending actions.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingRequests.map(b => (
                  <div key={b.id} className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#f2ca50]/20 transition-all">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-white">{b.type}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-yellow-500/10 text-[#f2ca50] border border-[#f2ca50]/20 uppercase tracking-widest font-bold">Pending</span>
                      </div>
                      <p className="text-xs text-[#8a8278] mt-1">
                        Client: <strong className="text-white">{b.customer?.name || "Unknown"}</strong> ({b.customer?.email})
                      </p>
                      <p className="text-[10px] text-[#5a5248] mt-1">
                        Date: {format(new Date(b.startDate), "MMM d, yyyy")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateStatus(b.id, "Confirmed")}
                        disabled={updatingId !== null}
                        className="bg-[#f2ca50] text-[#3c2f00] hover:bg-[#ffe088] px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors"
                      >
                        {updatingId === b.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdateStatus(b.id, "Cancelled")}
                        disabled={updatingId !== null}
                        className="bg-transparent border border-red-500/30 text-[#ff5252] hover:bg-red-500/10 px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors"
                      >
                        <X size={12} />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Client portfolio overview */}
          <section className="glass-card rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-display text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#f2ca50] rounded-full"></span>
              Registered Clients Directory ({customers.length})
            </h2>
            {customers.length === 0 ? (
              <p className="text-sm text-[#5a5248]">No clients registered yet.</p>
            ) : (
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                {customers.map((c: any) => (
                  <div key={c.id} className="flex justify-between items-center p-3 rounded-lg bg-[#0d0d0d] border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-white">{c.name}</p>
                      <p className="text-xs text-[#5a5248]">{c.email}</p>
                    </div>
                    {c.phone && <span className="text-xs text-[#8a8278]">{c.phone}</span>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Crew & Staff management list */}
        <div className="flex flex-col gap-6">
          <section className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#f2ca50] rounded-full"></span>
                Studio Crew ({staff.length})
              </h2>
            </div>
            {staff.length === 0 ? (
              <div className="py-6 text-center text-[#5a5248]">
                <p className="text-sm">No crew accounts configured. Create staff accounts in the ERP system.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {staff.map((s: any) => (
                  <div key={s.id} className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5 flex flex-col gap-2 hover:border-[#f2ca50]/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-white">{s.name}</p>
                        <p className="text-[10px] text-[#f2ca50] font-bold tracking-widest uppercase mt-0.5">{s.designation}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-white/5 text-[#8a8278] font-semibold">
                        {s.role}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[11px] text-[#5a5248]">
                      <p>Email: <strong className="text-white">{s.email}</strong></p>
                      <p>Phone: <strong className="text-white">{s.phone}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Notice board for staff */}
          <section className="glass-card rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-[#0d0d0d] to-[#120f07]">
            <h3 className="text-[10px] text-[#f2ca50] tracking-[0.2em] font-bold uppercase mb-4 flex items-center gap-2">
              <Bell size={12} />
              Studio Broadcast Info
            </h3>
            <p className="text-xs text-[#8a8278] leading-relaxed">
              Admins can define staff assignments, set session parameters, and configure notifications for crew members. Updates will sync automatically in real-time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── CREW DASHBOARD VIEW ───
function CrewDashboardView({ user, bookings }: { user: UserData; bookings: Booking[] }) {
  const upcoming = bookings.filter(b => b.status === "Confirmed");
  const completed = bookings.filter(b => b.status === "Completed");

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e5e2e1] flex flex-col font-sans p-6 sm:p-8 md:p-12">
      {/* Title */}
      <div className="mb-10">
        <p className="text-[10px] text-[#f2ca50] tracking-[0.3em] font-medium uppercase mb-1 flex items-center gap-2">
          <span className="w-6 h-[1px] bg-[#f2ca50]"></span>
          Crew Member Portal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-white font-light">
          Welcome back, <span className="text-[#f2ca50] italic font-normal">{user.name}</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "MY ASSIGNMENTS", value: bookings.length, color: "#ffffff", sub: "Total shoots assigned" },
          { label: "UPCOMING SHOOTS", value: upcoming.length, color: "#f2ca50", sub: "Confirmed & ready" },
          { label: "COMPLETED", value: completed.length, color: "#4caf82", sub: "Finished production items" }
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-white/5">
            <div>
              <p className="text-[9px] text-[#8a8278] tracking-[0.2em] font-bold uppercase mb-1">{s.label}</p>
              <p className="font-display text-xl sm:text-2xl font-semibold leading-none" style={{ color: s.color }}>{s.value}</p>
            </div>
            <p className="text-[10px] text-[#5a5248] mt-3">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments list */}
        <div className="lg:col-span-2">
          <section className="glass-card rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-display text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#f2ca50] rounded-full"></span>
              Assigned Shoot List ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
              <div className="py-12 text-center text-[#5a5248]">
                <CalendarDays size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">You have no assignments scheduled currently.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map(b => {
                  const statusColor = b.status === "Completed" ? "#4caf82" : b.status === "Confirmed" ? "#6495ed" : "#f2ca50";
                  return (
                    <div key={b.id} className="p-4 rounded-xl bg-[#0d0d0d] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-semibold text-white">{b.type}</span>
                          <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                          <span className="text-[9px] tracking-wider font-bold text-[#8a8278] uppercase">{b.status}</span>
                        </div>
                        <p className="text-xs text-[#8a8278] mt-1.5">
                          Client: <strong className="text-white">{b.customer?.name || "Unknown"}</strong>
                        </p>
                        <p className="text-[11px] text-[#5a5248] mt-0.5">
                          Shoot Date: {format(new Date(b.startDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                      {/* Job Budget hidden for Crew */}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar announcements/details */}
        <div>
          <section className="glass-card rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-[#0d0d0d] to-[#0f120e]">
            <h2 className="text-md font-display text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#f2ca50] rounded-full"></span>
              Studio Guidelines & Rules
            </h2>
            <ul className="space-y-4 text-xs text-[#8a8278] leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#f2ca50] font-bold">•</span>
                Ensure all backup photography and videography batteries are fully charged and ready the night before.
              </li>
              <li className="flex gap-2">
                <span className="text-[#f2ca50] font-bold">•</span>
                Always review equipment requirements and client notes prior to arriving on setup.
              </li>
              <li className="flex gap-2">
                <span className="text-[#f2ca50] font-bold">•</span>
                Upload digital RAW assets to GCS storage link within 24 hours of shoot completion.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
