"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Volume2, VolumeX, ArrowUpRight, Sun, Moon, Globe, Menu, X } from "lucide-react";

export default function Navbar() {
  const { isMuted, isAudioActive, toggleMute, playHoverSound, playClickSound } = useAudio();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Track scrolling to highlight current section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "process", "contact"];
      const scrollPos = window.scrollY + 350; // offset trigger

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    playClickSound();
    
    if (pathname !== "/") {
      if (targetId === "hero") {
        router.push("/");
      } else {
        sessionStorage.setItem("pendingScroll", targetId);
        router.push("/");
      }
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-6 left-0 w-full z-40 px-4 sm:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left Side: Circular Monogram Logo */}
        <a 
          href="/" 
          onClick={(e) => handleLinkClick(e, "hero")}
          onMouseEnter={playHoverSound}
          className="group relative h-12 w-12 hover:w-[150px] rounded-full border border-white/50 dark:border-white/10 hover:border-[#c19c5c]/40 dark:hover:border-[#c19c5c]/40 flex items-center bg-white/40 dark:bg-black/40 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer shadow-lg shadow-black/5 overflow-hidden"
          aria-label="Home"
        >
          {/* Logo Icon (Always Fixed Left) */}
          <div className="absolute left-0 w-12 h-12 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-black dark:text-white group-hover:text-[#c19c5c] dark:group-hover:text-[#c19c5c] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Sunburst Rays */}
              <line x1="12" y1="1.5" x2="12" y2="5.5" />
              <line x1="12" y1="18.5" x2="12" y2="22.5" />
              <line x1="4.5" y1="4.5" x2="7.3" y2="7.3" />
              <line x1="16.7" y1="16.7" x2="19.5" y2="19.5" />
              <line x1="1.5" y1="12" x2="5.5" y2="12" />
              <line x1="18.5" y1="12" x2="22.5" y2="12" />
              <line x1="4.5" y1="19.5" x2="7.3" y2="16.7" />
              <line x1="16.7" y1="7.3" x2="19.5" y2="4.5" />
              {/* Center 'S' */}
              <text x="12" y="16.5" fontSize="14" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="system-ui, -apple-system, Arial, sans-serif">
                S
              </text>
            </svg>
          </div>

          {/* Expanded Name Text */}
          <span className="ml-12 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] whitespace-nowrap text-xs font-bold tracking-[0.2em] text-black dark:text-white uppercase">
            SHUBHAM
          </span>
        </a>

        {/* Center Side: Capsule-style Navigation Menu (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Audio blocked notification (only on wide screens) */}
          {!isAudioActive && !isMuted && (
            <span className="hidden xl:inline-block font-mono text-[9px] tracking-widest text-[#c19c5c] animate-pulse bg-white/60 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 dark:border-[#c19c5c]/10">
              [ CLICK ANYWHERE FOR SOUND ]
            </span>
          )}

          <nav className="rounded-full border border-white/50 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl backdrop-saturate-150 p-1.5 flex items-center gap-1 sm:gap-1.5 shadow-lg shadow-black/5">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "hero")}
              onMouseEnter={playHoverSound}
              className={`text-[9px] sm:text-xs font-mono font-semibold tracking-widest rounded-full px-4 sm:px-5 py-1.5 sm:py-2 uppercase transition-all duration-300 ${
                pathname === "/" && activeSection === "hero"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              {t('nav.home')}
            </a>
            <a
              href="/work"
              onClick={(e) => {
                if (pathname === "/work") {
                  e.preventDefault();
                } else {
                  e.preventDefault();
                  router.push("/work");
                }
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className={`text-[9px] sm:text-xs font-mono font-semibold tracking-widest rounded-full px-4 sm:px-5 py-1.5 sm:py-2 uppercase transition-all duration-300 ${
                pathname.startsWith("/work")
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              {t('nav.work')}
            </a>
            <a
              href="/about"
              onClick={(e) => {
                if (pathname === "/about") {
                  e.preventDefault();
                } else {
                  e.preventDefault();
                  router.push("/about");
                }
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className={`text-[9px] sm:text-xs font-mono font-semibold tracking-widest rounded-full px-4 sm:px-5 py-1.5 sm:py-2 uppercase transition-all duration-300 ${
                pathname === "/about" || activeSection === "process"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              {t('nav.about')}
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                if (pathname === "/contact") {
                  e.preventDefault();
                } else {
                  e.preventDefault();
                  router.push("/contact");
                }
                playClickSound();
              }}
              onMouseEnter={playHoverSound}
              className={`text-[9px] sm:text-xs font-mono font-semibold tracking-widest rounded-full px-4 sm:px-5 py-1.5 sm:py-2 uppercase transition-all duration-300 ${
                pathname === "/contact"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              {t('nav.contact')}
            </a>
            
            {/* Divider */}
            <span className="text-black/10 dark:text-white/20 px-0.5 sm:px-1 font-light">|</span>

            {/* Sound Toggle Button inside Capsule */}
            <button
              onClick={() => {
                playClickSound();
                toggleMute();
              }}
              onMouseEnter={playHoverSound}
              className="p-1.5 rounded-full text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer relative group/btn"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
              ) : (
                <Volume2 className={`w-3.5 h-3.5 text-[#c19c5c] ${!isAudioActive ? 'animate-pulse' : ''}`} />
              )}
              
              {/* Tooltip hint on hover / block */}
              {!isAudioActive && !isMuted && (
                <span className="absolute bottom-full mb-3 right-0 w-max px-3 py-1.5 bg-[#121214] border border-[#c19c5c]/30 rounded text-[9px] font-mono tracking-wider text-white shadow-lg pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-50">
                  {t('nav.soundHint')}
                </span>
              )}
            </button>

            {/* Theme Toggle Button inside Capsule */}
            <button
              onClick={() => {
                playClickSound();
                toggleTheme();
              }}
              onMouseEnter={playHoverSound}
              className="p-1.5 rounded-full text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer relative"
              aria-label="Toggle dark/light theme"
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-[#c19c5c]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-black/60 hover:text-[#c19c5c]" />
              )}
            </button>

            {/* Language Toggle Button */}
            <div className="relative">
              <button
                onClick={() => {
                  playClickSound();
                  setLangMenuOpen(!langMenuOpen);
                }}
                onMouseEnter={playHoverSound}
                className="p-1.5 rounded-full text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer relative"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-black/60 dark:text-white/60 hover:text-[#c19c5c] dark:hover:text-[#c19c5c]" />
                <span className="ml-1 text-[9px] font-mono font-bold uppercase">{language}</span>
              </button>
              
              {/* Language Dropdown */}
              {langMenuOpen && (
                <div className="absolute top-full mt-2 right-0 flex flex-col bg-white dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-lg p-1 shadow-xl z-50 min-w-[100px]">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'ja', label: '日本語' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        playClickSound();
                        changeLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      onMouseEnter={playHoverSound}
                      className={`text-left px-3 py-2 rounded-md text-[10px] font-mono tracking-wider transition-colors duration-200 ${language === l.code ? 'bg-[#c19c5c]/10 text-[#c19c5c] font-bold' : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Menu Toggle Button (visible on mobile only) */}
        <button
          onClick={() => {
            playClickSound();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="relative z-50 md:hidden h-11 w-11 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-lg shadow-black/5 pointer-events-auto text-black dark:text-white hover:border-[#c19c5c]/40"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Right Side: Start Project CTA (hidden on mobile) */}
        <a
          href="/contact"
          onClick={(e) => {
            if (pathname === "/contact") {
              e.preventDefault();
            } else {
              e.preventDefault();
              router.push("/contact");
            }
            playClickSound();
          }}
          onMouseEnter={playHoverSound}
          className="group hidden md:flex items-center gap-3 pl-6 pr-1.5 py-1.5 rounded-full border border-white/50 dark:border-white/10 hover:border-[#c19c5c]/40 dark:hover:border-[#c19c5c]/40 text-[10px] sm:text-xs font-mono font-semibold tracking-widest text-black dark:text-white bg-white/40 dark:bg-black/40 backdrop-blur-xl backdrop-saturate-150 hover:bg-white/60 dark:hover:bg-[#c19c5c]/20 transition-all duration-300 cursor-pointer shadow-lg shadow-black/5"
        >
          {t('nav.startProject')}
          <span className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#c19c5c] group-hover:text-black">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </a>

      </div>

      {/* Mobile Full-Screen Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center p-8 md:hidden pointer-events-auto transition-all duration-300">
          
          {/* Menu Header (Title) */}
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#c19c5c] uppercase mb-8">
            Navigation Menu
          </span>

          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-6 mb-10">
            {[
              { label: t('nav.home'), href: "/", id: "hero", action: () => handleLinkClick({ preventDefault: () => {} }, "hero") },
              { label: t('nav.work'), href: "/work" },
              { label: t('nav.about'), href: "/about" },
              { label: t('nav.contact'), href: "/contact" }
            ].map((link, idx) => {
              const isActive = pathname === link.href || (link.href === "/work" && pathname.startsWith("/work"));
              return (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    playClickSound();
                    setMobileMenuOpen(false);
                    if (link.id) {
                      link.action();
                    } else {
                      router.push(link.href);
                    }
                  }}
                  className={`text-xl font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                    isActive
                      ? "text-[#c19c5c] font-black border-b border-[#c19c5c] pb-1"
                      : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Quick Divider line */}
          <div className="w-12 h-[1px] bg-black/10 dark:bg-white/10 mb-8" />

          {/* Settings controls container */}
          <div className="flex items-center gap-6">
            
            {/* Sound Mute Toggle */}
            <button
              onClick={() => {
                playClickSound();
                toggleMute();
              }}
              className="p-3 rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white cursor-pointer"
              aria-label="Toggle mute"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-black/40 dark:text-white/40" /> : <Volume2 className="w-4 h-4 text-[#c19c5c]" />}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => {
                playClickSound();
                toggleTheme();
              }}
              className="p-3 rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-[#c19c5c]" /> : <Moon className="w-4 h-4 text-black/75" />}
            </button>

            {/* Language Selector Dropdown inside mobile view */}
            <div className="relative">
              <button
                onClick={() => {
                  playClickSound();
                  setLangMenuOpen(!langMenuOpen);
                }}
                className="flex items-center gap-1.5 p-3 rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white text-xs font-mono font-bold uppercase cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col bg-white dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-lg p-1.5 shadow-2xl min-w-[110px] z-50">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'ja', label: '日本語' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        playClickSound();
                        changeLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`text-center px-3 py-2 rounded-md text-[10px] font-mono tracking-wider transition-colors duration-200 ${language === l.code ? 'bg-[#c19c5c]/10 text-[#c19c5c] font-bold' : 'text-black/75 dark:text-white/75 hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </header>
  );
}
