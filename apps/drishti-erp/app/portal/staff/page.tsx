"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, ShieldCheck, AlertCircle, Loader2, Users, Briefcase } from "lucide-react";
import Link from "next/link";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
}

export default function StaffDirectoryPage() {
  const [user, setUser] = useState<any>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (!stored) return;
    const currentUser = JSON.parse(stored);
    setUser(currentUser);

    if (currentUser.role !== "Admin") {
      setLoading(false);
      return;
    }

    fetch("/api/admin/data")
      .then(r => r.json())
      .then(d => setStaff(d.staff || []))
      .catch(e => console.error("Error loading staff:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f2ca50]" size={36} />
      </div>
    );
  }

  // Access guard
  if (!user || user.role !== "Admin") {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <AlertCircle size={48} className="text-[#ff5252] mb-4" />
        <h2 className="text-xl font-display text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-[#5a5248] leading-relaxed mb-6">
          The Staff/Crew directory is restricted to administrator accounts only.
        </p>
        <Link href="/portal" className="btn-primary px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-xs text-[#f2ca50] tracking-widest uppercase mb-1 flex items-center gap-1.5">
            <Users size={12} />
            Studio Operations
          </p>
          <h1 className="font-display text-4xl text-[#e5e2e1] font-bold">Staff & Crew</h1>
        </div>
      </div>

      {/* Staff List Grid */}
      {staff.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center animate-fade-in">
          <Users size={40} className="text-[#2a2a2a] mx-auto mb-4" />
          <p className="text-[#5a5248] text-sm">No crew accounts configured. Create staff accounts in the ERP system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delay">
          {staff.map((s) => (
            <div key={s.id} className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:border-[#f2ca50]/20 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.2)] flex items-center justify-center text-[#f2ca50] text-lg font-bold">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] bg-[#f2ca50]/10 border border-[#f2ca50]/20 text-[#f2ca50] font-bold tracking-widest uppercase">
                      {s.role}
                    </span>
                    <p className="text-[10px] text-[#5a5248] tracking-wider uppercase mt-1.5 flex items-center gap-1 justify-end">
                      <Briefcase size={10} />
                      {s.designation}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-4">{s.name}</h3>

                <div className="space-y-2.5 text-xs text-[#8a8278] pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Mail size={13} className="text-[#5a5248]" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="text-[#5a5248]" />
                    <span>{s.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-[#5a5248] uppercase tracking-wider">Account ID</span>
                <span className="text-[10px] text-white/40 font-mono">{s.id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
