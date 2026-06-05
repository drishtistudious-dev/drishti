"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function StudioTour() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [mouseMoved, setMouseMoved] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      phase: "Phase 01",
      title: "Styling Wardrobe",
      description:
        "A curated collection of outfits and accessories perfectly tailored for high-end fashion and commercial shoots.",
      feature: "Precision Tools",
      label: "CURATED WARDROBE RACK",
      image:
        "/studio-tour/tour-1.png",
    },
    {
      phase: "Phase 02",
      title: "Reception Gallery",
      description:
        "The first impression of Drishti Studios. A welcoming space that embodies our premium and creative identity.",
      feature: "The Entrance",
      label: "STUDIOS RECEPTION",
      image:
        "/studio-tour/tour-2.jpeg",
      stats: [
        { value: "Brand", label: "Identity" },
        { value: "Lounge", label: "Area" },
      ],
    },
    {
      phase: "Phase 03",
      title: "The Edit Suite",
      description:
        "Where raw footage transforms into cinematic gold. Equipped with state-of-the-art grading panels and high-end monitoring.",
      feature: "Collaboration Space",
      label: "POST-PRODUCTION WORKSPACE",
      image:
        "/studio-tour/tour-3.jpeg",
      icons: [
        { name: "coffee", label: "Artisanal" },
        { name: "wifi", label: "Giga-speed" },
        { name: "groups", label: "Incubate" },
      ],
    },
    {
      phase: "Phase 04",
      title: "Studio Kitchen Area",
      description:
        "Where first impressions meet cinematic ambition. Our reception gallery sets the stage for every masterpiece created within these walls.",
      feature: "The Experience",
      label: "STUDIO KITCHEN AREA",
      image:
        "/studio-tour/tour-4.jpeg",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseMoved(true);
      setCursorPos({ x: e.clientX, y: e.clientY });
      setFollowerPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const addCursorHoverListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, .nav-dot");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    const timer = setTimeout(addCursorHoverListeners, 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const height = window.innerHeight;
      const index = Math.round(scrollTop / height);
      setActiveSection(index);
    }
  };

  const scrollToSection = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
      setActiveSection(index);
    }
  };

  return (
    <div className={`relative h-screen w-screen bg-surface overflow-hidden font-sans ${mouseMoved ? "md:cursor-none" : ""}`}>
      {/* Custom Cursor */}
      {mouseMoved && (
        <>
          <div
            className="custom-cursor hidden md:block"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.5 : 1})`,
            }}
          />
          <div
            className="cursor-follower hidden md:block"
            style={{
              left: `${followerPos.x}px`,
              top: `${followerPos.y}px`,
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.5 : 1})`,
              borderColor: isHovered ? "#f2ca50" : "rgba(242, 202, 80, 0.3)",
            }}
          />
        </>
      )}

      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20">
        <Link href="/" className="flex items-center gap-4 group">
          <img alt="Drishti Studios Logo" className="h-8 w-8 object-contain" src="/drishti_logo.png" />
          <span className="font-display text-2xl tracking-tighter text-primary uppercase">
            Drishti Studios
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="bg-primary hover:bg-primary-fixed text-on-primary px-8 py-3 font-label-md text-label-md transition-all duration-300 tracking-widest uppercase rounded-sm"
          >
            SKIP TO HOME
          </Link>
        </div>
      </nav>

      {/* Scroll Progress Indicator */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
        <div className="w-[2px] h-32 bg-outline-variant/30 relative">
          <div
            className="absolute top-0 left-0 w-full bg-primary transition-all duration-500 ease-out"
            style={{ height: `${((activeSection + 1) / sections.length) * 100}%` }}
          />
        </div>
        <div className="flex flex-col gap-3">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              className={`nav-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeSection === i ? "bg-primary scale-125" : "bg-outline-variant/50 hover:bg-primary/50"
              }`}
              aria-label={`Go to section ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stacking Cards Scroll Content */}
      <main
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen w-full overflow-y-auto overflow-x-hidden relative scroll-smooth scrollbar-hide bg-background"
      >
        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pb-[10vh]">
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="sticky w-full h-screen flex flex-col justify-center items-center transition-all duration-700"
              style={{
                top: `${idx * 1.5}rem`,
                zIndex: idx,
              }}
            >
              <div 
                className="w-full h-[85vh] bg-surface rounded-[2rem] border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row relative"
              >
                {/* Background glow or subtle texture */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-background to-background pointer-events-none" />

                {/* Left: Gallery Framed Image */}
                <div className="relative z-10 w-full h-[35%] sm:h-[40%] md:h-full md:w-[55%] flex items-center justify-center p-4 md:p-12 lg:p-16">
                  <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="relative z-10 w-full h-[65%] sm:h-[60%] md:h-full md:w-[45%] flex flex-col justify-start md:justify-center px-5 py-5 sm:px-8 sm:py-6 md:px-12 md:py-8 overflow-y-auto scrollbar-hide">
                  <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-6">
                    <span className="font-label-md text-[10px] md:text-sm text-primary tracking-widest uppercase">
                      {section.phase}
                    </span>
                    <div className="h-px bg-primary/40 flex-1 max-w-[50px]" />
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-on-surface mb-2 md:mb-4 leading-tight">
                    {section.title}
                  </h2>
                  
                  <p className="font-body text-on-surface/70 text-[11px] sm:text-xs md:text-base mb-4 md:mb-8 max-w-md leading-relaxed">
                    {section.description}
                  </p>

                  <div className="mt-2 md:mt-auto md:space-y-6 space-y-4">
                    <div>
                      <span className="font-label-sm text-[8px] md:text-xs text-primary mb-1 block tracking-widest uppercase">
                        {section.feature}
                      </span>
                      <p className="font-display text-lg md:text-xl text-on-surface">
                        {section.label}
                      </p>
                    </div>

                    {section.stats && (
                      <div className="flex gap-4 md:gap-8 pt-3 md:pt-4 border-t border-white/10">
                        {section.stats.map((stat, i) => (
                          <div key={i}>
                            <p className="font-display text-lg md:text-2xl text-primary mb-0.5 md:mb-1">
                              {stat.value}
                            </p>
                            <p className="font-label-sm text-[8px] md:text-[10px] text-on-surface/50 tracking-wider uppercase">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {section.icons && (
                      <div className="flex gap-3 md:gap-6 pt-3 md:pt-4 border-t border-white/10 flex-wrap">
                        {section.icons.map((icon, i) => (
                          <div key={i} className="flex items-center gap-2 md:gap-3">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-primary/20 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[12px] md:text-[16px]">{icon.name}</span>
                            </div>
                            <span className="font-label-sm text-[8px] md:text-[10px] text-on-surface/50 tracking-wider uppercase">
                              {icon.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Quick Footnote Indicators */}
      <div className="absolute bottom-6 left-6 text-[9px] font-label-md text-outline-variant tracking-widest hidden md:block">
        DRISHTI STUDIOS © {new Date().getFullYear()}
      </div>
      <div className="absolute bottom-6 right-6 text-[9px] font-label-md text-outline-variant tracking-widest hidden md:block">
        ESTABLISHED IN EXCELLENCE
      </div>
    </div>
  );
}
