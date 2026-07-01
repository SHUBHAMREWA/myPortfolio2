import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import ThreeCanvas from "@/components/ThreeCanvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Shubham Kushwaha | Full Stack Engineer & MERN Developer Portfolio",
  description: "High-performance web applications, MERN stack, Next.js, and WebGL interactive experiences. Portfolio of Shubham Kushwaha.",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "SHUBHAM",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f5f5f7] text-[#121214] dark:bg-[#070708] dark:text-[#f5f5f7] flex flex-col font-sans transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            <AudioProvider>
              {/* Background noise grid */}
              <div className="noise-overlay" />
              
              {/* Interactive WebGL Scene */}
              <ThreeCanvas />
              
              {/* Glassmorphic Navbar */}
              <Navbar />
              
              {/* Main content layer */}
              <main className="relative z-10 flex-grow">
                {children}
              </main>
            </AudioProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
