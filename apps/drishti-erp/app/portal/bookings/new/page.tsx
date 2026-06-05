"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Loader2, ChevronLeft, Gem, Heart, User, Baby, Package, GlassWater, Film, Sparkles } from "lucide-react";
import Link from "next/link";

const SHOOT_TYPES = [
  { id: "Wedding Photography", label: "Wedding Photography", desc: "Full-day wedding coverage", icon: Gem, price: "₹25,000+" },
  { id: "Pre-Wedding", label: "Pre-Wedding / Engagement", desc: "Romantic couple sessions", icon: Heart, price: "₹12,000+" },
  { id: "Portrait Session", label: "Portrait Session", desc: "Individual or group portraits", icon: User, price: "₹5,000+" },
  { id: "Newborn & Maternity", label: "Newborn & Maternity", desc: "Precious early moments", icon: Baby, price: "₹8,000+" },
  { id: "Product Photography", label: "Product Photography", desc: "Commercial product shoots", icon: Package, price: "₹6,000+" },
  { id: "Event Coverage", label: "Event Coverage", desc: "Birthdays, parties, functions", icon: GlassWater, price: "₹10,000+" },
  { id: "Cinematography", label: "Cinematography / Video", desc: "Full video production", icon: Film, price: "₹35,000+" },
  { id: "Fashion Shoot", label: "Fashion / Editorial", desc: "High-end fashion shoots", icon: Sparkles, price: "₹15,000+" },
];

type Step = "type" | "details" | "success";

