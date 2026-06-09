"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarDays,
  FolderKanban,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("erp_user");
    if (!stored) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const navLinks = (() => {
    if (user?.role === "Admin") {
      return [
        { href: "/portal", label: "DASHBOARD", icon: LayoutDashboard },
        { href: "/portal/bookings", label: "ALL BOOKINGS", icon: CalendarDays },
        { href: "/portal/staff", label: "STAFF/CREW", icon: Settings },
        { href: "/portal/profile", label: "SETTINGS", icon: Settings },
      ];
    }
    if (user?.role === "Crew") {
      return [
        { href: "/portal", label: "DASHBOARD", icon: LayoutDashboard },
        { href: "/portal/bookings", label: "MY SCHEDULE", icon: CalendarDays },
        { href: "/portal/profile", label: "SETTINGS", icon: Settings },
      ];
    }
    return [
      { href: "/portal", label: "DASHBOARD", icon: LayoutDashboard },
      { href: "/portal/bookings", label: "BOOKINGS", icon: CalendarDays },
      { href: "/portal/bookings/new", label: "PROJECTS", icon: FolderKanban },
      { href: "/portal/invoices", label: "INVOICES", icon: FileText },
      { href: "/portal/profile", label: "SETTINGS", icon: Settings },
    ];
  })();

  const handleLogout = () => {
    localStorage.removeItem("erp_user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex flex-col w-[80px] hover:w-[260px] transition-all duration-300 ease-in-out flex-shrink-0 bg-[#0d0d0d] border-r border-[rgba(242,202,80,0.08)] group relative z-20 overflow-hidden">
        {/* Logo */}
        <div className="p-5 group-hover:px-6 group-hover:py-7 pb-8 flex items-center justify-center group-hover:justify-start transition-all duration-300">
          <Link href="/portal" className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] group-hover:w-[48px] group-hover:h-[48px] flex-shrink-0 transition-all duration-300 overflow-hidden flex items-center justify-center">
              <Image
                src="/drishti_logo.png"
                alt="Drishti Studios Logo"
                width={48}
                height={48}
                className="object-contain w-full h-full filter drop-shadow-[0_0_15px_rgba(242,202,80,0.1)]"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto transition-all duration-300 overflow-hidden whitespace-nowrap">
              <span className="text-[14px] font-display font-bold tracking-[0.2em] text-[#f2ca50] leading-tight">DRISHTI</span>
              <span className="text-[9px] font-sans font-semibold tracking-[0.3em] text-[#8a8278] leading-none uppercase">Studios</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 flex flex-col gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/portal" && pathname.startsWith(href));
            const isExactDashboard = href === "/portal" && pathname === "/portal";
            const active = isExactDashboard || (href !== "/portal" && isActive);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[11px] font-semibold tracking-[0.15em] transition-all duration-200 ${
                  active
                    ? "text-[#f2ca50] bg-[rgba(242,202,80,0.06)] border-l-2 border-[#f2ca50] -ml-px"
                    : "text-[#6a6258] hover:text-[#d0c5af] hover:bg-[rgba(255,255,255,0.02)] border-l-2 border-transparent -ml-px"
                }`}
                title={label}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.5} className="flex-shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info + Sign Out */}
        <div className="p-4 border-t border-[rgba(242,202,80,0.06)]">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-[rgba(242,202,80,0.12)] border border-[rgba(242,202,80,0.2)] flex items-center justify-center text-[#f2ca50] font-bold text-xs transition-all duration-300">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              <p className="text-xs font-semibold text-[#e5e2e1] truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#f2ca50] tracking-wider font-bold truncate leading-tight uppercase">{user.role || "Client"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-2.5 rounded-lg text-[11px] font-semibold tracking-[0.12em] text-[#4a4238] hover:text-[#ff5252] hover:bg-[rgba(255,82,82,0.05)] transition-all duration-200 overflow-hidden"
            title="SIGN OUT"
          >
            <LogOut size={16} className="flex-shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              SIGN OUT
            </span>
          </button>
        </div>
      </aside>

      {/* ─── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[220px] bg-[#0d0d0d] border-r border-[rgba(242,202,80,0.08)] flex flex-col z-10">
            <div className="p-5 pb-6">
              <div className="w-[100px] h-[100px] mb-8 mx-auto overflow-hidden">
                <Image src="/drishti_logo.png" alt="Drishti Studios" width={100} height={100} className="object-contain w-full h-full filter drop-shadow-[0_0_10px_rgba(242,202,80,0.1)]" priority unoptimized />
              </div>
            </div>
            <nav className="flex-1 px-3 flex flex-col gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-semibold tracking-[0.15em] transition-all ${
                      active ? "text-[#f2ca50] bg-[rgba(242,202,80,0.06)] border-l-2 border-[#f2ca50]" : "text-[#6a6258] hover:text-[#d0c5af]"
                    }`}
                  >
                    <Icon size={15} strokeWidth={active ? 2.2 : 1.5} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[rgba(242,202,80,0.06)]">
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className="w-8 h-8 rounded-lg bg-[rgba(242,202,80,0.12)] flex items-center justify-center text-[#f2ca50] font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#e5e2e1] truncate">{user.name}</p>
                  <p className="text-[10px] text-[#f2ca50] tracking-wider font-bold truncate uppercase">{user.role || "Client"}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg text-[11px] font-semibold tracking-[0.12em] text-[#4a4238] hover:text-[#ff5252] transition-all">
                <LogOut size={14} />
                SIGN OUT
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[rgba(242,202,80,0.08)] bg-[#0d0d0d]">
          <button onClick={() => setSidebarOpen(true)} className="text-[#f2ca50]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className="flex items-center gap-3">
            <Image src="/drishti_logo.png" alt="Logo" width={32} height={32} className="object-contain filter drop-shadow-[0_0_5px_rgba(242,202,80,0.1)]" unoptimized />
            <span className="font-display text-[#f2ca50] text-xl">Drishti Studios</span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-[rgba(242,202,80,0.12)] flex items-center justify-center text-[#f2ca50] text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}

          {/* Footer */}
          <footer className="px-8 py-6 border-t border-[rgba(242,202,80,0.06)] mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-[10px] text-[#3a3530] tracking-[0.15em] uppercase">
                © {new Date().getFullYear()} DRISHTI STUDIOS. ALL RIGHTS RESERVED.
              </p>
              <div className="flex gap-6">
                {["PRIVACY", "TERMS", "SUPPORT"].map(link => (
                  <a key={link} href="#" className="text-[10px] text-[#3a3530] tracking-[0.15em] uppercase hover:text-[#f2ca50] transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
