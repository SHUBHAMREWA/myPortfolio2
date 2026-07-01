"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { projectsData } from "@/data/projectsData";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ArrowDown, 
  ArrowUpRight, 
  ArrowRight,
  Sparkles, 
  ChevronRight, 
  Play, 
  Send, 
  CheckCircle,
  MapPin,
  Clock,
  Mail,
  Phone,
  Code
} from "lucide-react";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/context/ThemeContext";
import LiquidText from "@/components/LiquidText";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const { playHoverSound, playClickSound, playSuccessSound } = useAudio();
  const { t } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(0);

  // Handle cross-page scrolling without hash routes
  useEffect(() => {
    const pendingScroll = sessionStorage.getItem("pendingScroll");
    if (pendingScroll) {
      sessionStorage.removeItem("pendingScroll");
      setTimeout(() => {
        const element = document.getElementById(pendingScroll);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    engagement: "Full-Time Engineering",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");


  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState(160);

  // Responsive font size tracking for WebGL Canvas rendering
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setFontSize(80);
      } else if (window.innerWidth < 768) {
        setFontSize(110);
      } else if (window.innerWidth < 1024) {
        setFontSize(140);
      } else {
        setFontSize(180);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update clock coordinates (Rewa, India Time - IST)
  useEffect(() => {
    const updateClock = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const kolkataTime = new Intl.DateTimeFormat([], options).format(new Date());
      setCurrentTime(`${kolkataTime} IST`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero elements reveal
      const tl = gsap.timeline();
      
      tl.fromTo(
        ".reveal-line",
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15 }
      );
      
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );

      // Scroll reveals for section headings
      const revealHeadings = document.querySelectorAll(".reveal-heading");
      revealHeadings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // Scroll reveals for project cards
      const projectCards = document.querySelectorAll(".project-card");
      projectCards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    playClickSound();
    
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitted(true);
      playSuccessSound();
      
      // Explosion confetti trigger
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#c19c5c", "#ffffff", "#121214"]
      });
    }, 400);
  };

  const chapters = [
    {
      num: "01",
      title: t('process.ch1Title'),
      subtitle: t('process.ch1Sub'),
      description: t('process.ch1Desc')
    },
    {
      num: "02",
      title: t('process.ch2Title'),
      subtitle: t('process.ch2Sub'),
      description: t('process.ch2Desc')
    },
    {
      num: "03",
      title: t('process.ch3Title'),
      subtitle: t('process.ch3Sub'),
      description: t('process.ch3Desc')
    },
    {
      num: "04",
      title: t('process.ch4Title'),
      subtitle: t('process.ch4Sub'),
      description: t('process.ch4Desc')
    }
  ];

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);



  return (
    <div ref={heroRef} className="w-full relative z-10">
      
      {/* SECTION 1: HERO */}
      <section id="hero" className="min-h-screen flex flex-col justify-between pt-24 pb-8 px-6 max-w-7xl mx-auto">
        <div className="flex-grow flex flex-col justify-center max-w-5xl">
          
          {/* Top Name */}
          <div className="w-full flex justify-start mb-6 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-black/80 dark:text-white/80">
              {t('hero.name')}
            </p>
          </div>

          {/* Main Headline Group */}
          <div className="relative w-full flex flex-col items-start z-10">
            {/* "call me" */}
            <span className="font-serif italic lowercase text-5xl sm:text-7xl md:text-[90px] text-black/90 dark:text-white/90 leading-none mb-[-0.25rem] sm:mb-[-0.5rem] md:mb-[-1rem] ml-1 sm:ml-4 z-10">
              {t('hero.callMe').split('').join('\u00A0\u00A0')}
            </span>
            
            {/* "SHUBHAM." */}
            <div className="relative z-0 select-none max-w-full">
              <LiquidText
                text={t('hero.shubham')}
                fontSize={fontSize}
                fontWeight="500"
                fontFamily="'Cormorant Garamond', serif"
                color={theme === "dark" ? "#ffffff" : "#121214"}
                waveIntensity={1.0}
                waveRadius={0.25}
                waveSpeed={4.0}
                hoverStrength={1.0}
              />
            </div>
          </div>

          {/* Subtext block - "I like building digital interfaces." */}
          <div className="mt-6 sm:mt-10 md:mt-12 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            
            {/* Left side: Subtitle and Role */}
            <div className="flex flex-col gap-8 sm:gap-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-none">
                {t('hero.iLikeBuilding')} <br className="hidden sm:block" />
                <span className="relative inline-block mt-0 sm:-mt-2 ml-8 sm:ml-20">
                  <span className="font-serif italic font-normal tracking-normal pr-4">{t('hero.digitalInterfaces')}</span>
                  {/* Purple scribble underline */}
                  <svg className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-5 text-[#8b5cf6]" viewBox="0 0 300 20" fill="none" preserveAspectRatio="none">
                    <path d="M2,15 Q50,5 100,12 T200,8 T295,14 M295,14 Q250,18 200,16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </h2>

              <p className="text-sm sm:text-base font-medium text-black/70 dark:text-white/70 tracking-wide">
                {t('hero.role')}
              </p>
            </div>

            {/* Right side: Button and Location */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full md:w-auto">
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  playClickSound();
                  router.push("/contact");
                }}
                onMouseEnter={playHoverSound}
                className="group relative overflow-hidden inline-flex items-center justify-center bg-black dark:bg-white border border-black dark:border-white rounded-[2rem] px-8 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 shadow-xl shadow-black/10 dark:shadow-white/10 hover:shadow-[#8b5cf6]/20"
              >
                <span className="absolute inset-0 w-full h-full bg-white dark:bg-black translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <span className="relative z-10 text-white dark:text-black group-hover:text-black dark:group-hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                  {t('hero.bookCall')}
                </span>
              </a>

              <div className="text-xs sm:text-sm font-bold tracking-[0.1em] uppercase text-black/80 dark:text-white/80 border-b-2 border-black/80 dark:border-white/80 pb-1.5 inline-block">
                {t('hero.location')}
              </div>
            </div>
          </div>

        </div>

        {/* Hero Footer with scroll indicator and client list */}
        <div ref={scrollIndicatorRef} className="border-t border-black/10 dark:border-white/10 pt-8 mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 text-xs text-black/40 dark:text-white/40 tracking-wider">
            <div className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full animate-ping" />
            <span>{t('hero.scrollExplore')}</span>
          </div>
          
          {/* Tech Stack Ticker */}
          <div className="relative overflow-hidden w-full sm:w-[450px] md:w-[600px] h-6 flex items-center">
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#070708] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#070708] to-transparent z-10" />
            <div className="flex gap-10 whitespace-nowrap animate-[infinite-scroll_25s_linear_infinite]">
              {["NEXT.JS", "REACT", "NODE.JS", "MONGODB", "TYPESCRIPT", "REDUX TOOLKIT", "SOCKET.IO", "GSAP", "EXPRESS.JS"].map((tech, i) => (
                <span key={i} className="text-[10px] font-bold tracking-[0.25em] text-black/30 dark:text-white/30 hover:text-black/60 dark:text-white/60 transition-colors duration-300 cursor-default">
                  {tech}
                </span>
              ))}
              {["NEXT.JS", "REACT", "NODE.JS", "MONGODB", "TYPESCRIPT", "REDUX TOOLKIT", "SOCKET.IO", "GSAP", "EXPRESS.JS"].map((tech, i) => (
                <span key={`dup-${i}`} className="text-[10px] font-bold tracking-[0.25em] text-black/30 dark:text-white/30 hover:text-black/60 dark:text-white/60 transition-colors duration-300 cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 2: SELECTED PROJECTS */}
      <section id="work" className="py-32 px-6 max-w-7xl mx-auto border-t border-black/[0.03] dark:border-white/[0.03]">
        
        {/* Header */}
        <div className="reveal-heading mb-12 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-6">
          <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-black/80 dark:text-white/80 uppercase">
            {t('projects.title')}
          </h2>
          <a href="/work" onMouseEnter={playHoverSound} onClick={(e) => { e.preventDefault(); playClickSound(); router.push('/work'); }} className="group text-[10px] sm:text-xs font-bold tracking-[0.2em] text-black/80 dark:text-white/80 uppercase hover:text-[#c19c5c] transition-colors flex items-center gap-2">
            {t('projects.viewIndex')} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projectsData.slice(0, 3).map((proj, index) => (
            <div 
              key={proj.id}
              data-cursor="view"
              onMouseEnter={playHoverSound}
              onClick={() => { playClickSound(); router.push(`/work/${proj.id}`); }}
              className="project-card group relative flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-[1rem] bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5">
                <img 
                  src={proj.images[0]} 
                  alt={t(proj.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[0.95] group-hover:-translate-x-[10%]"
                />
                {/* Hover Details Overlay */}
                <div className="absolute inset-y-0 right-0 w-3/5 sm:w-1/2 bg-white/95 dark:bg-black/90 backdrop-blur-md border-l border-black/10 dark:border-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col justify-center p-6">
                  <h4 className="text-black dark:text-white font-bold text-sm tracking-widest uppercase mb-3 line-clamp-2 leading-snug">
                    {t(proj.titleKey)}
                  </h4>
                  <p className="text-black/70 dark:text-white/70 text-[10px] sm:text-xs leading-relaxed line-clamp-4 mb-6 font-medium">
                    {t(proj.descKey)}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-[#c19c5c] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
                      Click to view <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Info text */}
              <div className="mt-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-[0.1em] text-black dark:text-white uppercase">
                    {t(proj.titleKey)}
                  </h3>
                  <span className="text-[10px] font-bold tracking-[0.15em] text-black/50 dark:text-white/50 uppercase">
                    {t(proj.categoryKey).split(" ")[0]} {/* Showing only first word for clean layout */}
                  </span>
                </div>
                <p className="text-black/60 dark:text-white/60 font-medium text-xs mt-3 leading-relaxed truncate pr-4">
                  {t(proj.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Removed About section as it is now at /about route */}

      {/* SECTION 4: ENGAGEMENT MODELS */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto border-t border-black/[0.03] dark:border-white/[0.03]">
        
        {/* Header */}
        <div className="reveal-heading mb-20 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#c19c5c] uppercase">{t('pricing.tag')}</span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white mt-3 uppercase">
            {t('pricing.howWeCan')} <span className="font-serif italic lowercase font-light text-[#c19c5c]">{t('pricing.partner')}</span>
          </h2>
          <p className="text-black/50 dark:text-white/50 text-sm font-light leading-relaxed mt-4">
            {t('pricing.desc')}
          </p>
        </div>

        {/* Pricing/Engagement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Plan 1 */}
          <div className="glass-panel p-8 sm:p-10 rounded-2xl flex flex-col justify-between border border-black/5 dark:border-white/5 relative glass-panel-hover">
            <div>
              <span className="text-[10px] font-mono text-black/40 dark:text-white/40 tracking-widest uppercase block mb-1">{t('pricing.plan1Tag')}</span>
              <h3 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider">{t('pricing.plan1Title')}</h3>
              <p className="text-xs text-black/50 dark:text-white/50 font-light mt-3 leading-relaxed">
                {t('pricing.plan1Desc')}
              </p>
              <div className="w-full h-[1px] bg-black/10 dark:bg-white/10 my-6" />
              <div className="mb-6">
                <span className="text-[10px] text-black/40 dark:text-white/40 font-mono tracking-widest block uppercase">{t('pricing.plan1WorkStruct')}</span>
                <span className="text-2xl font-extrabold text-black dark:text-white mt-1 block tracking-wide">{t('pricing.plan1Agile')}</span>
              </div>
              <ul className="space-y-3.5 text-xs text-black/80 dark:text-white/80 font-light">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan1Li1')}
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan1Li2')}
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan1Li3')}
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan1Li4')}
                </li>
              </ul>
            </div>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                setFormData(prev => ({ ...prev, engagement: "Full-Time Engineering" }));
                router.push("/contact");
              }}
              onMouseEnter={playHoverSound}
              className="mt-8 w-full py-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-black dark:text-white cursor-pointer"
            >
              {t('pricing.inquire')}
            </a>
          </div>

          {/* Plan 2 */}
          <div className="glass-panel p-8 sm:p-10 rounded-2xl flex flex-col justify-between border border-[#c19c5c]/20 relative glass-panel-hover">
            {/* Tag */}
            <div className="absolute top-4 right-4 bg-[#c19c5c]/10 border border-[#c19c5c]/30 px-3 py-1 rounded-full text-[8px] font-mono tracking-widest text-[#c19c5c] uppercase">
              {t('pricing.contract')}
            </div>
            
            <div>
              <span className="text-[10px] font-mono text-[#c19c5c] tracking-widest uppercase block mb-1">{t('pricing.plan2Tag')}</span>
              <h3 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider">{t('pricing.plan2Title')}</h3>
              <p className="text-xs text-black/50 dark:text-white/50 font-light mt-3 leading-relaxed">
                {t('pricing.plan2Desc')}
              </p>
              <div className="w-full h-[1px] bg-black/10 dark:bg-white/10 my-6" />
              <div className="mb-6">
                <span className="text-[10px] text-black/40 dark:text-white/40 font-mono tracking-widest block uppercase">{t('pricing.plan2Method')}</span>
                <span className="text-2xl font-extrabold text-[#c19c5c] mt-1 block tracking-wide">{t('pricing.plan2Milestone')}</span>
              </div>
              <ul className="space-y-3.5 text-xs text-black/80 dark:text-white/80 font-light">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan2Li1')}
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan2Li2')}
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan2Li3')}
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#c19c5c] rounded-full" />
                  {t('pricing.plan2Li4')}
                </li>
              </ul>
            </div>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                router.push("/contact");
              }}
              onMouseEnter={playHoverSound}
              className="mt-8 w-full py-3.5 rounded-xl border border-[#c19c5c]/40 hover:border-[#c19c5c] text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-[#c19c5c]/10 text-[#c19c5c] dark:text-white cursor-pointer"
            >
              {t('pricing.secureCollab')}
            </a>
          </div>

        </div>

      </section>

      {/* SECTION 5: CONTACT & FOOTER removed, now handled by /contact route and global layout */}



    </div>
  );
}
