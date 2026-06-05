"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Save, Loader2, CheckCircle, Camera } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({ name: u.name || "", phone: u.phone || "" });
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Update localStorage (in production this would hit an API)
    await new Promise(r => setTimeout(r, 600));
    const updated = { ...user, ...form };
    localStorage.setItem("erp_user", JSON.stringify(updated));
    setUser(updated as UserData);
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12">
      <div className="mb-8 animate-fade-in">
        <p className="text-xs text-[#f2ca50] tracking-widest uppercase mb-1">Account</p>
        <h1 className="font-display text-4xl text-[#e5e2e1] font-bold">My Profile</h1>
      </div>

      {/* Avatar card */}
      <div className="glass-card rounded-2xl p-8 mb-6 flex items-center gap-6 animate-fade-in-delay">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[rgba(242,202,80,0.15)] border border-[rgba(242,202,80,0.25)] flex items-center justify-center">
            <span className="font-display text-4xl text-[#f2ca50] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-[#f2ca50] flex items-center justify-center">
            <Camera size={12} className="text-[#3c2f00]" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#e5e2e1]">{user.name}</h2>
          <p className="text-[#5a5248] text-sm mt-0.5">{user.email}</p>
          <span className="mt-2 inline-block px-3 py-1 bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.2)] rounded-full text-xs text-[#f2ca50] tracking-wider">
            Client Member
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass-card rounded-2xl p-8 animate-fade-in-delay-2">
        <h3 className="text-sm font-semibold text-[#e5e2e1] tracking-wider uppercase mb-6">Personal Information</h3>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-2 text-xs text-[#8a8278] tracking-widest uppercase mb-2">
              <User size={12} />
              Full Name
            </label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="input-luxury w-full rounded-lg px-4 py-3 text-sm"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-[#8a8278] tracking-widest uppercase mb-2">
              <Mail size={12} />
              Email Address
            </label>
            <div className="input-luxury w-full rounded-lg px-4 py-3 text-sm text-[#5a5248] cursor-not-allowed">
              {user.email}
            </div>
            <p className="text-xs text-[#3a3530] mt-1.5">Email cannot be changed. Contact us to update.</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-[#8a8278] tracking-widest uppercase mb-2">
              <Phone size={12} />
              Phone Number
            </label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              type="tel"
              className="input-luxury w-full rounded-lg px-4 py-3 text-sm"
              placeholder="+91 98765 43210"
            />
          </div>

          <button
            type="submit"
            disabled={loading || saved}
            className="btn-primary py-3.5 rounded-xl text-sm font-semibold tracking-widest flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {loading ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Studio contact */}
      <div className="glass-card rounded-2xl p-6 mt-6 animate-fade-in-delay-2">
        <p className="text-xs text-[#5a5248] tracking-widest uppercase mb-4">Need Help?</p>
        <div className="flex flex-col gap-3">
          <a href="mailto:drishtistudious@gmail.com" className="flex items-center gap-3 text-sm text-[#8a8278] hover:text-[#f2ca50] transition-colors">
            <Mail size={14} className="text-[#f2ca50]" />
            drishtistudious@gmail.com
          </a>
          <a href="tel:8460549557" className="flex items-center gap-3 text-sm text-[#8a8278] hover:text-[#f2ca50] transition-colors">
            <Phone size={14} className="text-[#f2ca50]" />
            +91 84605 49557
          </a>
        </div>
      </div>
    </div>
  );
}
