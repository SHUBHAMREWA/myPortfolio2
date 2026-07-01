"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAudio } from "@/context/AudioContext";
import { projectsData } from "@/data/projectsData";
import gsap from "gsap";

function HoverProjectRow({ proj }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { playHoverSound, playClickSound } = useAudio();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  const containerRef = useRef(null);
  const floatingWrapperRef = useRef(null);
  const floatingInnerRef = useRef(null);
  const intervalRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !floatingWrapperRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(floatingWrapperRef.current, {
      x: x - 160, // Half of wrapper width (320px)
      y: y - 90,  // Half of wrapper height (~180px)
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleMouseEnter = (e) => {
    playHoverSound();
    
    if (containerRef.current && floatingWrapperRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Instantly set wrapper to cursor position
      gsap.set(floatingWrapperRef.current, {
        x: x - 160,
        y: y - 90
      });
    }

    // Animate inner content sliding up
    gsap.to(floatingInnerRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.2)"
    });

    if (proj.images && proj.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % proj.images.length);
      }, 400); // Rapid slideshow
    }
  };

  const handleMouseLeave = () => {
    // Animate inner content sliding down and fading
    gsap.to(floatingInnerRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 40,
      duration: 0.3,
      ease: "power2.in"
    });

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImgIndex(0);
  };

  const handleClick = () => {
    playClickSound();
    router.push(`/work/${proj.id}`);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div 
      className="flex flex-col lg:flex-row w-full gap-6 lg:gap-10 group cursor-pointer border-b border-black/10 dark:border-white/10 pb-12 md:pb-16"
      onClick={handleClick}
    >
      {/* LEFT: Image Container with Custom Hover Follow */}
      <div 
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative w-full lg:w-[60%] aspect-video lg:aspect-[2/1] bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-[1rem] md:rounded-[1.5rem]"
      >
        {/* Main Background Image */}
        <img
          src={proj.images[0]}
          alt={t(proj.titleKey)}
          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03] opacity-90 group-hover:opacity-70"
        />
        
        {/* Floating Follow Cursor Image Wrapper */}
        <div 
          ref={floatingWrapperRef}
          className="absolute top-0 left-0 w-[240px] sm:w-[320px] pointer-events-none z-10 hidden md:block"
        >
          {/* Inner content that animates slide up */}
          <div 
            ref={floatingInnerRef}
            className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl opacity-0 scale-90 translate-y-[40px] border border-white/10"
          >
            <img 
              src={proj.images[currentImgIndex]} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile static preview indicator */}
        <div className="absolute bottom-4 right-4 md:hidden bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
          Tap to view
        </div>
      </div>

      {/* RIGHT: Text Content (Centered vertically with padding) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-2 lg:px-8">
        <div className="flex flex-col gap-4 md:gap-6">
          
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-black/50 dark:text-white/50">
              ss — [ {proj.year} ]
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase leading-[1.1] mb-4 text-black dark:text-white transition-colors group-hover:text-[#c19c5c]">
              {t(proj.titleKey)}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 leading-relaxed max-w-md">
              {t(proj.descKey)}
            </p>
          </div>

          {/* Tech Stack / Other related text */}
          <div className="flex flex-col gap-4 mt-2 lg:mt-4 bg-white dark:bg-neutral-900/50 p-6 rounded-xl border border-black/10 dark:border-white/5 shadow-sm">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-black dark:text-white">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {proj.stack.map(tech => (
                <span 
                  key={tech} 
                  className="text-[10px] sm:text-xs font-mono font-bold tracking-wide text-black/70 dark:text-white/70 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function WorkIndexPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full relative z-10 pt-32 pb-16 px-4 md:px-6 max-w-[1400px] mx-auto min-h-screen">
      <div className="reveal-heading mb-20 md:mb-32">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-6 block">
          PORTFOLIO
        </span>
        <h1 className="text-6xl sm:text-7xl md:text-[100px] lg:text-[120px] font-serif italic font-normal tracking-tight text-black dark:text-white leading-none mb-8">
          Selected Works
        </h1>
        <p className="text-sm sm:text-base font-medium text-black/60 dark:text-white/60 leading-relaxed max-w-lg">
          A selection of digital experiences, network architectures, <br className="hidden sm:block" /> and security research.
        </p>
      </div>

      <div className="flex flex-col gap-12 md:gap-16 w-full">
        {projectsData.map((proj) => (
          <HoverProjectRow key={proj.id} proj={proj} />
        ))}
      </div>
    </div>
  );
}
