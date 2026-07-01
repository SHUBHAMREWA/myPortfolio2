"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";
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

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
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

  const projects = [
    {
      title: t('projects.project1Title'),
      category: t('projects.project1Category'),
      image: "/project1.png",
      year: "2025",
      desc: t('projects.project1Desc')
    },
    {
      title: t('projects.project2Title'),
      category: t('projects.project2Category'),
      image: "/project2.png",
      year: "2025",
      desc: t('projects.project2Desc')
    },
    {
      title: t('projects.project3Title'),
      category: t('projects.project3Category'),
      image: "/project3.png",
      year: "2026",
      desc: t('projects.project3Desc')
    },
    {
      title: t('projects.project4Title'),
      category: t('projects.project4Category'),
      image: "/project4.png",
      year: "2026",
      desc: t('projects.project4Desc')
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
            <h1 className="font-serif text-[18vw] sm:text-[140px] md:text-[180px] lg:text-[220px] font-medium tracking-tighter text-black dark:text-white leading-[0.8] uppercase m-0 p-0 relative z-0">
              {t('hero.shubham')}
            </h1>
          </div>

          {/* Subtext block - "I like building digital interfaces." */}
          <div className="mt-6 sm:mt-10 md:mt-12 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            
            {/* Left side: Subtitle and Role */}
            <div className="flex flex-col gap-8 sm:gap-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white leading-none">
                {t('hero.iLikeBuilding')} <br className="hidden sm:block" />
                <span className="relative inline-block mt-0 sm:-mt-2">
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
            <div className="flex flex-col items-start md:items-end gap-6 sm:gap-10 w-full md:w-auto">
              <a
                href="javascript:void(0)"
                onClick={(e) => {
                  e.preventDefault();
                  playClickSound();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
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
          <a href="#" onMouseEnter={playHoverSound} onClick={(e) => { e.preventDefault(); playClickSound(); }} className="group text-[10px] sm:text-xs font-bold tracking-[0.2em] text-black/80 dark:text-white/80 uppercase hover:text-[#c19c5c] transition-colors flex items-center gap-2">
            {t('projects.viewIndex')} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((proj, index) => (
            <div 
              key={index}
              data-cursor="view"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="project-card group relative flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-[1rem] bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5">
                <img 
                  src={proj.image} 
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                />
              </div>

              {/* Info text */}
              <div className="mt-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-[0.1em] text-black dark:text-white uppercase">
                    {proj.title}
                  </h3>
                  <span className="text-[10px] font-bold tracking-[0.15em] text-black/50 dark:text-white/50 uppercase">
                    {proj.category.split(" ")[0]} {/* Showing only first word for clean layout */}
                  </span>
                </div>
                <p className="text-black/60 dark:text-white/60 font-medium text-xs mt-3 leading-relaxed truncate pr-4">
                  {proj.desc}
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
              <div className="w-full h-[1px] bg-white/10 my-6" />
              <div className="mb-6">
                <span className="text-[10px] text-black/40 dark:text-white/40 font-mono tracking-widest block uppercase">{t('pricing.plan1WorkStruct')}</span>
                <span className="text-2xl font-extrabold text-white mt-1 block tracking-wide">{t('pricing.plan1Agile')}</span>
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
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                setFormData(prev => ({ ...prev, engagement: "Full-Time Engineering" }));
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={playHoverSound}
              className="mt-8 w-full py-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-white/30 text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer"
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
              <div className="w-full h-[1px] bg-white/10 my-6" />
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
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                setFormData(prev => ({ ...prev, engagement: "Custom MVP Build" }));
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={playHoverSound}
              className="mt-8 w-full py-3.5 rounded-xl border border-[#c19c5c]/40 hover:border-[#c19c5c] text-center text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-[#c19c5c]/10 text-white cursor-pointer"
            >
              {t('pricing.secureCollab')}
            </a>
          </div>

        </div>

      </section>

      {/* SECTION 5: CONTACT & FOOTER */}
      <section id="contact" className="py-32 px-6 max-w-7xl mx-auto border-t border-black/[0.03] dark:border-white/[0.03] relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#c19c5c] uppercase">{t('contact.tag')}</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white mt-3 uppercase leading-none">
                {t('contact.startA')} <span className="font-serif italic lowercase font-light text-[#c19c5c]">{t('contact.conversation')}</span>
              </h2>
              <p className="text-black/60 dark:text-white/60 text-sm font-light mt-6 leading-relaxed max-w-md">
                {t('contact.desc')}
              </p>

              {/* Contacts info list */}
              <div className="mt-10 space-y-6 text-xs font-light text-black/80 dark:text-white/80">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-mono uppercase">{t('contact.location')}</span>
                    <span className="block">{t('contact.locationValue')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-mono uppercase">{t('contact.localTime')}</span>
                    <span className="block">{currentTime || "Loading..."}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-mono uppercase">{t('contact.directEmail')}</span>
                    <a href="mailto:shubhamrewamp17@gmail.com" className="hover:text-[#c19c5c] transition-colors duration-200">shubhamrewamp17@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-mono uppercase">{t('contact.phoneContact')}</span>
                    <a href="tel:+917898522932" className="hover:text-[#c19c5c] transition-colors duration-200">+91 7898522932</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5">
              <span className="block text-[9px] font-mono tracking-widest text-black/40 dark:text-white/40 uppercase mb-4">{t('contact.profNetworks')}</span>
              <div className="flex items-center gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-black/5 dark:border-white/5 hover:border-black/20 dark:border-white/20 text-black/50 dark:text-white/50 hover:text-white transition-all duration-300 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-black/5 dark:border-white/5 hover:border-black/20 dark:border-white/20 text-black/50 dark:text-white/50 hover:text-white transition-all duration-300 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-2xl relative border border-black/5 dark:border-white/5">
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#c19c5c]/10 border border-[#c19c5c]/30 flex items-center justify-center text-[#c19c5c] mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wider">{t('contact.successMsg')}</h3>
                  <p className="text-black/60 dark:text-white/60 text-sm mt-3 max-w-sm font-light leading-relaxed">
                    {t('contact.thankYou', { name: formData.name, engagement: formData.engagement })}
                  </p>
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", company: "", engagement: "Full-Time Engineering", message: "" });
                    }}
                    className="mt-8 px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 hover:border-white/30 text-xs font-semibold tracking-wider uppercase transition-all duration-300 bg-black/5 dark:bg-white/5"
                  >
                    {t('contact.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono tracking-widest text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formName')}</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('contact.formNamePlh')}
                        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300"
                      />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono tracking-widest text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formEmail')}</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('contact.formEmailPlh')}
                        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono tracking-widest text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formCompany')}</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder={t('contact.formCompanyPlh')}
                        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300"
                      />
                    </div>
                    {/* Engagement Select */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-mono tracking-widest text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formEngagement')}</label>
                      <select
                        name="engagement"
                        value={formData.engagement}
                        onChange={handleInputChange}
                        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-black/80 dark:text-white/80 outline-none transition-colors duration-300 appearance-none cursor-pointer"
                      >
                        <option value="Full-Time Engineering" className="bg-[#fcfcfd] dark:bg-[#121214]">{t('contact.modelFullTime')}</option>
                        <option value="Custom MVP Build" className="bg-[#fcfcfd] dark:bg-[#121214]">{t('contact.modelMVP')}</option>
                        <option value="Technical Consultation" className="bg-[#fcfcfd] dark:bg-[#121214]">{t('contact.modelConsulting')}</option>
                        <option value="Other Scope" className="bg-[#fcfcfd] dark:bg-[#121214]">{t('contact.modelOther')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Project message */}
                  <div className="flex flex-col">
                    <label className="text-[9px] font-mono tracking-widest text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formMessage')}</label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t('contact.formMessagePlh')}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={playHoverSound}
                    className="w-full py-4 rounded-xl bg-[#c19c5c] hover:bg-[#b08d4f] text-black dark:text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c19c5c]/10"
                  >
                    {t('contact.submit')}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* New Minimal Footer */}
        <div className="mt-32 pt-16 border-t border-black/10 dark:border-white/10 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-4">
            
            {/* Left: Copyright & Location */}
            <div className="flex flex-col gap-3">
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

            {/* Middle: Social Links */}
            <div className="flex flex-col gap-6 md:-ml-12">
              <span className="text-[10px] font-bold tracking-[0.25em] text-black/40 dark:text-white/40 uppercase">
                CONNECT_GALLERY
              </span>
              <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                <a href="#" className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase">LINKEDIN</a>
                <a href="#" className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase">GITHUB</a>
                <a href="#" className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase">BEHANCE</a>
                <a href="#" className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase">DRIBBBLE</a>
                <a href="#" className="text-xs font-bold tracking-[0.2em] text-black/70 dark:text-white/70 hover:text-[#c19c5c] transition-colors uppercase">INSTAGRAM</a>
              </div>
            </div>

            {/* Right: Availability */}
            <div className="flex flex-col items-start md:items-end gap-2 text-left md:text-right">
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
      </section>

    </div>
  );
}
