import type { Metadata } from "next";
import { Orbitron, DM_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Use Orbitron for Display / Headers
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

// Use DM Mono for Body / Labels
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NSGC NEXUS COMMAND",
  description: "Space-grade terminal for the Student Council.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmMono.variable} flex min-h-screen bg-black text-white antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* Global Atmosphere Elements */}
        <div className="bg-grid absolute inset-0 z-[-6]" />
        <div className="bg-atmosphere absolute inset-0 z-[-5]" />
        <div className="bg-noise absolute inset-0 z-[-4]" />
        <div className="bg-particles absolute inset-0 z-[-3]" />
        <div className="bg-scanlines pointer-events-none fixed inset-0 z-[100]" />

        <Navbar />

        {/* The main content area now sits next to the vertical Navbar */}
        <main className="flex-1 flex flex-col relative ml-0 md:ml-20 lg:ml-64 transition-all duration-300">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
