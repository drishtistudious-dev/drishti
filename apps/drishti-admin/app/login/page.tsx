"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ShieldAlert, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Password Login State
  const [loginMode, setLoginMode] = useState<"otp" | "password">("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Initialize reCAPTCHA on component mount
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate phone number format (must include country code)
    if (!phone.startsWith("+")) {
      setError("Please include country code (e.g. +91 or +1)");
      setLoading(false);
      return;
    }

    try {
      // 1. Check if the user is an Admin in our database
      const checkRes = await fetch("/api/auth/check-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      
      const checkData = await checkRes.json();
      if (!checkRes.ok) {
        throw new Error(checkData.error || "Access Denied");
      }

      // 2. Trigger Firebase SMS
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      
      setConfirmationResult(result);
      setStep(2);
      setCountdown(30);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send OTP. Try again.");
      // Reset recaptcha so the user can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId: any) => {
          window.recaptchaVerifier.reset(widgetId);
        }).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError("");
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setCountdown(30);
    } catch (err: any) {
      console.error(err);
      setError("Failed to resend OTP. Please try again.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((wId: any) => window.recaptchaVerifier.reset(wId)).catch(()=>{});
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setLoading(true);
    setError("");

    try {
      // 1. Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // 2. Get ID Token
      const idToken = await user.getIdToken();

      // 3. Create Session Cookie
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, phone }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to create session");
      }

      // 4. Redirect to Dashboard
      router.push("/");
      router.refresh();
      
    } catch (err: any) {
      console.error(err);
      setError("Invalid OTP or verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login Failed");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f2ca50]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      <div className="w-full max-w-md p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 relative">
            <Image 
              src="/drishti_logo.png" 
              alt="Drishti Logo" 
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display text-white mb-2">Admin Portal</h1>
          <p className="text-[#8a8278] text-sm">Sign in to manage studio operations</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl mb-8">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${loginMode === 'otp' ? 'bg-[#f2ca50] text-black' : 'text-[#8a8278] hover:text-white'}`}
            onClick={() => setLoginMode('otp')}
          >
            OTP Login
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${loginMode === 'password' ? 'bg-[#f2ca50] text-black' : 'text-[#8a8278] hover:text-white'}`}
            onClick={() => setLoginMode('password')}
          >
            Password Login
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {loginMode === 'otp' ? (
          step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#8a8278] mb-2">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919876543210"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f2ca50] transition-colors"
                disabled={loading}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f2ca50] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#e6be4b] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  Continue <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <p className="text-sm text-[#8a8278]">Code sent to <span className="text-white">{phone}</span></p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <button 
                  type="button" 
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="text-xs text-[#8a8278] hover:text-white transition-colors"
                >
                  Change number
                </button>
                <span className="text-[#333]">•</span>
                <button 
                  type="button" 
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || loading}
                  className="text-xs text-[#f2ca50] hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#8a8278] transition-colors"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#8a8278] mb-2">Enter 6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
                placeholder="000000"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-[#f2ca50] transition-colors"
                disabled={loading}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#f2ca50] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#e6be4b] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify & Log In"}
            </button>
          </form>
          )
        ) : (
          <form onSubmit={handlePasswordLogin} className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#8a8278] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f2ca50] transition-colors"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#8a8278] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f2ca50] transition-colors"
                disabled={loading}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f2ca50] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#e6be4b] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  Log In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Invisible Recaptcha Container */}
        <div id="recaptcha-container"></div>

      </div>
    </div>
  );
}

// Add global declaration for window
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
