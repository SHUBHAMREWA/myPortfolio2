"use client";

import React from "react";
import { Download, ArrowRight, Mail, Code, Terminal, Database, Server, Layers, Globe, Zap, CPU } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export default function About() {
  const { playClickSound, playHoverSound } = useAudio();

  return (
    <div className="w-full relative z-10 min-h-screen pt-32 pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* 1. TOP SECTION: Intro & Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        
        {/* Intro Card */}
        <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-8">
              INTRODUCTION
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black dark:text-white leading-[1.1] tracking-tight">
              Full-Stack Developer, Network Engineer &amp; Tech Enthusiast.
            </h1>
          </div>
          <p className="text-black/60 dark:text-white/60 font-medium text-sm sm:text-base leading-relaxed max-w-md mt-12">
            A results-driven developer with 1.5+ years of experience building scalable and user-focused web applications. Experienced in React.js, Node.js, and modern development practices, with a passion for optimizing performance and delivering high-quality software.
          </p>
        </div>

        {/* Photo Card */}
        <div className="bg-black rounded-3xl overflow-hidden relative min-h-[400px] lg:min-h-full group">
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop" 
            alt="Coding Workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

      </div>

      {/* 2. MIDDLE SECTION: Experience, Skills, Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-6">
        
        {/* Experience & Education */}
        <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-10 flex flex-col shadow-sm">
          <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-8">
            EXPERIENCE &amp; EDUCATION
          </span>
          
          <div className="flex flex-col gap-8">
            
            {/* Job 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-black dark:text-white">Jr. Full Stack Engineer</h3>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">United Global Federation India</p>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full w-fit">
                JUL 2025 - JUN 2026
              </span>
            </div>

            {/* Job 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-black dark:text-white">Software Dev Intern</h3>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">NextBiz (Remote)</p>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full w-fit">
                JAN 2025 - MAY 2025
              </span>
            </div>

            {/* Edu 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-black dark:text-white">B.Tech, Electrical Eng.</h3>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">Shri Rama Krishna College</p>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full w-fit">
                MAY 2023 - AUG 2026
              </span>
            </div>

            {/* Edu 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-serif font-bold text-black dark:text-white">Diploma, Electrical Eng.</h3>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">Govt. Polytechnic College</p>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full w-fit">
                JUL 2019 - MAY 2021
              </span>
            </div>

          </div>
        </div>

        {/* Technical Skills */}
        <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-4">
              TECHNICAL SKILLS
            </span>
            <p className="text-xs font-medium text-black/50 dark:text-white/50 mb-8 leading-relaxed">
              Core technologies, frameworks, and databases I actively use.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-sm font-bold text-black dark:text-white">React &amp; Next.js</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-black/40 dark:text-white/40 uppercase">ADVANCED</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-sm font-bold text-black dark:text-white">Node.js &amp; Express</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-black/40 dark:text-white/40 uppercase">ADVANCED</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-sm font-bold text-black dark:text-white">MongoDB &amp; DBMS</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-black/40 dark:text-white/40 uppercase">ADVANCED</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code className="w-4 h-4 text-black dark:text-white" />
                  <span className="text-sm font-bold text-black dark:text-white">JS &amp; TypeScript</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-black/40 dark:text-white/40 uppercase">ADVANCED</span>
              </div>
            </div>
          </div>

          <a 
            href="https://github.com/SHUBHAMREWA" 
            target="_blank" 
            rel="noopener noreferrer"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="mt-8 w-full py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> View GitHub
          </a>
        </div>

        {/* Off-screen / Expertise */}
        <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-10 flex flex-col shadow-sm">
          <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-8">
            CORE EXPERTISE
          </span>

          <div className="flex flex-col gap-3 flex-grow">
            <div className="bg-black/5 dark:bg-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Zap className="w-4 h-4 text-black/50 dark:text-white/50" />
              <span className="text-sm font-bold text-black/80 dark:text-white/80">WebSocket &amp; Real-time</span>
            </div>
            
            <div className="bg-black/5 dark:bg-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Layers className="w-4 h-4 text-black/50 dark:text-white/50" />
              <span className="text-sm font-bold text-black/80 dark:text-white/80">Progressive Web Apps</span>
            </div>

            <div className="bg-black/5 dark:bg-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Globe className="w-4 h-4 text-black/50 dark:text-white/50" />
              <span className="text-sm font-bold text-black/80 dark:text-white/80">SEO &amp; Performance</span>
            </div>

            <div className="bg-black/5 dark:bg-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Terminal className="w-4 h-4 text-black/50 dark:text-white/50" />
              <span className="text-sm font-bold text-black/80 dark:text-white/80">RESTful APIs</span>
            </div>
          </div>

          <div className="mt-8 text-center pt-6 border-t border-black/5 dark:border-white/5">
            <span className="text-sm font-serif italic text-black/50 dark:text-white/50">
              "Scalable &amp; Performant"
            </span>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM SECTION: Services, Platforms, Tools, AI, Download */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        
        {/* Services */}
        <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-8 sm:p-10 flex flex-col shadow-sm">
          <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-8">
            SERVICES
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <div className="bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-lg font-serif font-bold text-black dark:text-white mb-3">MERN Platforms</h4>
              <p className="text-xs font-medium text-black/50 dark:text-white/50 leading-relaxed">
                End-to-end full stack web applications with scalable schemas, robust APIs, and interactive React UIs.
              </p>
            </div>
            
            <div className="bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-lg font-serif font-bold text-black dark:text-white mb-3">Next.js MVPs</h4>
              <p className="text-xs font-medium text-black/50 dark:text-white/50 leading-relaxed">
                Rapid product creation for startups utilizing SSR/SSG, Tailwind CSS, and optimized data flow.
              </p>
            </div>

            <div className="bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-lg font-serif font-bold text-black dark:text-white mb-3">Real-time Apps</h4>
              <p className="text-xs font-medium text-black/50 dark:text-white/50 leading-relaxed">
                Live communication systems built with WebSocket and Socket.io for instant data delivery.
              </p>
            </div>

            <div className="bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-lg font-serif font-bold text-black dark:text-white mb-3">SEO &amp; Vitals</h4>
              <p className="text-xs font-medium text-black/50 dark:text-white/50 leading-relaxed">
                Core Web Vitals optimization, semantic HTML, and media payload reduction for higher rankings.
              </p>
            </div>
          </div>
        </div>

        {/* Right side Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Platforms */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-3">
                PLATFORMS
              </span>
              <p className="text-xs font-medium text-black/50 dark:text-white/50 mb-6">
                Also active on these platforms :<br/>(Click to visit)
              </p>
            </div>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/shubham-kushwaha-rewa17/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/SHUBHAMREWA" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:opacity-70 transition-opacity">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="mailto:shubhamrewamp17@gmail.com" className="text-red-500 hover:text-red-700 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Systems & Tools */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-3">
                SYSTEMS &amp; TOOLS
              </span>
              <p className="text-xs font-medium text-black/50 dark:text-white/50 mb-6 leading-relaxed">
                Development tools &amp; version control: Git, VS Code, Vercel, Netlify.
              </p>
            </div>
            <div className="flex gap-4 text-black dark:text-white opacity-80">
              {/* Dummy icons representing tools */}
              <Terminal className="w-5 h-5" />
              <Code className="w-5 h-5" />
              <Server className="w-5 h-5" />
            </div>
          </div>

          {/* AI Orchestration */}
          <div className="bg-white dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase block mb-6">
                AI ORCHESTRATION
              </span>
              <div className="flex gap-4 mb-6">
                <div className="w-6 h-6 text-blue-500"><SparkleIcon /></div>
                <div className="w-6 h-6 text-orange-500"><SparkleIcon /></div>
                <div className="w-6 h-6 text-green-500"><SparkleIcon /></div>
              </div>
            </div>
            <p className="text-xs font-medium text-black/50 dark:text-white/50 leading-relaxed">
              Generative AI, Prompt Engineering, Claude, Gemini, ChatGPT, OpenAI API integrations.
            </p>
          </div>

          {/* Download Resume */}
          <a 
            href="#"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="bg-[#111111] hover:bg-black dark:hover:bg-[#1a1a1a] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-colors group cursor-pointer border border-white/5"
          >
            <Download className="w-8 h-8 text-white mb-4 group-hover:-translate-y-1 transition-transform" />
            <h4 className="text-lg font-serif font-bold text-white tracking-wide">
              Download Resume
            </h4>
          </a>

        </div>

      </div>

    </div>
  );
}

// Simple abstract sparkle icon component since not all icons from lucide-react perfectly match AI logos
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
