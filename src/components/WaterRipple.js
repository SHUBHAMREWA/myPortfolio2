"use client";

import React, { useEffect } from "react";

/**
 * Global realistic wobbly Water Drop click & tap effect
 */
export default function WaterRipple() {
  useEffect(() => {
    const handleInteraction = (e) => {
      // support touchstart (mobile tap) and mousedown (desktop click)
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (x === undefined || y === undefined) return;

      // Avoid triggering on active input fields to not interrupt typing
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Create water drop container
      const container = document.createElement("div");
      container.className = "water-drop-effect";
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;

      // Create the glassy wobbly liquid blob
      const blob = document.createElement("div");
      blob.className = "water-drop-blob";

      // Set colors, shadows, and gradients dynamically based on theme class
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        blob.style.borderColor = "rgba(255, 255, 255, 0.4)";
        blob.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)";
        blob.style.boxShadow = "inset 0 4px 6px rgba(255, 255, 255, 0.25), 0 4px 10px rgba(0, 0, 0, 0.35)";
      } else {
        blob.style.borderColor = "rgba(0, 0, 0, 0.18)";
        blob.style.background = "linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%)";
        blob.style.boxShadow = "inset 0 3px 5px rgba(0, 0, 0, 0.05), inset 0 -2px 3px rgba(255, 255, 255, 0.4), 0 4px 10px rgba(0, 0, 0, 0.12)";
      }

      container.appendChild(blob);
      document.body.appendChild(container);

      // Clean up DOM after drip animation completes (0.8s)
      setTimeout(() => {
        container.remove();
      }, 850);
    };

    window.addEventListener("mousedown", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" focusable="false">
      <defs>
        <filter id="organic-water-ripple">
          {/* Subtle noise for droplet boundary wobbling */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.03"
            numOctaves="2"
            result="noise"
            seed={1}
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
