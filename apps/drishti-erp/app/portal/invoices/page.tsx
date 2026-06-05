"use client";
import { useEffect, useState } from "react";
import { Camera, FileText, Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  advancePaid: number;
}

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  Pending: { label: "Pending", class: "badge-pending", icon: Clock },
  Confirmed: { label: "Confirmed", class: "badge-confirmed", icon: CheckCircle },
  Completed: { label: "Completed", class: "badge-completed", icon: CheckCircle },
  Cancelled: { label: "Cancelled", class: "badge-cancelled", icon: AlertCircle },
};

export default function InvoicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (!stored) return;
    const user = JSON.parse(stored);
    fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(d => setBookings(d.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  const invoiceBookings = bookings.filter(b => b.totalAmount > 0);
  const totalSpent = bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  const totalDue = bookings.reduce((sum, b) => sum + (b.totalAmount - b.advancePaid), 0);

  const handlePrint = (booking: Booking) => {
    const stored = localStorage.getItem("erp_user");
    const user = stored ? JSON.parse(stored) : {};
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${booking.type}</title>
        <style>
          body { font-family: 'Georgia', serif; background: #fff; color: #111; padding: 40px; max-width: 600px; margin: 0 auto; }
          .header { border-bottom: 2px solid #d4af37; padding-bottom: 24px; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; color: #d4af37; }
          .sub { color: #666; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
          .label { color: #666; font-size: 13px; }
          .value { font-weight: bold; }
          .total { background: #f9f4e8; padding: 16px; border-radius: 8px; margin-top: 24px; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 11px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; background: #f0f4ff; color: #3366cc; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Drishti Studios</div>
          <div class="sub">Premium Creative Studio · Doddaballapura, Karnataka</div>
        </div>
        <h2 style="color:#d4af37; margin-bottom: 4px;">Invoice</h2>
        <p style="color:#666;font-size:12px;margin-bottom:24px;">Ref: ${booking.id.slice(-8).toUpperCase()}</p>
        <div class="row"><span class="label">Client Name</span><span class="value">${user.name || "—"}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${user.email || "—"}</span></div>
        <div class="row"><span class="label">Service</span><span class="value">${booking.type}</span></div>
        <div class="row"><span class="label">Date</span><span class="value">${format(new Date(booking.startDate), "MMM d, yyyy")} – ${format(new Date(booking.endDate), "MMM d, yyyy")}</span></div>
        <div class="row"><span class="label">Status</span><span class="status">${booking.status}</span></div>
        <div class="total">
          <div class="row" style="border:none; padding:6px 0;"><span class="label">Total Amount</span><span class="value">₹${booking.totalAmount.toLocaleString()}</span></div>
          <div class="row" style="border:none; padding:6px 0;"><span class="label">Advance Paid</span><span class="value" style="color:#27ae60;">₹${booking.advancePaid.toLocaleString()}</span></div>
          <div class="row" style="border:none; padding:6px 0; font-size:16px;"><span class="label"><strong>Balance Due</strong></span><span class="value" style="color:#d4af37;">₹${(booking.totalAmount - booking.advancePaid).toLocaleString()}</span></div>
        </div>
        <div class="footer">
          <p>Thank you for choosing Drishti Studios.</p>
          <p>drishtistudious@gmail.com · +91 84605 49557</p>
          <p>Generated on ${format(new Date(), "MMM d, yyyy")}</p>
        </div>
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12">
      <div className="mb-8 animate-fade-in">
        <p className="text-xs text-[#f2ca50] tracking-widest uppercase mb-1">Payments</p>
        <h1 className="font-display text-4xl text-[#e5e2e1] font-bold">Invoices</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-in-delay">
        {[
          { label: "Total Invoices", value: invoiceBookings.length, color: "#f2ca50" },
          { label: "Total Paid", value: `₹${totalSpent.toLocaleString()}`, color: "#4caf82" },
          { label: "Balance Due", value: `₹${Math.max(0, totalDue).toLocaleString()}`, color: "#6495ed" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-6">
            <p className="text-xs text-[#5a5248] tracking-widest uppercase mb-2">{label}</p>
            <p className="font-display text-3xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Invoice list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="glass-card rounded-xl h-24 loading-shimmer" />)}
        </div>
      ) : invoiceBookings.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center animate-fade-in">
          <FileText size={40} className="text-[#2a2a2a] mx-auto mb-4" />
          <p className="text-[#5a5248] text-sm">No invoices yet. Invoices appear after your bookings are confirmed.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-delay">
          {invoiceBookings.map((b) => {
            const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG["Pending"];
            const Icon = cfg.icon;
            const balance = b.totalAmount - b.advancePaid;
            return (
              <div key={b.id} className="glass-card rounded-xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[rgba(242,202,80,0.1)] flex items-center justify-center flex-shrink-0">
                  <Camera size={18} className="text-[#f2ca50]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#e5e2e1]">{b.type}</p>
                    <span className={`${cfg.class} flex items-center gap-1 px-2 py-0.5 rounded-full text-xs`}>
                      <Icon size={9} />
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a5248]">
                    {format(new Date(b.startDate), "MMM d")} – {format(new Date(b.endDate), "MMM d, yyyy")} · Ref: {b.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-[#e5e2e1]">₹{b.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-[#4caf82]">Paid: ₹{b.advancePaid.toLocaleString()}</p>
                  {balance > 0 && <p className="text-xs text-[#f2ca50]">Due: ₹{balance.toLocaleString()}</p>}
                </div>
                <button
                  onClick={() => handlePrint(b)}
                  className="btn-ghost px-4 py-2 rounded-lg text-xs flex items-center gap-2 flex-shrink-0"
                >
                  <Download size={14} />
                  Print
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[#3a3530] text-xs text-center mt-12">
        For billing queries, contact us at{" "}
        <a href="mailto:drishtistudious@gmail.com" className="text-[#f2ca50] hover:underline">drishtistudious@gmail.com</a>
      </p>
    </div>
  );
}
