'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TiltCard } from '@/components/ui/TiltCard';

export function PresidentSection() {
    return (
        <section id="meet-president" className="py-20 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-900/20 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Image Side */}
                    <motion.div
                        className="w-full md:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <TiltCard className="w-full max-w-md mx-auto" tiltIntensity={10}>
                            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <img
                                    src="/images/president.jpg"
                                    alt="Sadu Vinil"
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute bottom-0 left-0 w-full p-6 z-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                                    <h3 className="text-3xl font-bold text-white mb-1">Sadu Vinil</h3>
                                    <p className="text-yellow-500 font-medium">NSGC President, 2025-26</p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        className="w-full md:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet the President</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            "Our mission is to bridge the gap between students and administration, fostering a campus environment where every voice is heard and every idea has the potential to spark change. Together, we are building a legacy of transparency, innovation, and unity."
                        </p>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {['Leadership', 'Transparency', 'Student Welfare', 'Innovation'].map((tag, index) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-yellow-500 hover:bg-yellow-500/10 transition-colors cursor-default"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-px flex-grow bg-white/10" />
                            <span className="text-gray-500 font-signature text-2xl">Sadu Vinil</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
