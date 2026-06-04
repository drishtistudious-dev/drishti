"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PhoneCall,
  Users,
  Calendar,
  Home,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: PhoneCall },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-[#333] bg-[#111] p-6">
      <h1 className="mb-8 font-display text-2xl text-[#d4af37]">Drishti Admin</h1>
      <nav className="flex flex-1 flex-col gap-2">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[#d4af37]/20 text-[#d4af37]"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
      >
        <Home size={16} />
        Back to site
      </Link>
    </aside>
  );
}
