"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectsData } from "@/data/projectsData";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { playClickSound, playHoverSound } = useAudio();
  
  const [project, setProject] = useState(null);

  useEffect(() => {
    const found = projectsData.find(p => p.id === id);
    if (found) {
      setProject(found);
    } else {
      router.push("/work");
    }
  }, [id, router]);

  if (!project) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a]" />;

  return (
    <div className="w-full relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Back Button */}
      <button 
        onClick={() => { playClickSound(); router.push('/work'); }}
        onMouseEnter={playHoverSound}
        className="group flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-black/50 dark:text-white/50 uppercase hover:text-[#c19c5c] transition-colors mb-12"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        BACK TO INDEX
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#c19c5c] uppercase mb-4">
            [ {project.year} // {t(project.categoryKey)} ]
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white uppercase leading-none">
            {t(project.titleKey)}
          </h1>
        </div>

        {project.detailsLink && project.detailsLink !== "#" && (
          <a
            href={project.detailsLink}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="group flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-transform"
          >
            VIEW LIVE <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 border border-black/5 dark:border-white/5">
        <img 
          src={project.images[0]} 
          alt={t(project.titleKey)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-24">
        
        {/* Left Column - Tech Stack & Meta */}
        <div className="md:col-span-4 flex flex-col gap-10">
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-4 flex items-center gap-2">
              <Code className="w-4 h-4" /> TECH STACK
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-xs font-medium text-black/70 dark:text-white/70 bg-neutral-50 dark:bg-neutral-900/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Overview */}
        <div className="md:col-span-8">
          <h3 className="text-xs font-bold tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-6">
            PROJECT OVERVIEW
          </h3>
          <p className="text-lg md:text-xl font-light leading-relaxed text-black/80 dark:text-white/80">
            {t(project.overviewKey)}
          </p>
        </div>
      </div>

      {/* Additional Images Gallery */}
      {project.images.length > 1 && (
        <div className="w-full flex flex-col gap-8 md:gap-16">
          {project.images.slice(1).map((imgUrl, idx) => (
            <div 
              key={idx} 
              className="w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-neutral-900"
            >
              <img 
                src={imgUrl} 
                alt={`${t(project.titleKey)} gallery image ${idx + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Return to Index */}
      <div className="w-full mt-24 md:mt-32 mb-8 flex flex-col items-center justify-center pt-16 md:pt-24 border-t border-black/10 dark:border-white/10">
        <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-black/50 dark:text-white/50 uppercase mb-6 md:mb-8">
          WANT TO SEE MORE?
        </span>
        <button
          onClick={() => { playClickSound(); router.push('/work'); }}
          onMouseEnter={playHoverSound}
          className="group flex items-center gap-4 text-4xl sm:text-6xl md:text-[80px] font-bold tracking-tight text-black dark:text-white uppercase transition-transform hover:scale-105"
        >
          RETURN TO INDEX 
          <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] transition-transform group-hover:translate-x-4" strokeWidth={3} />
        </button>
      </div>

    </div>
  );
}
