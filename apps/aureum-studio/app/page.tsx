"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, ArrowRight, Camera, Video, Settings2, Sparkles as SparklesIcon, ChevronRight, MapPin, Mail, Phone } from "lucide-react";

const justdialReviews = [
  {
    name: "Rahul Subramanian",
    initial: "R",
    role: "Verified Customer",
    text: "We had a wonderful experience and would happily book again. The team was supportive and professional throughout the shoot. The pictures were clear and beautifully edited. Every memory was captured perfectly."
  },
  {
    name: "Yamini Reddy",
    initial: "Y",
    role: "Wedding Client",
    text: "We hired them for a wedding celebration and the results were amazing. Every important memory was captured beautifully. The candid shots especially stood out for us."
  },
  {
    name: "Sushmitha Naidu",
    initial: "S",
    role: "Maternity & Newborn",
    text: "We chose them for a newborn shoot and could not be happier. They handled everything with care and patience. The pictures turned out adorable and beautiful."
  },
  {
    name: "Pranav Naidu",
    initial: "P",
    role: "Portrait Client",
    text: "Loved the natural feel in the pictures. They captured expressions and emotions very beautifully without making anything look artificial."
  },
  {
    name: "Vikas",
    initial: "V",
    role: "Event Client",
    text: "The whole session felt fun instead of tiring. They kept the atmosphere light and comfortable which made a big difference."
  },
  {
    name: "Anita",
    initial: "A",
    role: "Family Shoot",
    text: "The family shoot was such a lovely experience. Everyone felt comfortable and the pictures came out better than expected."
  }
];

