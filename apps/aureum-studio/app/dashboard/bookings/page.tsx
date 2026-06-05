import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { startDate: "asc" },
    include: { customer: true },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-white">Bookings</h1>
      <div className="overflow-hidden rounded-lg border border-[#333]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1a1a1a] text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Shoot date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No bookings scheduled.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-[#333]">
                  <td className="px-4 py-3 text-white">{booking.type}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {booking.customer?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {format(booking.startDate, "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#d4af37]/20 px-2 py-1 text-xs text-[#d4af37]">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
