"use client";

import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  ClipboardList, 
  LogOut,
  Settings,
  Menu,
  X
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname === "/login") {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>Drishti Crew Portal | Login</title>
          <link rel="icon" href="/drishti_logo.png" />
        </head>
        <body className={`${inter.variable} ${outfit.variable} antialiased bg-[#fdfcf9]`}>
          {children}
        </body>
      </html>
    );
  }

  const handleSignOut = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Drishti Crew Portal</title>
        <link rel="icon" href="/drishti_logo.png" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased flex flex-col md:flex-row h-screen overflow-hidden bg-[#0a0a0a] text-[#e5e2e1] selection:bg-[#f2ca50] selection:text-black`}>
        
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 bg-[#0d0d0d] border-b border-white/5 relative z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image 
                src="/drishti_logo.png" 
                alt="Drishti Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-display text-base font-light tracking-widest text-[#f2ca50] uppercase leading-none">
              Drishti<span className="font-bold text-white block text-[9px] tracking-[0.3em] mt-0.5">Studios</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-[#8a8278] hover:text-[#f2ca50] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        
        {/* Mobile Navigation Drawer */}
        <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0d0d0d] border-r border-white/5 z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image 
                  src="/drishti_logo.png" 
                  alt="Drishti Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="font-display text-base font-light tracking-widest text-[#f2ca50] uppercase leading-none">
                Drishti<span className="font-bold text-white block text-[9px] tracking-[0.3em] mt-0.5">Studios</span>
              </h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 text-[#8a8278] hover:text-[#f2ca50] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
            {[
              { href: "/", label: "Dashboard", icon: LayoutDashboard },
              { href: "/schedule", label: "My Schedule", icon: CalendarCheck },
              { href: "/announcements", label: "Updates", icon: ClipboardList },
              { href: "/settings", label: "Settings", icon: Settings },
            ].map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl overflow-hidden transition-all duration-300 ${pathname === link.href ? 'bg-[#f2ca50]/10 border border-[#f2ca50]/20' : 'hover:bg-white/5'}`}
              >
                <link.icon size={18} className={pathname === link.href ? "text-[#f2ca50]" : "text-[#8a8278] group-hover:text-[#f2ca50] transition-colors"} />
                <span className={`text-sm font-medium ${pathname === link.href ? "text-white" : "text-white/70 group-hover:text-white transition-colors"}`}>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="group flex items-center gap-4 px-4 py-3 w-full rounded-xl transition-all duration-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
              <LogOut size={18} className="text-[#8a8278] group-hover:text-red-400 transition-colors" />
              <span className="text-sm text-white/70 group-hover:text-red-400 font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Sidebar Navigation - Dark UI (Desktop) */}
        <aside 
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
          className={`${isCollapsed ? 'w-24' : 'w-72'} transition-all duration-500 ease-in-out m-4 rounded-[2rem] border border-white/5 bg-[#0d0d0d] hidden md:flex flex-col h-[calc(100vh-32px)] shrink-0 relative overflow-visible z-50`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="p-8 pb-4 flex flex-col items-center justify-center border-b border-white/5 relative z-10 min-h-[140px]">
            <div className="flex items-center gap-3 mb-2 w-full justify-center">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image 
                  src="/drishti_logo.png" 
                  alt="Drishti Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className={`font-display text-lg font-light tracking-widest text-[#f2ca50] uppercase leading-none transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-24'}`}>
                Drishti<span className="font-bold text-white block text-[9px] tracking-[0.3em] mt-1">Studios</span>
              </h1>
            </div>
            {!isCollapsed && (
              <div className="bg-[#f2ca50]/10 text-[#f2ca50] px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.3em] uppercase border border-[#f2ca50]/20 animate-fade-in mt-2">
                Crew Portal
              </div>
            )}
          </div>
          
          <nav className="flex-1 py-8 flex flex-col gap-3 px-6 relative z-10">
            {[
              { href: "/", label: "Dashboard", icon: LayoutDashboard },
              { href: "/schedule", label: "My Schedule", icon: CalendarCheck },
              { href: "/announcements", label: "Updates", icon: ClipboardList },
              { href: "/settings", label: "Settings", icon: Settings },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2ca50]/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                
                <link.icon size={18} className="text-[#8a8278] group-hover:text-[#f2ca50] transition-colors relative z-10 pointer-events-none" />
                <span className={`text-sm text-white/70 group-hover:text-white font-medium transition-all duration-500 whitespace-nowrap overflow-hidden relative z-10 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'} inline-block pointer-events-none`}>{link.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-6 border-t border-white/5 relative z-10">
            <button onClick={handleSignOut} className="group flex items-center gap-4 px-4 py-3 w-full rounded-2xl transition-all duration-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
              <LogOut size={18} className="text-[#8a8278] group-hover:text-red-400 transition-colors pointer-events-none" />
              <span className={`text-sm text-white/70 group-hover:text-red-400 font-medium transition-all duration-500 whitespace-nowrap overflow-hidden relative z-10 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'} inline-block pointer-events-none`}>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area - The "Frame" */}
        <main className="flex-1 h-full md:h-[calc(100vh-32px)] md:my-4 md:mr-4 md:rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-y-auto">
          {/* Subtle light background grid pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}
