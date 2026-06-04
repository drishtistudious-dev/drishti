"use client";

import { useState } from "react";
import { format } from "date-fns";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  status: string;
  createdAt: Date;
};

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
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
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Lead Name</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Contact</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Date Received</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Source</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-bold tracking-widest text-[#8a8278] uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a1a]">
          {leads.map(l => (
            <tr key={l.id} className="hover:bg-[#111]/50 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold text-[#e5e2e1]">{l.name}</td>
              <td className="px-6 py-4">
                <p className="text-xs text-[#e5e2e1]">{l.phone || "—"}</p>
                <p className="text-[10px] text-[#8a8278]">{l.email || "—"}</p>
              </td>
              <td className="px-6 py-4 text-sm text-[#8a8278]">{format(new Date(l.createdAt), "MMM d, yyyy")}</td>
              <td className="px-6 py-4 text-sm text-[#8a8278]">{l.source}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                  l.status === "Converted" ? "border-green-500/30 text-green-500 bg-green-500/10" : 
                  l.status === "Lost" ? "border-red-500/30 text-red-500 bg-red-500/10" : 
                  l.status === "Contacted" ? "border-blue-400/30 text-blue-400 bg-blue-400/10" : 
                  "border-[#f2ca50]/30 text-[#f2ca50] bg-[#f2ca50]/10"
                }`}>
                  {l.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <select 
                  className="bg-black border border-[#333] text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-[#f2ca50] disabled:opacity-50"
                  value={l.status}
                  disabled={updating === l.id}
                  onChange={(e) => handleStatusChange(l.id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-[#8a8278] text-sm">
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
