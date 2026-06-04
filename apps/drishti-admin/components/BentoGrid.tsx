"use client";

import { useEffect, useRef } from "react";
import { TrendingUp, Camera, AlertCircle, Users, ArrowUpRight } from "lucide-react";

interface Props {
  metrics: {
    totalRevenue: number;
    upcomingShoots: number;
    activeLeads: number;
    totalClients: number;
  }
}

export default function BentoGrid({ metrics }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll('.bento-card');
      for (const card of Array.from(cards)) {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 mb-12">
      
      {/* Main Revenue Card - Spans 2 cols & 2 rows */}
      <div className="bento-card group relative rounded-3xl bg-white/5 overflow-hidden md:col-span-2 md:row-span-2 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(242,202,80,0.15), transparent 40%)' }} />
        
        {/* Inner solid card to create border */}
        <div className="absolute inset-[1px] bg-[#050505] rounded-[calc(1.5rem-1px)] z-10" />
        <div className="absolute inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-[calc(1.5rem-1px)] pointer-events-none"
             style={{ background: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(242,202,80,0.05), transparent 40%)' }} />

        {/* Content */}
        <div className="relative z-20 p-8 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-[#f2ca50]/10 text-[#f2ca50]">
              <TrendingUp size={24} strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-1 text-[#f2ca50] text-xs font-bold bg-[#f2ca50]/10 px-3 py-1 rounded-full">
              +12.5% <ArrowUpRight size={14} />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8a8278] block mb-3">Total Revenue</span>
            <p className="text-6xl font-display text-white font-light tracking-tight">₹{metrics.totalRevenue.toLocaleString("en-IN")}</p>
            <p className="text-sm text-[#8a8278] mt-4 font-light">Across all completed and confirmed bookings this year.</p>
          </div>
          {/* Decorative graphic */}
          <div className="absolute bottom-0 right-0 w-64 h-32 bg-gradient-to-t from-[#f2ca50]/10 to-transparent blur-2xl rounded-tl-full opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
      </div>

      {/* Shoots Card */}
      <div className="bento-card group relative rounded-3xl bg-white/5 overflow-hidden md:col-span-1 md:row-span-1 shadow-xl">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 40%)' }} />
        <div className="absolute inset-[1px] bg-[#050505] rounded-[calc(1.5rem-1px)] z-10" />
        <div className="absolute inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-[calc(1.5rem-1px)] pointer-events-none"
             style={{ background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.03), transparent 40%)' }} />
        
        <div className="relative z-20 p-6 h-full flex flex-col justify-between">
          <div className="p-2.5 rounded-xl bg-white/5 text-[#8a8278] w-fit">
            <Camera size={18} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-3xl font-display text-white font-light">{metrics.upcomingShoots}</p>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#8a8278] block mt-1">Upcoming Shoots</span>
          </div>
        </div>
      </div>

      {/* Leads Card */}
      <div className="bento-card group relative rounded-3xl bg-white/5 overflow-hidden md:col-span-1 md:row-span-1 shadow-xl">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 40%)' }} />
        <div className="absolute inset-[1px] bg-[#050505] rounded-[calc(1.5rem-1px)] z-10" />
        <div className="absolute inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-[calc(1.5rem-1px)] pointer-events-none"
             style={{ background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.03), transparent 40%)' }} />
        
        <div className="relative z-20 p-6 h-full flex flex-col justify-between">
          <div className="p-2.5 rounded-xl bg-white/5 text-[#8a8278] w-fit">
            <AlertCircle size={18} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-3xl font-display text-white font-light">{metrics.activeLeads}</p>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#8a8278] block mt-1">Active Leads</span>
          </div>
        </div>
      </div>

      {/* Clients Card - Spans 2 cols */}
      <div className="bento-card group relative rounded-3xl bg-white/5 overflow-hidden md:col-span-2 md:row-span-1 shadow-xl flex items-center">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 40%)' }} />
        <div className="absolute inset-[1px] bg-[#050505] rounded-[calc(1.5rem-1px)] z-10" />
        <div className="absolute inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-[calc(1.5rem-1px)] pointer-events-none"
             style={{ background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.03), transparent 40%)' }} />
        
        <div className="relative z-20 p-8 w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-white/5 text-[#8a8278]">
                <Users size={16} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8a8278]">Total Clients</span>
            </div>
            <p className="text-sm text-[#8a8278] font-light max-w-xs">Your growing network of happy customers.</p>
          </div>
          <p className="text-5xl font-display text-white font-light">{metrics.totalClients}</p>
        </div>
      </div>

    </div>
  );
}
