"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ArrowLeft, Sparkles } from "lucide-react";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        localStorage.setItem("erp_user", JSON.stringify(data.user));
        router.push("/portal");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image & Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/drishti_r.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/40 backdrop-blur-[2px]" />
      
      {/* Animated ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f2ca50] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4af37] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center animate-fade-in-up">
        {/* Top Back Link */}
        <a 
          href="https://drishtistudios.in/" 
          className="inline-flex items-center gap-2 mb-10 text-[#a09888] hover:text-[#f2ca50] transition-colors text-[9px] tracking-[0.2em] font-semibold uppercase"
        >
          <ArrowLeft size={12} strokeWidth={2.5} />
          Back to main site
        </a>

        {/* Logo container */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-[120px] h-[120px] mb-6 relative">
            <Image
              src="/drishti_logo.png"
              alt="Drishti Studios Logo"
              fill
              className="object-contain filter drop-shadow-[0_0_15px_rgba(242,202,80,0.15)]"
              priority
              unoptimized
            />
          </div>

          <h1 className="font-display text-4xl text-[#e5e2e1] font-normal tracking-tight text-center">
            Drishti <span className="italic font-light text-[#f2ca50]">Studios</span>
          </h1>
        </div>

        {/* Glassmorphism Card */}
        <div className="w-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-[#ffffff0a] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f2ca50]/20 to-transparent" />
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold tracking-[0.15em] text-[#8a8278] uppercase px-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="bg-[#111111]/80 border border-[#2a2a2a] rounded-lg px-4 py-3.5 text-sm text-[#e5e2e1] placeholder-[#4a4238] focus:outline-none focus:border-[#f2ca50] focus:ring-1 focus:ring-[#f2ca50] transition-all"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-[0.15em] text-[#8a8278] uppercase px-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-[#111111]/80 border border-[#2a2a2a] rounded-lg px-4 py-3.5 text-sm text-[#e5e2e1] placeholder-[#4a4238] focus:outline-none focus:border-[#f2ca50] focus:ring-1 focus:ring-[#f2ca50] transition-all"
                placeholder="you@example.com"
              />
            </div>

            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold tracking-[0.15em] text-[#8a8278] uppercase px-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="bg-[#111111]/80 border border-[#2a2a2a] rounded-lg px-4 py-3.5 text-sm text-[#e5e2e1] placeholder-[#4a4238] focus:outline-none focus:border-[#f2ca50] focus:ring-1 focus:ring-[#f2ca50] transition-all"
                  placeholder="+91"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9px] font-bold tracking-[0.15em] text-[#8a8278] uppercase px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="bg-[#111111]/80 border border-[#2a2a2a] rounded-lg px-4 py-3.5 text-sm text-[#e5e2e1] placeholder-[#4a4238] focus:outline-none focus:border-[#f2ca50] focus:ring-1 focus:ring-[#f2ca50] transition-all w-full"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a5248] hover:text-[#f2ca50] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.2)] text-[#ff5252] px-4 py-3 rounded-lg text-xs flex items-center justify-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] py-3.5 rounded-lg text-[10px] font-bold tracking-[0.18em] uppercase transition-all shadow-[0_0_20px_rgba(242,202,80,0.15)] hover:shadow-[0_0_30px_rgba(242,202,80,0.3)] disabled:opacity-70 flex justify-center items-center h-12"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : mode === "login" ? "ACCESS PORTAL" : "CREATE ACCOUNT"}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-[#6a6258] text-[11px]">
                {mode === "login" ? "New to Drishti Studios?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError("");
                  }}
                  className="text-[#f2ca50] font-semibold hover:underline decoration-[#f2ca50]/40 underline-offset-4"
                >
                  {mode === "login" ? "Create Account" : "Sign In"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="text-[8px] text-[#4a4238] tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} DRISHTI STUDIOS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}
