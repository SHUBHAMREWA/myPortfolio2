"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { TbCircleLetterS } from "react-icons/tb";

export default function LoginPage() {
  const router = useRouter();
  const { playClickSound, playHoverSound, playSuccessSound } = useAudio();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          router.replace("/admin");
        }
      } catch (err) {
        // Not authenticated
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    playClickSound();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please verify your credentials.");
      }

      playSuccessSound();
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c19c5c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 relative z-10 pt-20 pb-16">
      
      {/* Decorative Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#c19c5c]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-white/70 dark:bg-[#111113]/70 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/10 transition-all duration-300">
        
        {/* Header Monogram & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full border border-[#c19c5c]/40 bg-[#c19c5c]/10 flex items-center justify-center mb-4 text-[#c19c5c]">
            <TbCircleLetterS className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#c19c5c] mb-2">
            ADMIN GATEWAY
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-black dark:text-white tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-xs text-black/50 dark:text-white/50 mt-2">
            Restricted access. Only the authorized administrator email can authenticate.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#c19c5c]" />
              Authorized Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. your-email@gmail.com"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/40 text-black dark:text-white text-sm focus:outline-none focus:border-[#c19c5c] transition-colors"
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-black/70 dark:text-white/70 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#c19c5c]" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/40 text-black dark:text-white text-sm focus:outline-none focus:border-[#c19c5c] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={playHoverSound}
            className="mt-4 w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING...
              </span>
            ) : (
              <>
                ENTER ADMIN PANEL <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-black/40 dark:text-white/40 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            SECURED GATEWAY
          </span>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              playClickSound();
              router.push("/");
            }}
            className="hover:text-black dark:hover:text-white transition-colors underline uppercase tracking-wider"
          >
            Back to Site
          </a>
        </div>

      </div>
    </div>
  );
}
