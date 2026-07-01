"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { playHoverSound, playClickSound } = useAudio();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    playClickSound();

    if (href === "/") {
      if (pathname === "/") {
        const heroEl = document.getElementById("hero");
        if (heroEl) {
          heroEl.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        router.push("/");
      }
    } else {
      if (pathname === href) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(href);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mt-12 pt-16 border-t border-black/10 dark:border-white/10 pb-8 z-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-4">
        
        {/* Left: Copyright & Location */}
        <div className="flex flex-col gap-3 md:w-1/4">
          <span className="text-xs font-bold tracking-[0.2em] text-black/80 dark:text-white/80 uppercase">
            &copy; 2026 SHUBHAM KUSHWAHA &trade;
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.25em] text-black/50 dark:text-white/50 uppercase">
              REWA, INDIA
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6 md:w-1/6">
          <span className="text-[10px] font-bold tracking-[0.25em] text-black/40 dark:text-white/40 uppercase">
            QUICK LINKS
          </span>
          <div className="flex flex-col gap-y-4">
            <a 
              href="/" 
              onClick={(e) => handleLinkClick(e, "/")} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              {t('nav.home')}
            </a>
            <a 
              href="/work" 
              onClick={(e) => handleLinkClick(e, "/work")} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              {t('nav.work')}
            </a>
            <a 
              href="/about" 
              onClick={(e) => handleLinkClick(e, "/about")} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              {t('nav.about')}
            </a>
            <a 
              href="/contact" 
              onClick={(e) => handleLinkClick(e, "/contact")} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              {t('nav.contact')}
            </a>
          </div>
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-6 md:w-1/6">
          <span className="text-[10px] font-bold tracking-[0.25em] text-black/40 dark:text-white/40 uppercase">
            CONNECT
          </span>
          <div className="flex flex-col gap-y-4">
            <a 
              href="https://linkedin.com/in/shubham-kushwaha-rewa17" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={playClickSound} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              LINKEDIN
            </a>
            <a 
              href="https://github.com/SHUBHAMREWA" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={playClickSound} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              GITHUB
            </a>
            <a 
              href="mailto:shubhamrewamp17@gmail.com" 
              onClick={playClickSound} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              EMAIL
            </a>
            <a 
              href="tel:+917898522932" 
              onClick={playClickSound} 
              onMouseEnter={playHoverSound} 
              className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase"
            >
              PHONE
            </a>
          </div>
        </div>

        {/* Right: Availability */}
        <div className="flex flex-col items-start md:items-end gap-2 text-left md:text-right md:w-1/3">
          <span className="text-[10px] font-bold tracking-[0.25em] text-black/40 dark:text-white/40 uppercase">
            AVAILABILITY
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-black dark:text-white uppercase leading-[1.1]">
            OPEN FOR <br/> COLLABORATIONS
          </h2>
        </div>
      </div>
      
      {/* Bottom Bar line */}
      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10 mt-12" />
    </div>
  );
}
