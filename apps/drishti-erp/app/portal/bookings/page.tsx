"use client";
import { useEffect, useState } from "react";
import { Camera, Clock, CheckCircle, AlertCircle, CalendarDays, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Booking {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  advancePaid: number;
  equipmentNeeded?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  Pending: { label: "Pending Confirmation", class: "badge-pending", icon: Clock },
  Confirmed: { label: "Confirmed", class: "badge-confirmed", icon: CheckCircle },
  Completed: { label: "Completed", class: "badge-completed", icon: CheckCircle },
  Cancelled: { label: "Cancelled", class: "badge-cancelled", icon: AlertCircle },
};

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function BookingsPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async (currentUser: any) => {
    setLoading(true);
    let url = `/api/bookings?email=${encodeURIComponent(currentUser.email)}`;
    if (currentUser.role === "Admin") {
      url = "/api/bookings?all=true";
    } else if (currentUser.role === "Crew") {
      url = `/api/bookings?staffEmail=${encodeURIComponent(currentUser.email)}`;
    }
    try {
      const res = await fetch(url);
      const d = await res.json();
      setBookings(d.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (!stored) return;
    const currentUser = JSON.parse(stored);
    setUser(currentUser);
    fetchBookings(currentUser);
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok && user) {
        await fetchBookings(user);
      }
    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);
  const isClient = !user || user.role === "Client";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <p className="text-xs text-[#f2ca50] tracking-widest uppercase mb-1">
            {user?.role === "Admin" ? "Administrative View" : user?.role === "Crew" ? "Crew Schedule" : "My Sessions"}
          </p>
          <h1 className="font-display text-4xl text-[#e5e2e1] font-bold">Bookings</h1>
        </div>
        {isClient && (
          <Link href="/portal/bookings/new" className="btn-primary px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider">
            + New Booking
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 animate-fade-in-delay">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider whitespace-nowrap transition-all duration-200 ${
              filter === f
                ? "bg-[#f2ca50] text-[#3c2f00]"
                : "bg-[rgba(255,255,255,0.04)] text-[#5a5248] border border-[rgba(242,202,80,0.1)] hover:border-[rgba(242,202,80,0.3)] hover:text-[#f2ca50]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="glass-card rounded-xl h-28 loading-shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center animate-fade-in">
          <CalendarDays size={40} className="text-[#2a2a2a] mx-auto mb-4" />
          <p className="text-[#5a5248] text-sm mb-6">
            {filter === "All" ? "No bookings found." : `No ${filter.toLowerCase()} bookings.`}
          </p>
          {filter === "All" && isClient && (
            <Link href="/portal/bookings/new" className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold inline-block">
              Book a Shoot
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-delay">
          {filtered.map((b) => {
            const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG["Pending"];
            const Icon = cfg.icon;
            const balance = b.totalAmount - b.advancePaid;
            return (
              <div key={b.id} className="glass-card rounded-xl p-6 border border-white/5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(242,202,80,0.1)] flex items-center justify-center">
                      <Camera size={18} className="text-[#f2ca50]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#e5e2e1]">{b.type}</p>
                      <p className="text-xs text-[#5a5248] mt-0.5">
                        {format(new Date(b.startDate), "MMM d")} – {format(new Date(b.endDate), "MMM d, yyyy")}
                      </p>
                      {user?.role === "Admin" && b.customer && (
                        <p className="text-xs text-[#8a8278] mt-2">
                          Client: <span className="text-[#f2ca50] font-medium">{b.customer.name}</span> ({b.customer.email})
                        </p>
                      )}
                      {user?.role === "Crew" && b.customer && (
                        <p className="text-xs text-[#8a8278] mt-2">
                          Client: <span className="text-white font-medium">{b.customer.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {user?.role === "Admin" ? (
                    <div className="flex items-center gap-2">
                      {updatingId === b.id && <Loader2 size={12} className="animate-spin text-[#f2ca50]" />}
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        disabled={updatingId !== null}
                        className="bg-[#0f0f0f] border border-[#f2ca50]/20 rounded-lg px-2.5 py-1 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50] cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  ) : (
                    <span className={`${cfg.class} flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0`}>
                      <Icon size={10} />
                      {cfg.label}
                    </span>
                  )}
                </div>

                {b.equipmentNeeded && (
                  <p className="text-xs text-[#5a5248] mb-4 pl-13">
                    <span className="text-[#8a8278]">Equipment:</span> {b.equipmentNeeded}
                  </p>
                )}

                {b.totalAmount > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(242,202,80,0.06)]">
                    <div>
                      <p className="text-[10px] text-[#5a5248] uppercase tracking-widest mb-1">Total</p>
                      <p className="text-sm font-semibold text-[#e5e2e1]">₹{b.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5a5248] uppercase tracking-widest mb-1">Advance Paid</p>
                      <p className="text-sm font-semibold text-[#4caf82]">₹{b.advancePaid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5a5248] uppercase tracking-widest mb-1">Balance Due</p>
                      <p className="text-sm font-semibold text-[#f2ca50]">₹{balance.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
