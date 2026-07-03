"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Send, 
  CheckCircle,
  MapPin,
  Clock,
  Mail,
  Phone,
  ArrowUpRight
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Contact() {
  const { playHoverSound, playClickSound, playSuccessSound } = useAudio();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    engagement: "Full-Time Engineering",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    const factor = 12; // Adjust tilt sensitivity
    const rotateX = -y / (box.height / 2) * factor;
    const rotateY = x / (box.width / 2) * factor;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    playClickSound();
    setIsSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        playSuccessSound();
        
        // Explosion confetti trigger
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#c19c5c", "#ffffff", "#121214"]
        });
      } else {
        alert("Something went wrong while sending your message. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please check your internet connection.");
    } finally {
      setIsSending(false);
    }
  };

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

  return (
    <div className="w-full relative z-10 min-h-[calc(100vh-300px)] pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col justify-center gap-12">
      
      {/* 0. BRAND BANNER SECTION */}
      <div className="bg-[#f9f9f8] dark:bg-neutral-900/50 rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between border border-black/5 dark:border-white/5">
        
        {/* Left Side */}
        <div className="flex flex-col mb-10 lg:mb-0">
          <span className="text-[10px] font-bold tracking-[0.2em] text-black/50 dark:text-white/50 uppercase mb-6">
            CONTACT
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-[80px] lg:text-[100px] font-black tracking-tighter text-black dark:text-white uppercase leading-[0.85]">
            LET'S WORK <br />
            <span className="text-black/30 dark:text-white/30">TOGETHER.</span>
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-start lg:items-end text-left lg:text-right max-w-sm">
          <p className="text-sm sm:text-base md:text-lg text-black/60 dark:text-white/60 font-medium leading-relaxed mb-8">
            Open for new opportunities and collaborations at the intersection of design and engineering.
          </p>
          <div className="border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 rounded-full px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] text-black/70 dark:text-white/70 uppercase flex items-center justify-center">
            REWA, INDIA
          </div>
        </div>
      </div>

      <section className="py-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Form (lg:col-span-7) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white dark:bg-[#111111] p-8 sm:p-12 rounded-3xl relative border border-black/5 dark:border-white/5 shadow-sm">
              {isSubmitted ? (
                <div className="py-16 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-[#c19c5c]/10 border border-[#c19c5c]/30 flex items-center justify-center text-[#c19c5c] mb-8">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-black dark:text-white uppercase tracking-wider">{t('contact.successMsg')}</h3>
                  <p className="text-black/60 dark:text-white/60 text-sm mt-4 max-w-sm font-medium leading-relaxed">
                    {t('contact.thankYou', { name: formData.name, engagement: formData.engagement })}
                  </p>
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", company: "", engagement: "Full-Time Engineering", message: "" });
                    }}
                    className="mt-10 px-8 py-3 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#c19c5c] text-xs font-bold tracking-widest uppercase transition-all duration-300"
                  >
                    {t('contact.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formName')}</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('contact.formNamePlh')}
                        className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300"
                      />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formEmail')}</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('contact.formEmailPlh')}
                        className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formCompany')}</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder={t('contact.formCompanyPlh')}
                        className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300"
                      />
                    </div>
                    {/* Engagement Select */}
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formEngagement')}</label>
                      <select
                        name="engagement"
                        value={formData.engagement}
                        onChange={handleInputChange}
                        className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-black/80 dark:text-white/80 outline-none transition-colors duration-300 appearance-none cursor-pointer"
                      >
                        <option value="Full-Time Engineering" className="bg-white dark:bg-[#121214]">{t('contact.modelFullTime')}</option>
                        <option value="Custom MVP Build" className="bg-white dark:bg-[#121214]">{t('contact.modelMVP')}</option>
                        <option value="Technical Consultation" className="bg-white dark:bg-[#121214]">{t('contact.modelConsulting')}</option>
                        <option value="Other Scope" className="bg-white dark:bg-[#121214]">{t('contact.modelOther')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Project message */}
                  <div className="flex flex-col">
                    <label className="text-[9px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-2">{t('contact.formMessage')}</label>
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t('contact.formMessagePlh')}
                      className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 focus:border-[#c19c5c] rounded-xl px-4 py-3.5 text-xs text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 outline-none transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSending}
                    onMouseEnter={playHoverSound}
                    className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-[#c19c5c] dark:hover:bg-[#c19c5c] hover:text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSending ? "SENDING..." : t('contact.submit')} 
                    {!isSending && <Send className="w-3.5 h-3.5" />}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: 3D Stats Card (lg:col-span-5) */}
          <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2 w-full">
            {/* Premium 3D Tilting Card */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: "preserve-3d",
                transition: tilt.x === 0 ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
              }}
              className="w-full aspect-[1.65] bg-gradient-to-br from-[#18181b] to-[#09090b] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none"
            >
              {/* Card Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#c19c5c]/5 to-transparent pointer-events-none" />

              {/* Card Header */}
              <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">Shubham Kushwaha</h3>
                  <p className="text-[10px] font-mono tracking-widest text-[#c19c5c] uppercase mt-1">Full Stack Developer</p>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full text-[9px] font-bold text-green-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Open
                </div>
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-3 gap-2 my-2" style={{ transform: "translateZ(40px)" }}>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">13+</div>
                  <div className="text-[8px] font-mono tracking-wider text-white/45 uppercase mt-1">Projects</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">1.6+</div>
                  <div className="text-[8px] font-mono tracking-wider text-white/45 uppercase mt-1">Years Exp</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">900+</div>
                  <div className="text-[8px] font-mono tracking-wider text-white/45 uppercase mt-1">Commits</div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end" style={{ transform: "translateZ(30px)" }}>
                <div className="text-[9px] sm:text-[10px] font-mono text-white/50 space-y-1.5">
                  <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#c19c5c]" /> shubhamrewamp17@gmail.com</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#c19c5c]" /> Rewa, India</p>
                </div>
                <a 
                  href="mailto:shubhamrewamp17@gmail.com"
                  className="w-10 h-10 rounded-full bg-[#f05537] hover:bg-[#d04527] flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-black/35"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
