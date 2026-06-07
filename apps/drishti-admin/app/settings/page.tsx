"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, User, Mail, Phone, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/staff/me");
      const data = await res.json();
      if (res.ok) {
        setProfile(data.staff);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await fetch("/api/staff/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[#f2ca50]" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 2xl:p-16 animate-fade-in relative z-10 max-w-4xl mx-auto">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-display text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-sm 2xl:text-lg text-[#8a8278] font-light">Manage your profile and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Details (Read Only) */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 backdrop-blur-md h-fit">
          <h2 className="text-xl font-display text-white mb-6">Profile Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-2 flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <div className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                {profile?.name}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-2 flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <div className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                {profile?.email}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-2 flex items-center gap-2">
                <Phone size={14} /> Phone Number
              </label>
              <div className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                {profile?.phone}
              </div>
            </div>
            
            <div className="pt-2">
               <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold border border-[#f2ca50]/30 text-[#f2ca50] bg-[#f2ca50]/10">
                 {profile?.role} • {profile?.designation}
               </span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8 backdrop-blur-md">
          <h2 className="text-xl font-display text-white mb-6">Security</h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-2">New Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2ca50]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8a8278] mb-2">Confirm New Password</label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#f2ca50]"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={updateLoading}
              className="w-full mt-4 bg-[#f2ca50] text-black font-bold py-3.5 rounded-xl text-xs tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {updateLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