export default function Home() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mouseMoved, setMouseMoved] = useState(false);

  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseMoved) setMouseMoved(true);
      setCursorPos({ x: e.clientX, y: e.clientY });
      setFollowerPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for scroll animations (Progressive Enhancement)
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".scroll-animate");
    animatedElements.forEach((el) => {
      // Hide dynamically upon client mount so that they fade in on scroll.
      // If JS doesn't run, they remain fully visible (preventing blank spaces).
      el.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-1000");
      observer.observe(el);
    });

    const addCursorHoverListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, .group, input, textarea");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    const timer = setTimeout(addCursorHoverListeners, 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [mouseMoved]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const scrollTestimonials = (direction: "left" | "right") => {
    if (testimonialsRef.current) {
      const scrollAmount = 400;
      testimonialsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className={`relative min-h-screen bg-surface selection:bg-primary/30 selection:text-white overflow-hidden font-sans ${mouseMoved ? "md:cursor-none" : ""}`}>
      {/* SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Drishti Studios",
            image: "https://drishtistudios.in/drishti_logo.png",
            "@id": "https://drishtistudios.in",
            url: "https://drishtistudios.in",
            telephone: "",
            priceRange: "$$$",
            address: {
              "@type": "PostalAddress",
              addressLocality: "India",
              addressCountry: "IN"
            },
            description: "Premium luxury creative studio specializing in cinematography, photography, post production, and art direction."
          })
        }}
      />
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

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
          scrolled
            ? "bg-surface-container-lowest/80 backdrop-blur-xl border-outline-variant/10 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="flex justify-between items-center px-4 md:px-margin-desktop max-w-container mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 md:gap-4">
            <img alt="Drishti Studios Logo" className="h-6 w-6 md:h-8 md:w-8 object-contain" src="/drishti_logo.png" />
            <span className="font-display text-lg md:text-3xl tracking-tighter text-primary">
              DRISHTI STUDIOS
            </span>
          </div>

          <div className="hidden md:flex gap-10 items-center">
            <Link href="/" className="font-label-md text-label-md text-primary border-b border-primary pb-1">
              HOME
            </Link>
            <Link
              href="/studio-tour"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              STUDIO
            </Link>
            <a
              href="#portfolio"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              DESIGN
            </a>
            <a
              href="#portfolio"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              WORKS
            </a>
            <a
              href="#contact"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              CONTACT
            </a>
            <a
              href="https://client.drishtistudios.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              BOOKINGS
            </a>
          </div>

          <div className="flex items-center gap-3 md:gap-0">
            <a
              href="https://client.drishtistudios.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#d4af37] text-black px-4 py-2 md:px-6 md:py-2.5 font-label-md text-[9px] md:text-label-md tracking-widest hover:bg-white transition-all duration-300 font-bold uppercase"
            >
              BOOK NOW
            </a>
            

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('/hero.png')`,
            transform: `translateY(${scrollY * 0.4}px) scale(1.05)`,
          }}
        />
        <div className="absolute inset-0 hero-vignette bg-black/65" />
        <div className="relative text-center z-10 px-6 md:px-margin-mobile w-full flex flex-col items-center mt-12 md:mt-0">
          <p className="font-label-md text-[10px] md:text-label-md text-primary tracking-[0.6em] md:tracking-[0.6em] mb-4 md:mb-6 animate-fade-in-up uppercase">
            EST MMXXVI
          </p>
          <h1 className="font-display text-5xl md:text-8xl text-primary leading-[1.1] mb-6 md:mb-8 animate-fade-in-up tracking-tight">
            The Art of <br className="block md:hidden" />
            <span className="italic font-light text-white drop-shadow-[0_2px_10px_rgba(242,202,80,0.15)] text-[3.5rem] md:text-8xl leading-none">Observation</span>
          </h1>
          <p className="max-w-xl mx-auto text-on-surface-variant font-sans text-sm md:text-lg mb-8 md:mb-10 animate-fade-in-up opacity-90 leading-relaxed px-2">
            A premium luxury creative studio crafting cinematic visual legacies and high-end artistic photography.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 animate-fade-in-up w-full max-w-[280px] sm:max-w-none mx-auto">
            <a
              href="#portfolio"
              className="bg-[#e2c151] text-black w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 font-label-md text-[10px] md:text-label-md tracking-[0.2em] font-semibold uppercase rounded-sm border border-[#e2c151]"
            >
              EXPLORE WORKS
            </a>
            <Link
              href="/studio-tour"
              className="bg-transparent text-[#e2c151] w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 font-label-md text-[10px] md:text-label-md tracking-[0.2em] uppercase rounded-sm border border-[#e2c151] hover:bg-[#e2c151]/10 transition-colors"
            >
              IMMERSE TOUR
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-pulse">
          <div className="w-[1px] h-8 md:h-12 bg-[#e2c151]/60"></div>
          <span className="font-label-md text-[9px] md:text-[10px] text-on-surface-variant tracking-widest uppercase">SCROLL</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#e2c151] mt-1"></div>
        </div>
      </header>

      {/* About Section */}
      <section
        id="about"
        className="py-24 bg-surface-container-low max-w-container mx-auto px-margin-mobile md:px-margin-desktop scroll-animate transition-all"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5 flex flex-col justify-center mb-12 md:mb-0 relative">
            <div className="absolute left-[-200px] top-1/4 ambient-glow animate-float-slow" />
            <span className="font-label-md text-label-md text-primary tracking-widest block mb-4">THE PHILOSOPHY</span>
            <h2 className="font-display text-4xl md:text-5xl text-on-surface mb-8 leading-tight">
              Believers in the <span className="italic font-light text-primary">Silent Narrative</span>
            </h2>
            <p className="font-sans text-body-md text-on-surface-variant mb-6 leading-relaxed">
              At Drishti Studios, we believe that the most powerful stories are told in the details. We do not merely capture light; we observe the quiet, unspoken emotions and architectures that define our world.
            </p>
            <p className="font-sans text-body-md text-on-surface-variant/80 mb-8 leading-relaxed">
              Through an exclusive editorial lens and award-winning cinematography, we elevate ordinary moments into timeless visual legacies.
            </p>
            <div>
              <a
                href="#portfolio"
                className="btn-luxury-secondary px-8 py-4 font-label-md text-label-md tracking-widest inline-block uppercase rounded-sm"
              >
                OUR CURATED PORTFOLIO
              </a>
            </div>
          </div>

          <div className="md:col-span-7 relative flex justify-center">
            <div className="relative group max-w-lg overflow-hidden rounded-sm glass-card p-4 light-leak-border">
              <img
                src="/studio-tour/tour-2.jpeg"
                alt="Drishti Creative Workspace"
                className="w-full h-[450px] object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8 right-8 bottom-8 border border-primary/20 pointer-events-none transition-all duration-500 group-hover:border-primary/50"></div>
              <div className="absolute bottom-8 right-8 bg-surface-container-lowest/90 backdrop-blur-md px-6 py-4 border border-outline-variant/30 text-right">
                <p className="font-display text-primary text-lg italic">Drishti Headquarters</p>
                <a
                  href="https://www.google.com/maps/place/Drishti+Studios/@13.3147506,77.5354911,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb1df928744481b:0xe5f241d3ba3f716b!8m2!3d13.3147506!4d77.538066!16s%2Fg%2F11z37tj891?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label-md text-[10px] text-on-surface-variant hover:text-primary transition-colors tracking-wider uppercase block"
                >
                  DODDABALLAPURA, KARNATAKA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section
        id="portfolio"
        className="py-16 md:py-24 max-w-container mx-auto px-4 md:px-margin-desktop scroll-animate transition-all"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16">
          <div>
            <span className="hidden md:block font-label-md text-label-md text-primary tracking-widest mb-4">SELECTED WORKS</span>
            <h2 className="font-display text-4xl md:text-5xl text-on-surface">
              Curated <span className="italic font-light text-[#d4af37]">Collections</span>
            </h2>
          </div>
          <p className="font-sans text-sm md:text-body-md text-on-surface-variant max-w-md text-left md:text-right mt-4 md:mt-0 leading-relaxed">
            A showcasing gallery emphasizing visual storytelling, architecture, luxury interiors, and artistic compositions.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-gutter">
          {/* Project 1 */}
          <div className="col-span-12 md:col-span-8 group relative overflow-hidden h-[250px] md:h-[500px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 1"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-1.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[8px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">FOOD PHOTOGRAPHY</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-xl md:text-3xl text-white">Raw Culinary Forms</h3>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="col-span-12 md:col-span-4 group relative overflow-hidden h-[250px] md:h-[500px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 2"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-2.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[8px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">CULINARY STYLING</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-xl md:text-2xl text-white">Rustic Preparations</h3>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="col-span-6 md:col-span-4 group relative overflow-hidden h-[300px] md:h-[400px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 3"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-3.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-4 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[7px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">PRE-WEDDING</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-lg md:text-2xl text-white">Timeless Bonds</h3>
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="col-span-6 md:col-span-8 group relative overflow-hidden h-[300px] md:h-[400px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 4"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-4.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-4 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[7px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">BABY PORTRAITURE</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-lg md:text-3xl text-white">Sweet Innocence</h3>
              </div>
            </div>
          </div>

          {/* Project 5 */}
          <div className="col-span-12 md:col-span-8 group relative overflow-hidden h-[250px] md:h-[500px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 5"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-5.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[8px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">FASHION</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-xl md:text-3xl text-white">Vogue Silhouettes</h3>
              </div>
            </div>
          </div>

          {/* Project 6 */}
          <div className="col-span-12 md:col-span-4 group relative overflow-hidden h-[250px] md:h-[500px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 6"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-6.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[8px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">PORTRAIT</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-xl md:text-2xl text-white">Golden Hour</h3>
              </div>
            </div>
          </div>

          {/* Project 7 */}
          <div className="col-span-6 md:col-span-4 group relative overflow-hidden h-[300px] md:h-[400px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 7"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-7.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-4 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[7px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">EDITORIAL</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-lg md:text-2xl text-white">The Monologue</h3>
              </div>
            </div>
          </div>

          {/* Project 8 */}
          <div className="col-span-6 md:col-span-8 group relative overflow-hidden h-[300px] md:h-[400px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 8"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-8.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-4 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[7px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">COMMERCIAL</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-lg md:text-3xl text-white">Symmetry in Motion</h3>
              </div>
            </div>
          </div>

          {/* Project 9 */}
          <div className="col-span-12 md:col-span-8 group relative overflow-hidden h-[250px] md:h-[500px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 9"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-9.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[8px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">WEDDING PORTRAITURE</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-xl md:text-3xl text-white">Bridal Radiance</h3>
              </div>
            </div>
          </div>

          {/* Project 10 */}
          <div className="col-span-12 md:col-span-4 group relative overflow-hidden h-[250px] md:h-[500px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 10"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-10.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[8px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">LUXURY WEDDING</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-xl md:text-2xl text-white">The Silent Glance</h3>
              </div>
            </div>
          </div>

          {/* Project 11 */}
          <div className="col-span-12 group relative overflow-hidden h-[300px] md:h-[500px] rounded-xl md:rounded-sm border border-[#d4af37]/30 md:border-none md:glass-card md:p-2 scroll-animate">
            <div className="w-full h-full overflow-hidden relative rounded-lg md:rounded-none">
              <img
                alt="Project 11"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/work-11.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 md:opacity-80" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 transition-transform duration-500 group-hover:-translate-y-2">
                <span className="font-label-md text-[8px] md:text-label-md text-[#d4af37] mb-1 md:mb-2 block tracking-widest uppercase">BRIDAL EDITORIAL</span>
                <div className="w-6 md:w-8 h-[1px] bg-[#d4af37] mb-2 md:mb-3"></div>
                <h3 className="font-display text-xl md:text-3xl text-white">Heritage & Grace</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-surface-container-lowest md:bg-surface-container-lowest bg-[#050505] py-16 md:py-24 border-t border-b border-outline-variant/10 relative overflow-hidden">
        <div className="max-w-container mx-auto px-4 md:px-margin-desktop relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter">
            
            {/* Header Area - Mobile Version */}
            <div className="col-span-12 md:hidden relative mb-4 scroll-animate">
              {/* Decorative Right Image on Mobile */}
              <div className="absolute -right-8 top-0 w-[180px] h-[300px] opacity-40 pointer-events-none">
                <img src="/hero.png" alt="Lens" className="w-full h-full object-cover object-left rounded-l-full filter brightness-75 contrast-125" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent"></div>
              </div>
              
              <div className="relative z-10 max-w-[220px]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-label-md text-[9px] text-[#d4af37] tracking-[0.2em] uppercase">CAPABILITIES</span>
                  <div className="w-8 h-[1px] bg-[#d4af37]"></div>
                </div>
                
                <h2 className="font-display text-4xl text-white leading-tight">
                  Elevated <br />
                  <span className="italic font-light text-[#d4af37]">Capabilities</span>
                </h2>
                
                {/* Glowing Separator */}
                <div className="relative w-48 h-[1px] my-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]"></div>
                </div>

                <p className="font-sans text-xs text-[#8a8278] mb-8 leading-relaxed">
                  We deliver end-to-end creative productions tailored for high-end luxury requirements.
                </p>
                
                <a
                  href="#contact"
                  className="inline-flex items-center gap-3 px-6 py-3 border border-[#d4af37]/30 text-[#d4af37] text-[10px] tracking-widest uppercase rounded-md hover:bg-[#d4af37]/10 transition-colors"
                >
                  REQUEST COLLAB <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Header Area - Desktop Version */}
            <div className="hidden md:block col-span-12 md:col-span-4 border-l border-primary/30 pl-8 mb-12 md:mb-0 scroll-animate relative">
              <div className="absolute right-[-100px] top-1/3 ambient-glow animate-float-slow" />
              <span className="font-label-md text-label-md text-primary tracking-widest block mb-4">CAPABILITIES</span>
              <h2 className="font-display text-4xl md:text-5xl text-on-surface mb-8 leading-tight">
                Elevated <span className="italic font-light text-primary">Capabilities</span>
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant mb-8 leading-relaxed">
                We deliver end-to-end creative productions tailored for high-end luxury requirements.
              </p>
              <a
                href="#contact"
                className="btn-luxury-secondary px-8 py-4 font-label-md text-label-md tracking-widest inline-block uppercase rounded-sm"
              >
                REQUEST COLLAB
              </a>
            </div>

            {/* Cards Area - Mobile Version */}
            <div className="col-span-12 flex flex-col gap-4 scroll-animate md:hidden">
              {/* Service 1 */}
              <div className="relative bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center gap-4 overflow-hidden group hover:border-[#d4af37]/30 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37]/50 opacity-80 transition-opacity"></div>
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#d4af37]/10 to-transparent"></div>
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center z-10">
                  <div className="absolute inset-0 border border-[#d4af37]/30 rounded-full"></div>
                  <div className="absolute inset-2 border border-[#d4af37]/10 rounded-full"></div>
                  <Camera size={22} strokeWidth={1.5} className="text-[#d4af37]" />
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="font-display text-xl text-white mb-1">Photography</h4>
                  <p className="font-sans text-xs text-[#8a8278] leading-relaxed max-w-[200px]">Editorial and fine-art photography capturing the absolute core of brand aesthetics.</p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 font-display text-[4rem] text-white/[0.02] pointer-events-none z-0">
                  01
                </div>
              </div>

              {/* Service 2 */}
              <div className="relative bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center gap-4 overflow-hidden group hover:border-[#d4af37]/30 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37]/50 opacity-80 transition-opacity"></div>
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#d4af37]/10 to-transparent"></div>
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center z-10">
                  <div className="absolute inset-0 border border-[#d4af37]/30 rounded-full"></div>
                  <div className="absolute inset-2 border border-[#d4af37]/10 rounded-full"></div>
                  <Video size={22} strokeWidth={1.5} className="text-[#d4af37]" />
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="font-display text-xl text-white mb-1">Cinematography</h4>
                  <p className="font-sans text-xs text-[#8a8278] leading-relaxed max-w-[200px]">High-end film production with a focus on cinematic lighting and narrative depth.</p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 font-display text-[4rem] text-white/[0.02] pointer-events-none z-0">
                  02
                </div>
              </div>

              {/* Service 3 */}
              <div className="relative bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center gap-4 overflow-hidden group hover:border-[#d4af37]/30 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37]/50 opacity-80 transition-opacity"></div>
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#d4af37]/10 to-transparent"></div>
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center z-10">
                  <div className="absolute inset-0 border border-[#d4af37]/30 rounded-full"></div>
                  <div className="absolute inset-2 border border-[#d4af37]/10 rounded-full"></div>
                  <Settings2 size={22} strokeWidth={1.5} className="text-[#d4af37]" />
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="font-display text-xl text-white mb-1">Post Production</h4>
                  <p className="font-sans text-xs text-[#8a8278] leading-relaxed max-w-[200px]">Precision editing, custom soundscapes, and color grading for a distinct cinematic grade.</p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 font-display text-[4rem] text-white/[0.02] pointer-events-none z-0">
                  03
                </div>
              </div>

              {/* Service 4 */}
              <div className="relative bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center gap-4 overflow-hidden group hover:border-[#d4af37]/30 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37]/50 opacity-80 transition-opacity"></div>
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#d4af37]/10 to-transparent"></div>
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center z-10">
                  <div className="absolute inset-0 border border-[#d4af37]/30 rounded-full"></div>
                  <div className="absolute inset-2 border border-[#d4af37]/10 rounded-full"></div>
                  <SparklesIcon size={22} strokeWidth={1.5} className="text-[#d4af37]" />
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="font-display text-xl text-white mb-1">Art Direction</h4>
                  <p className="font-sans text-xs text-[#8a8278] leading-relaxed max-w-[200px]">Curated layouts, scenic styling, and thematic consistency across luxury portfolios.</p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 font-display text-[4rem] text-white/[0.02] pointer-events-none z-0">
                  04
                </div>
              </div>
            </div>

            {/* Cards Area - Desktop Version */}
            <div className="hidden md:grid col-span-12 md:col-span-8 grid-cols-1 sm:grid-cols-2 gap-8 scroll-animate">
              {/* Service 1 */}
              <div className="glass-card p-10 light-leak-border hover:border-primary/40 transition-all duration-300 group">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">videocam</span>
                <h4 className="font-display text-2xl text-on-surface mb-4">Cinematography</h4>
                <p className="font-sans text-body-md text-on-surface-variant">High-end film production with a focus on cinematic lighting and narrative depth.</p>
              </div>

              {/* Service 2 */}
              <div className="glass-card p-10 light-leak-border hover:border-primary/40 transition-all duration-300 group">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">photo_camera</span>
                <h4 className="font-display text-2xl text-on-surface mb-4">Photography</h4>
                <p className="font-sans text-body-md text-on-surface-variant">Editorial and fine-art photography capturing the absolute core of brand aesthetics.</p>
              </div>

              {/* Service 3 */}
              <div className="glass-card p-10 light-leak-border hover:border-primary/40 transition-all duration-300 group">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">edit_note</span>
                <h4 className="font-display text-2xl text-on-surface mb-4">Post Production</h4>
                <p className="font-sans text-body-md text-on-surface-variant">Precision editing, custom soundscapes, and color grading for a distinct cinematic grade.</p>
              </div>

              {/* Service 4 */}
              <div className="glass-card p-10 light-leak-border hover:border-primary/40 transition-all duration-300 group">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform">auto_awesome</span>
                <h4 className="font-display text-2xl text-on-surface mb-4">Art Direction</h4>
                <p className="font-sans text-body-md text-on-surface-variant">Curated layouts, scenic styling, and thematic consistency across luxury portfolios.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Studio Interior & Lounge Showcase */}
      <section className="py-24 max-w-container mx-auto px-margin-mobile md:px-margin-desktop scroll-animate">
        <div className="text-center mb-16">
          <span className="font-label-md text-label-md text-primary tracking-widest block mb-4">OUR ENVIRONMENT</span>
          <h2 className="font-display text-4xl md:text-5xl text-on-surface">The Creative Sanctum</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="group relative overflow-hidden h-[450px] rounded-sm glass-card p-2">
            <div className="w-full h-full relative overflow-hidden">
              <img
                alt="Production Floor"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/tour-3.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="font-label-md text-primary mb-2 block tracking-widest uppercase">The Experience</span>
                <h3 className="font-display text-2xl text-on-surface">The Edit Suite</h3>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden h-[450px] rounded-sm glass-card p-2">
            <div className="w-full h-full relative overflow-hidden">
              <img
                alt="Studio Kitchen"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/tour-4.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="font-label-md text-primary mb-2 block tracking-widest uppercase">The Experience</span>
                <h3 className="font-display text-2xl text-on-surface">Kitchen Area</h3>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden h-[450px] rounded-sm glass-card p-2">
            <div className="w-full h-full relative overflow-hidden">
              <img
                alt="Styling Wardrobe"
                className="w-full h-full object-cover md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                src="/studio-tour/tour-1.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="font-label-md text-primary mb-2 block tracking-widest uppercase">The Experience</span>
                <h3 className="font-display text-2xl text-on-surface">Styling Wardrobe</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-surface-container-low border-t border-outline-variant/10 overflow-hidden">
        <div className="max-w-container mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-16 scroll-animate">
            <div>
              <span className="font-label-md text-label-md text-primary tracking-widest block mb-4">VOICES</span>
              <h2 className="font-display text-4xl md:text-5xl text-on-surface">Client Collaborations</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => scrollTestimonials("left")}
                className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-all duration-300"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
              <button
                onClick={() => scrollTestimonials("right")}
                className="w-12 h-12 rounded-full border border-outline-variant/50 flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-all duration-300"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <div
            ref={testimonialsRef}
            className="flex gap-gutter overflow-x-auto pb-8 snap-x scrollbar-hide scroll-animate"
          >
            {justdialReviews.map((review, idx) => (
              <div
                key={idx}
                className="min-w-[320px] md:min-w-[500px] snap-center glass-card p-12 light-leak-border flex flex-col justify-between"
              >
                <p className="font-sans text-body-lg text-on-surface-variant italic mb-12 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-display text-primary text-lg font-bold">
                    {review.initial}
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface tracking-wider uppercase font-semibold">
                      {review.name}
                    </p>
                    <p className="font-label-md text-[10px] text-primary uppercase tracking-widest font-medium">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="contact"
        className="relative py-32 bg-primary text-center px-margin-mobile flex flex-col items-center justify-center overflow-hidden animate-fade-in-up"
      >
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('/studio-tour/tour-2.jpeg')` }} />
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="font-label-md text-label-md text-on-primary/80 tracking-[0.4em] block mb-4 uppercase">
            BEGIN THE JOURNEY
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-on-primary mb-8 leading-tight font-bold">
            Ready to Create a <span className="italic font-light text-white">Visual Masterpiece?</span>
          </h2>
          <p className="text-on-primary/80 font-sans text-md max-w-lg mb-10 leading-relaxed">
            Get in touch with our creative director to schedule a consultation, enquire about rates, and explore shoot calendars.
          </p>
          <a
            href="https://client.drishtistudios.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-on-primary text-primary hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] px-12 py-5 font-label-md text-label-md tracking-[0.2em] hover:scale-105 transition-all duration-300 inline-block uppercase rounded-sm"
          >
            START A PROJECT
          </a>
        </div>
      </section>

      {/* Footer - Mobile Version */}
      <footer className="bg-[#0a0a0a] w-full pt-16 pb-8 md:hidden">
        <div className="px-6 flex flex-col gap-10">
          {/* Brand & Intro */}
          <div>
            <h3 className="font-display text-3xl text-[#d4af37] tracking-wider mb-4">DRISHTI STUDIOS</h3>
            <p className="font-sans text-sm text-[#a39f98] leading-relaxed max-w-[280px]">
              Crafting cinematic legacies through visionary design and film production. Exclusive, intentional, and unparalleled.
            </p>
          </div>

          {/* Contact List */}
          <div className="flex flex-col gap-8">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center">
                <MapPin size={18} className="text-[#d4af37]" />
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <span className="font-sans text-[10px] text-[#666] tracking-widest uppercase">ADDRESS</span>
                <a href="https://www.google.com/maps/place/Drishti+Studios/@13.3147506,77.5354911,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb1df928744481b:0xe5f241d3ba3f716b!8m2!3d13.3147506!4d77.538066!16s%2Fg%2F11z37tj891?entry=ttu" target="_blank" rel="noopener noreferrer" className="font-display text-[16px] text-[#d4af37] leading-snug">
                  SIT Extension, Doddaballapura,<br/>Karnataka, India
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center">
                <Mail size={18} className="text-[#d4af37]" />
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <span className="font-sans text-[10px] text-[#666] tracking-widest uppercase">EMAIL</span>
                <a href="mailto:drishtistudios@gmail.com" className="font-display text-[16px] text-[#d4af37] leading-snug">
                  drishtistudios@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center">
                <Phone size={18} className="text-[#d4af37]" />
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <span className="font-sans text-[10px] text-[#666] tracking-widest uppercase">PHONE</span>
                <a href="tel:9187653561" className="font-display text-[16px] text-[#d4af37] leading-snug">
                  +91 91876 53561
                </a>
              </div>
            </div>
          </div>

          {/* Navigate */}
          <div className="mt-4">
            <h4 className="font-sans text-[11px] text-[#d4af37] tracking-widest uppercase mb-4">NAVIGATE</h4>
            <div className="w-12 h-[1px] bg-[#d4af37] mb-6"></div>
            <div className="flex flex-col">
              <Link href="/" className="flex items-center justify-between py-4 border-b border-white/5 font-sans text-[13px] text-[#a39f98] hover:text-[#d4af37] tracking-wider transition-colors">
                HOME
                <ChevronRight size={16} className="text-[#d4af37]" />
              </Link>
              <Link href="/studio-tour" className="flex items-center justify-between py-4 border-b border-white/5 font-sans text-[13px] text-[#a39f98] hover:text-[#d4af37] tracking-wider transition-colors">
                STUDIO TOUR
                <ChevronRight size={16} className="text-[#d4af37]" />
              </Link>
              <a href="#portfolio" className="flex items-center justify-between py-4 border-b border-white/5 font-sans text-[13px] text-[#a39f98] hover:text-[#d4af37] tracking-wider transition-colors">
                DESIGN
                <ChevronRight size={16} className="text-[#d4af37]" />
              </a>
              <a href="#portfolio" className="flex items-center justify-between py-4 border-b border-white/5 font-sans text-[13px] text-[#a39f98] hover:text-[#d4af37] tracking-wider transition-colors">
                WORKS
                <ChevronRight size={16} className="text-[#d4af37]" />
              </a>
              <a href="https://client.drishtistudios.in/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-4 border-b border-white/5 font-sans text-[13px] text-[#a39f98] hover:text-[#d4af37] tracking-wider transition-colors">
                CLIENT PORTAL
                <ChevronRight size={16} className="text-[#d4af37]" />
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="mt-2">
            <h4 className="font-sans text-[11px] text-[#d4af37] tracking-widest uppercase mb-4">CONNECT</h4>
            <div className="w-12 h-[1px] bg-[#d4af37] mb-6"></div>
            <div className="flex items-center justify-between w-full">
              <a href="https://www.instagram.com/drishti_studios_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center group-hover:border-[#d4af37]/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4af37]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <span className="font-sans text-[10px] text-[#a39f98] tracking-widest uppercase">INSTAGRAM</span>
              </a>
              <a href="https://www.youtube.com/@drishtistudiospk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center group-hover:border-[#d4af37]/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4af37]"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </div>
                <span className="font-sans text-[10px] text-[#a39f98] tracking-widest uppercase">YOUTUBE</span>
              </a>
              <a href="https://www.facebook.com/people/Drishti-Studios/61588589673488/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center group-hover:border-[#d4af37]/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4af37]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </div>
                <span className="font-sans text-[10px] text-[#a39f98] tracking-widest uppercase">FACEBOOK</span>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="font-sans text-[9px] text-[#666]">
              © {new Date().getFullYear()} DRISHTI STUDIOS. ALL RIGHTS RESERVED.
            </span>
            <div className="flex gap-3">
              <a href="/privacy" className="font-sans text-[9px] text-[#666] hover:text-[#d4af37] transition-colors">PRIVACY</a>
              <span className="text-[#666] text-[9px]">|</span>
              <a href="/terms" className="font-sans text-[9px] text-[#666] hover:text-[#d4af37] transition-colors">TERMS</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer - Desktop Version */}
      <footer className="hidden md:block bg-surface-container-lowest border-t border-outline-variant/10 w-full py-20">
        <div className="grid grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container mx-auto">
          <div className="col-span-12 md:col-span-6 flex flex-col gap-6">
            <span className="font-display text-3xl text-primary tracking-tighter">DRISHTI STUDIOS</span>
            <p className="font-sans text-body-md text-on-surface-variant max-w-sm">
              Crafting cinematic legacies through visionary design and film production. Exclusive, intentional, and unparalleled.
            </p>
            <p className="font-sans text-body-md text-on-surface-variant/80">
              Address:{" "}
              <a
                href="https://www.google.com/maps/place/Drishti+Studios/@13.3147506,77.5354911,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb1df928744481b:0xe5f241d3ba3f716b!8m2!3d13.3147506!4d77.538066!16s%2Fg%2F11z37tj891?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline hover:text-primary-fixed transition-colors"
              >
                SIT Extension, Doddaballapura, Karnataka, India
              </a>
            </p>
            <p className="font-sans text-body-md text-on-surface-variant/80">
              Email:{" "}
              <a
                href="mailto:drishtistudious@gmail.com"
                className="text-primary hover:underline hover:text-primary-fixed transition-colors"
              >
                drishtistudious@gmail.com
              </a>
            </p>
            <p className="font-sans text-body-md text-on-surface-variant/80">
              Phone:{" "}
              <a
                href="tel:9187653561"
                className="text-primary hover:underline hover:text-primary-fixed transition-colors"
              >
                +91 91876 53561
              </a>
            </p>
          </div>

          <div className="col-span-6 md:col-span-3 flex flex-col gap-4">
            <span className="font-label-md text-label-md text-primary tracking-widest mb-4">NAVIGATE</span>
            <Link href="/" className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              HOME
            </Link>
            <Link href="/studio-tour" className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              STUDIO TOUR
            </Link>
            <a href="#portfolio" className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              DESIGN
            </a>
            <a href="#portfolio" className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              WORKS
            </a>
            <a href="https://client.drishtistudios.in/" target="_blank" rel="noopener noreferrer" className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              CLIENT PORTAL
            </a>
          </div>

          <div className="col-span-6 md:col-span-3 flex flex-col gap-4">
            <span className="font-label-md text-label-md text-primary tracking-widest mb-4">CONNECT</span>
            <a
              className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
              href="https://www.instagram.com/drishti_studios_"
              target="_blank"
              rel="noopener noreferrer"
            >
              INSTAGRAM
            </a>
            <a
              className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
              href="https://www.youtube.com/@drishtistudiospk"
              target="_blank"
              rel="noopener noreferrer"
            >
              YOUTUBE
            </a>
            <a
              className="font-sans text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
              href="https://www.facebook.com/people/Drishti-Studios/61588589673488/"
              target="_blank"
              rel="noopener noreferrer"
            >
              FACEBOOK
            </a>
          </div>

          <div className="col-span-12 mt-20 pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="font-sans text-body-md text-on-surface-variant/60">
              © {new Date().getFullYear()} DRISHTI STUDIOS. ALL RIGHTS RESERVED.
            </span>
            <div className="flex gap-8">
              <a className="font-sans text-body-md text-on-surface-variant/60 hover:text-primary transition-colors" href="/privacy">
                PRIVACY
              </a>
              <a className="font-sans text-body-md text-on-surface-variant/60 hover:text-primary transition-colors" href="/terms">
                TERMS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
