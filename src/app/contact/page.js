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
  Phone
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
    <div className="w-full relative z-10 min-h-[calc(100vh-300px)] pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col justify-center">
      
      <section className="py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#c19c5c] uppercase">{t('contact.tag')}</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mt-3 uppercase leading-none">
                {t('contact.startA')} <span className="font-serif italic lowercase font-light text-[#c19c5c]">{t('contact.conversation')}</span>
              </h1>
              <p className="text-black/60 dark:text-white/60 text-sm font-medium mt-6 leading-relaxed max-w-md">
                {t('contact.desc')}
              </p>

              {/* Contacts info list */}
              <div className="mt-10 space-y-6 text-xs font-medium text-black/80 dark:text-white/80">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">{t('contact.location')}</span>
                    <span className="block">{t('contact.locationValue')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">{t('contact.localTime')}</span>
                    <span className="block">{currentTime || "Loading..."}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">{t('contact.directEmail')}</span>
                    <a href="mailto:shubhamrewamp17@gmail.com" className="hover:text-[#c19c5c] transition-colors duration-200">shubhamrewamp17@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#c19c5c]">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-black/40 dark:text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">{t('contact.phoneContact')}</span>
                    <a href="tel:+917898522932" className="hover:text-[#c19c5c] transition-colors duration-200">+91 7898522932</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5">
              <span className="block text-[9px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-4">{t('contact.profNetworks')}</span>
              <div className="flex items-center gap-4">
                <a href="https://linkedin.com/in/shubham-kushwaha-rewa17" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 hover:border-[#c19c5c] text-blue-600 transition-all duration-300 flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://github.com/SHUBHAMREWA" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 hover:border-[#c19c5c] text-black dark:text-white transition-all duration-300 flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
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
        </div>
      </section>

    </div>
  );
}
