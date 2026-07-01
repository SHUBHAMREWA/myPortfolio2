"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef(null);
  const bgmRef = useRef(null);

  // Initialize or resume the Web Audio context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    
    return audioCtxRef.current;
  };

  // Initialize BGM on client-mount and set up interaction unlocking
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!bgmRef.current) {
        bgmRef.current = new Audio("/bgm.mp3");
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.35; // Comfortable ambient background volume
        
        // Bulletproof loop fallback: manually restart when track ends
        bgmRef.current.addEventListener("ended", () => {
          if (bgmRef.current && !isMuted) {
            bgmRef.current.currentTime = 0;
            bgmRef.current.play().catch(() => {});
          }
        });
      }
      
      // Try playing immediately on load (in case browser autoplay permission is already granted)
      if (!isMuted) {
        bgmRef.current.play()
          .then(() => {
            setIsAudioActive(true);
          })
          .catch(() => {
            setIsAudioActive(false);
            console.log("Autoplay blocked by browser. Music will start immediately on first user interaction.");
          });
      }
    }

    // Broad range of user gestures to unlock audio immediately
    const unlock = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      
      // Play BGM immediately on gesture if unmuted and currently paused
      if (bgmRef.current && bgmRef.current.paused && !isMuted) {
        bgmRef.current.play()
          .then(() => {
            setIsAudioActive(true);
          })
          .catch(() => {});
      } else if (bgmRef.current && !bgmRef.current.paused) {
        setIsAudioActive(true);
      }
      
      // Remove listeners once unlocked
      removeListeners();
    };

    const listeners = ["click", "touchstart", "touchmove", "mousedown", "keydown", "pointerdown", "scroll", "wheel"];
    
    const addListeners = () => {
      listeners.forEach(event => {
        window.addEventListener(event, unlock, { passive: true });
      });
    };

    const removeListeners = () => {
      listeners.forEach(event => {
        window.removeEventListener(event, unlock);
      });
    };

    addListeners();

    return () => {
      removeListeners();
      
      // Clean up BGM audio node
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, [isMuted]);

  // Handle visibility changes (tab switching / minimization) and window focus/blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!bgmRef.current) return;

      if (document.hidden) {
        bgmRef.current.pause();
      } else {
        if (!isMuted && isAudioActive) {
          bgmRef.current.play().catch(() => {});
        }
      }
    };

    const handleWindowBlur = () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    };

    const handleWindowFocus = () => {
      if (bgmRef.current && !isMuted && isAudioActive) {
        bgmRef.current.play().catch(() => {});
      }
    };

    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleWindowBlur);
      window.addEventListener("focus", handleWindowFocus);
    }

    return () => {
      if (typeof window !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleWindowBlur);
        window.removeEventListener("focus", handleWindowFocus);
      }
    };
  }, [isMuted, isAudioActive]);

  // Synthesize a very short high-frequency tick for hover effects
  const playHoverSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sine";
      
      const now = ctx.currentTime;
      // Modern subtle glass tap
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.03);

      // Clean, fast envelope
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  // Synthesize a clean, solid click pop sound
  const playClickSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Use square for a more mechanical "switch" texture
      osc.type = "square";
      
      const now = ctx.currentTime;
      // Low frequency gives a solid thud/click feel
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

      // Snappy envelope
      gainNode.gain.setValueAtTime(0.08, now); // Square is loud, 0.08 is plenty
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  // Synthesize a premium Success chime for submissions/achievements
  const playSuccessSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Play note 1 (E6)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1318.51, now);
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Play note 2 (B6) slightly offset
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1975.53, now + 0.08);
      gain2.gain.setValueAtTime(0.04, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (bgmRef.current) {
      if (nextMuted) {
        bgmRef.current.pause();
        setIsAudioActive(false);
      } else {
        bgmRef.current.play()
          .then(() => {
            setIsAudioActive(true);
          })
          .catch(() => {
            setIsAudioActive(false);
          });
      }
    }
    
    // Trigger a click sound right before muting/after unmuting as feedback
    setTimeout(() => {
      if (nextMuted) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass && !audioCtxRef.current) {
            audioCtxRef.current = new AudioContextClass();
          }
          if (audioCtxRef.current) {
            audioCtxRef.current.resume();
          }
        } catch (e) {}
      }
    }, 10);
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        isAudioActive,
        toggleMute,
        playHoverSound,
        playClickSound,
        playSuccessSound,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
