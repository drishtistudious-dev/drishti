import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, PhoneCall, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [leadsCount, customersCount, bookingsCount] = await Promise.all([
    prisma.lead.count(),
    prisma.customer.count(),
    prisma.booking.count(),
  ]);

  return (
    <div className="max-w-[120rem] mx-auto p-4 sm:p-6 lg:p-8 2xl:p-12">
      <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-display text-white mb-6 sm:mb-8 2xl:mb-12">Studio Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 2xl:gap-10 mb-8 sm:mb-12 2xl:mb-16">
        {/* Leads Card */}
        <Link href="/dashboard/leads" className="bg-[#1a1a1a] border border-[#333] p-5 sm:p-6 2xl:p-10 rounded-xl sm:rounded-2xl hover:border-[#d4af37] transition-colors group">
          <div className="flex items-center gap-4 2xl:gap-6 mb-4 2xl:mb-6">
            <div className="w-12 h-12 2xl:w-16 2xl:h-16 bg-blue-900/20 text-blue-400 rounded-full flex items-center justify-center group-hover:bg-blue-900/40 transition-colors">
              <PhoneCall size={24} className="2xl:w-8 2xl:h-8" />
            </div>
            <div>
              <p className="text-xs sm:text-sm 2xl:text-lg text-gray-400 uppercase tracking-wider">Total Leads</p>
              <h2 className="text-2xl sm:text-3xl 2xl:text-5xl font-bold text-white">{leadsCount}</h2>
            </div>
          </div>
        </Link>

        {/* Customers Card */}
        <Link href="/dashboard/customers" className="bg-[#1a1a1a] border border-[#333] p-5 sm:p-6 2xl:p-10 rounded-xl sm:rounded-2xl hover:border-[#d4af37] transition-colors group">
          <div className="flex items-center gap-4 2xl:gap-6 mb-4 2xl:mb-6">
            <div className="w-12 h-12 2xl:w-16 2xl:h-16 bg-green-900/20 text-green-400 rounded-full flex items-center justify-center group-hover:bg-green-900/40 transition-colors">
              <Users size={24} className="2xl:w-8 2xl:h-8" />
            </div>
            <div>
              <p className="text-xs sm:text-sm 2xl:text-lg text-gray-400 uppercase tracking-wider">Customers</p>
              <h2 className="text-2xl sm:text-3xl 2xl:text-5xl font-bold text-white">{customersCount}</h2>
            </div>
          </div>
        </Link>

        {/* Bookings Card */}
        <Link href="/dashboard/bookings" className="bg-[#1a1a1a] border border-[#333] p-5 sm:p-6 2xl:p-10 rounded-xl sm:rounded-2xl hover:border-[#d4af37] transition-colors group sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4 2xl:gap-6 mb-4 2xl:mb-6">
            <div className="w-12 h-12 2xl:w-16 2xl:h-16 bg-purple-900/20 text-purple-400 rounded-full flex items-center justify-center group-hover:bg-purple-900/40 transition-colors">
              <Calendar size={24} className="2xl:w-8 2xl:h-8" />
            </div>
            <div>
              <p className="text-xs sm:text-sm 2xl:text-lg text-gray-400 uppercase tracking-wider">Bookings</p>
              <h2 className="text-2xl sm:text-3xl 2xl:text-5xl font-bold text-white">{bookingsCount}</h2>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity or Quick Actions could go here */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl sm:rounded-2xl p-6 sm:p-8 2xl:p-16 text-center">
        <h2 className="text-lg sm:text-xl 2xl:text-3xl text-white mb-2 2xl:mb-4">Welcome to Drishti Studio Admin</h2>
        <p className="text-xs sm:text-sm 2xl:text-xl text-gray-400">Use the sidebar to manage your leads, customers, and shoot bookings.</p>
      </div>
    </div>
  );
}
