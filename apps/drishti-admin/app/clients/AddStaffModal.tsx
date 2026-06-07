"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddStaffModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Crew" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setIsOpen(false);
        setForm({ name: "", email: "", phone: "", role: "Crew" });
        router.refresh();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#f2ca50] text-black px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors"
      >
        <Plus size={16} />
        Add Staff
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0d0d0d] border border-white/10 p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-[#8a8278] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-display text-white mb-6">Add New Staff</h2>
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2ca50]"
                  placeholder="E.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-1.5">Phone Number (For OTP Login)</label>
                <input 
                  type="tel" 
                  required 
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2ca50]"
                  placeholder="+919876543210"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-1.5">Email (Optional)</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2ca50]"
                  placeholder="john@drishtistudios.in"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-1.5">System Role</label>
                <select 
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2ca50] appearance-none"
                >
                  <option value="Crew">Crew (Crew Portal Only)</option>
                  <option value="Producer">Producer (Crew Portal Only)</option>
                  <option value="Admin">Admin (Full Access)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-[#f2ca50] text-black font-bold py-3.5 rounded-xl text-xs tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Staff Member"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
