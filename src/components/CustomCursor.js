"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAudio } from "@/context/AudioContext";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const textRef = useRef(null);
  const { playHoverSound } = useAudio();
  const [cursorText, setCursorText] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e) => {
      // Make cursor active/visible as soon as mouse moves
      setActive(true);

      // Smooth movement for large outer circle (inertia)
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power2.out",
      });

      // Quick movement for the inner dot
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const onMouseEnterWindow = () => setActive(true);
    const onMouseLeaveWindow = () => setActive(false);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnterWindow);
    document.addEventListener("mouseleave", onMouseLeaveWindow);

    // Event listeners for interactive elements
    const handleMouseEnter = (e) => {
      const target = e.currentTarget;
      const type = target.getAttribute("data-cursor");
      setCursorText(type === "view" ? "VIEW" : type === "drag" ? "DRAG" : "");
      
      playHoverSound();

      // Animate cursor expanding
      gsap.to(cursor, {
        scale: type === "view" || type === "drag" ? 4 : 2,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderColor: "rgba(255, 255, 255, 0.8)",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(dot, {
        scale: 0,
        duration: 0.2,
      });
    };

    const handleMouseLeave = () => {
      setCursorText("");
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(255, 255, 255, 0.4)",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(dot, {
        scale: 1,
        duration: 0.2,
      });
    };

    // Attach to initial elements
    const attachListeners = () => {
      const interactiveElements = document.querySelectorAll('[data-cursor], button, a, input, textarea');
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    attachListeners();

    // Observer to handle dynamic content additions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const els = node.querySelectorAll ? node.querySelectorAll('[data-cursor], button, a, input, textarea') : [];
              const targetEls = node.hasAttribute && (node.hasAttribute('data-cursor') || ['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(node.nodeName)) ? [node, ...els] : els;
              
              targetEls.forEach((el) => {
                el.addEventListener("mouseenter", handleMouseEnter);
                el.addEventListener("mouseleave", handleMouseLeave);
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      observer.disconnect();
    };
  }, [playHoverSound]);

  return (
    <>
      {/* Outer Cursor ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-white/40 rounded-full pointer-events-none z-50 flex items-center justify-center mix-blend-difference overflow-hidden transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          ref={textRef}
          className="text-[7px] font-bold text-white tracking-widest leading-none pointer-events-none uppercase scale-75"
        >
          {cursorText}
        </span>
      </div>
      {/* Inner Cursor Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white rounded-full pointer-events-none z-50 mix-blend-difference transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