export default function NewBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string; phone?: string } | null>(null);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    equipmentNeeded: "",
    notes: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !form.startDate || !form.endDate) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          phone: user.phone,
          type: selectedType,
          startDate: form.startDate,
          endDate: form.endDate,
          equipmentNeeded: form.equipmentNeeded,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Booking failed.");
      } else {
        setStep("success");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[rgba(76,175,130,0.15)] border border-[rgba(76,175,130,0.3)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-[#4caf82]" />
        </div>
        <h1 className="font-display text-4xl text-[#e5e2e1] font-bold mb-3">Booking Submitted!</h1>
        <p className="text-[#5a5248] mb-2">Your <strong className="text-[#f2ca50]">{selectedType}</strong> session request has been received.</p>
        <p className="text-[#5a5248] text-sm mb-10">Our team will contact you within 24 hours to confirm the details and discuss the session further.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/portal/bookings" className="btn-primary px-8 py-3 rounded-lg text-sm font-semibold">
            View My Bookings
          </Link>
          <button onClick={() => { setStep("type"); setSelectedType(""); setForm({ startDate: "", endDate: "", equipmentNeeded: "", notes: "" }); }}
            className="btn-ghost px-8 py-3 rounded-lg text-sm font-semibold">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <Link href="/portal/bookings" className="inline-flex items-center gap-2 text-[#5a5248] hover:text-[#f2ca50] text-xs tracking-wider uppercase mb-4 transition-colors">
          <ChevronLeft size={14} />
          Back to Bookings
        </Link>
        <p className="text-xs text-[#f2ca50] tracking-widest uppercase mb-1">New Session</p>
        <h1 className="font-display text-4xl text-[#e5e2e1] font-bold">Book a Shoot</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10 animate-fade-in-delay">
        {["Select Type", "Session Details"].map((s, i) => {
          const isActive = (i === 0 && step === "type") || (i === 1 && step === "details");
          const isDone = (i === 0 && step === "details");
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDone ? "bg-[#4caf82] text-white" : isActive ? "bg-[#f2ca50] text-[#3c2f00]" : "bg-[#1a1a1a] border border-[rgba(242,202,80,0.15)] text-[#5a5248]"
              }`}>
                {isDone ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-[#f2ca50]" : "text-[#5a5248]"}`}>{s}</span>
              {i < 1 && <div className="w-12 h-px bg-[rgba(242,202,80,0.15)] mx-1" />}
            </div>
          );
        })}
      </div>

      {/* STEP 1 — Shoot Type */}
      {step === "type" && (
        <div className="animate-fade-in">
          <p className="text-[#8a8278] text-sm mb-6">Choose the type of photography or videography service you need.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHOOT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`glass-card rounded-xl p-5 text-left transition-all duration-300 border ${
                  selectedType === type.id
                    ? "border-[rgba(242,202,80,0.5)] bg-[rgba(242,202,80,0.06)]"
                    : "border-transparent hover:border-[rgba(242,202,80,0.2)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <type.icon size={22} className="text-[#f2ca50] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#e5e2e1]">{type.label}</p>
                    <p className="text-xs text-[#5a5248] mt-0.5">{type.desc}</p>
                    <p className="text-xs text-[#f2ca50] font-medium mt-2">{type.price}</p>
                  </div>
                  {selectedType === type.id && (
                    <CheckCircle size={16} className="text-[#f2ca50] flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8">
            <button
              onClick={() => { if (!selectedType) { setError("Please select a shoot type."); return; } setError(""); setStep("details"); }}
              className="btn-primary w-full py-4 rounded-xl text-sm font-semibold tracking-widest"
            >
              Continue →
            </button>
            {error && <p className="text-[#ff5252] text-sm text-center mt-3">{error}</p>}
          </div>
        </div>
      )}

      {/* STEP 2 — Details */}
      {step === "details" && (
        <div className="animate-fade-in">
          <div className="glass-card rounded-xl p-5 flex items-center gap-3 mb-8 border border-[rgba(242,202,80,0.2)]">
            {(() => {
              const Icon = SHOOT_TYPES.find(t => t.id === selectedType)?.icon;
              return Icon ? <Icon size={22} className="text-[#f2ca50]" strokeWidth={1.5} /> : null;
            })()}
            <div>
              <p className="text-sm font-semibold text-[#f2ca50]">{selectedType}</p>
              <button onClick={() => setStep("type")} className="text-xs text-[#5a5248] hover:text-[#f2ca50] transition-colors">Change type →</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-[#8a8278] tracking-widest uppercase mb-2">Shoot Date *</label>
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="input-luxury w-full rounded-lg px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8a8278] tracking-widest uppercase mb-2">End Date *</label>
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  min={form.startDate || new Date().toISOString().split("T")[0]}
                  className="input-luxury w-full rounded-lg px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#8a8278] tracking-widest uppercase mb-2">Equipment / Special Requirements</label>
              <input
                name="equipmentNeeded"
                type="text"
                value={form.equipmentNeeded}
                onChange={handleChange}
                placeholder="E.g., Drone, additional lighting, props…"
                className="input-luxury w-full rounded-lg px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8a8278] tracking-widest uppercase mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Tell us about your vision, venue, mood board ideas…"
                className="input-luxury w-full rounded-lg px-4 py-3 text-sm resize-none"
              />
            </div>

            {/* Booking confirmation info */}
            <div className="bg-[rgba(242,202,80,0.04)] border border-[rgba(242,202,80,0.1)] rounded-xl p-5">
              <p className="text-xs text-[#f2ca50] font-medium tracking-wider uppercase mb-3">What happens next?</p>
              <ul className="space-y-2">
                {[
                  "Our team reviews your request within 24 hours",
                  "We'll call or WhatsApp to confirm availability",
                  "Advance payment is discussed before confirming",
                  "Detailed shoot plan is shared before the session",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#5a5248]">
                    <span className="text-[#f2ca50] font-bold mt-0.5">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="text-[#ff5252] text-sm bg-[rgba(255,82,82,0.08)] border border-[rgba(255,82,82,0.2)] rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep("type")} className="btn-ghost px-6 py-3.5 rounded-xl text-sm font-semibold">
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-3.5 rounded-xl text-sm font-semibold tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Submitting…" : "Submit Booking Request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
