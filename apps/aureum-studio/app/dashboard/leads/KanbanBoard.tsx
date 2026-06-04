"use client";

import { useTransition } from "react";
import { updateLeadStatus, type LeadStatus } from "./actions";

type Lead = {
  id: string;
  name: string;
  email: string;
  status: string;
  notes: string | null;
  createdAt: Date;
};

const columns: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Booked",
  "Lost",
];

export default function KanbanBoard({ leads }: { leads: Lead[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
      {columns.map((status) => (
        <div
          key={status}
          className="rounded-lg border border-[#333] bg-[#141414] p-4"
        >
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
            {status}
          </h3>
          <ul className="space-y-3">
            {leads
              .filter((lead) => lead.status === status)
              .map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-md border border-[#333] bg-[#1a1a1a] p-3"
                >
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                  {lead.notes && (
                    <p className="mt-2 line-clamp-3 text-xs text-gray-400 whitespace-pre-wrap">
                      {lead.notes}
                    </p>
                  )}
                  <select
                    className="mt-3 w-full rounded border border-[#444] bg-[#0a0a0a] px-2 py-1 text-xs text-white"
                    value={lead.status}
                    disabled={pending}
                    onChange={(e) => {
                      startTransition(() =>
                        updateLeadStatus(lead.id, e.target.value as LeadStatus),
                      );
                    }}
                  >
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
