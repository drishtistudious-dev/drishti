"use client";

import { useState } from "react";
import { format } from "date-fns";

type BookingWithCustomer = {
  id: string;
  type: string;
  status: string;
  startDate: Date;
  totalAmount: number;
  advancePaid: number;
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
  }
};

export default function BookingsTable({ initialBookings }: { initialBookings: BookingWithCustomer[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (e) {
      console.error("Failed to update status", e);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1a1a1a] bg-[#111]">
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Client</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Shoot Type</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Date</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Amount</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a1a]">
          {bookings.map(b => (
            <tr key={b.id} className="hover:bg-[#111]/50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-[#e5e2e1]">{b.customer.name}</p>
                <p className="text-xs text-[#8a8278]">{b.customer.email || b.customer.phone}</p>
              </td>
              <td className="px-6 py-4 text-sm text-[#e5e2e1]">{b.type}</td>
              <td className="px-6 py-4 text-sm text-[#8a8278]">{format(new Date(b.startDate), "MMM d, yyyy")}</td>
              <td className="px-6 py-4">
                <p className="text-sm text-white">₹{b.totalAmount.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-[#f2ca50] uppercase tracking-wider">Paid: ₹{b.advancePaid.toLocaleString("en-IN")}</p>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                  b.status === "Completed" ? "border-green-500/30 text-green-500 bg-green-500/10" : 
                  b.status === "Confirmed" ? "border-blue-400/30 text-blue-400 bg-blue-400/10" : 
                  b.status === "Cancelled" ? "border-red-500/30 text-red-500 bg-red-500/10" : 
                  "border-[#f2ca50]/30 text-[#f2ca50] bg-[#f2ca50]/10"
                }`}>
                  {b.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <select 
                  className="bg-black border border-[#333] text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-[#f2ca50] disabled:opacity-50"
                  value={b.status}
                  disabled={updating === b.id}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-[#8a8278] text-sm">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
