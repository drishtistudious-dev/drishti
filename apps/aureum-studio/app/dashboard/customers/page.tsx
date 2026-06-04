import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-white">Customers</h1>
      <div className="overflow-hidden rounded-lg border border-[#333]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1a1a1a] text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-t border-[#333]">
                  <td className="px-4 py-3 text-white">{customer.name}</td>
                  <td className="px-4 py-3 text-gray-400">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {customer.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {customer._count.bookings}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {format(customer.createdAt, "MMM d, yyyy")}
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
