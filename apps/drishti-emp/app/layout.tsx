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
  LogOut
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

  if (pathname === "/login") {
    return (
      <html lang="en">
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
    <html lang="en">
      <head>
        <title>Drishti Crew Portal</title>
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased flex h-screen overflow-hidden bg-[#f4f2ee] text-[#1a1a1a] selection:bg-[#d4af37] selection:text-white`}>
        
        {/* Sidebar Navigation - Clean, Light UI */}
        <aside 
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
          className={`${isCollapsed ? 'w-24' : 'w-72'} transition-all duration-500 ease-in-out m-4 rounded-[2rem] border border-[#e5e0d8] bg-white flex flex-col h-[calc(100vh-32px)] shrink-0 relative overflow-visible shadow-[0_8px_30px_rgba(0,0,0,0.04)] z-50`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="p-8 pb-4 flex flex-col items-center justify-center border-b border-[#f4f2ee] relative z-10 min-h-[140px]">
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
              <h1 className={`font-display text-lg font-light tracking-widest text-[#d4af37] uppercase leading-none transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-24'}`}>
                Drishti<span className="font-bold text-[#1a1a1a] block text-[9px] tracking-[0.3em] mt-1">Studios</span>
              </h1>
            </div>
            {!isCollapsed && (
              <div className="bg-[#d4af37]/10 text-[#d4af37] px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.3em] uppercase border border-[#d4af37]/20 animate-fade-in mt-2">
                Crew Portal
              </div>
            )}
          </div>
          
          <nav className="flex-1 py-8 flex flex-col gap-3 px-6 relative z-10">
            {[
              { href: "/", label: "Dashboard", icon: LayoutDashboard },
              { href: "/schedule", label: "My Schedule", icon: CalendarCheck },
              { href: "/announcements", label: "Updates", icon: ClipboardList },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                <div className="absolute inset-0 bg-[#f4f2ee] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                
                <link.icon size={18} className="text-[#8a8278] group-hover:text-[#d4af37] transition-colors relative z-10" />
                <span className={`text-sm text-[#5c5955] group-hover:text-[#1a1a1a] font-medium transition-all duration-500 whitespace-nowrap overflow-hidden relative z-10 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>{link.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-6 border-t border-[#f4f2ee] relative z-10">
            <button onClick={handleSignOut} className="group flex items-center gap-4 px-4 py-3 w-full rounded-2xl transition-all duration-300 hover:bg-red-50 border border-transparent hover:border-red-100">
              <LogOut size={18} className="text-[#8a8278] group-hover:text-red-500 transition-colors" />
              <span className={`text-sm text-[#5c5955] group-hover:text-red-500 font-medium transition-all duration-500 whitespace-nowrap overflow-hidden relative z-10 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area - The "Frame" */}
        <main className="flex-1 h-[calc(100vh-32px)] my-4 mr-4 rounded-[2rem] bg-white border border-[#e5e0d8] shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-y-auto">
          {/* Subtle light background grid pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}
