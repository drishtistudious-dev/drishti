import prisma from "@/lib/prisma";
import BookingsTable from "./BookingsTable";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true }
  });

  return (
    <div className="p-10 animate-fade-in">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display text-white mb-2">Bookings Management</h1>
          <p className="text-sm text-[#8a8278]">Manage all studio sessions and payments.</p>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <BookingsTable initialBookings={bookings} />
      </div>
    </div>
  );
}
