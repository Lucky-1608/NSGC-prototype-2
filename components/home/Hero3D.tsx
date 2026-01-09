'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { CyberSolarSystem } from '@/components/solar/CyberSolarSystem';

export function Hero3D() {
    return (
        <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-black">
            {/* 3D Solar System Scene */}
            <div className="absolute inset-0 z-0">
                <CyberSolarSystem />
            </div>

            {/* Overlay Content - Positioned to not block the sun too much */}
            <div className="relative z-10 container mx-auto px-4 text-center pointer-events-none mt-40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, dely: 0.5, ease: "easeOut" }}
                    className="pointer-events-auto inline-block p-8 rounded-2xl"
                >
                    <h2 className="text-blue-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        System Online // V.2.0.25
                    </h2>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-6 leading-tight mix-blend-overlay opacity-90">
                        NSGC <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                            NEXUS
                        </span>
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
                        <Button
                            size="lg"
                            className="bg-blue-600/20 backdrop-blur-md border border-blue-500/50 text-blue-100 hover:bg-blue-600/40 w-full sm:w-auto text-lg h-14 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                            onClick={() => {
                                document.getElementById('meet-president')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Initialize Sequence
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-blue-500/50 pointer-events-none"
                animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="text-[10px] uppercase tracking-widest mb-2 text-center">Scroll to Scan</div>
                <ChevronDown className="w-6 h-6 mx-auto" />
            </motion.div>
        </section>
    );
}
