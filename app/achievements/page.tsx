'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star } from 'lucide-react';
import { useSharedData } from '@/hooks/useSharedData';

export default function AchievementsPage() {
    const { achievements } = useSharedData();

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Hall of Fame</h1>
                    <p className="text-gray-400">Celebrating excellence and glory.</p>
                </div>

                <div className="grid gap-12">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <Card className="bg-white/5 border-white/10 overflow-hidden group">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-cyan-500 text-black hover:bg-cyan-400">{item.category}</Badge>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-cyan-500 mb-2">
                                            <Trophy className="w-5 h-5" />
                                            <span className="font-bold tracking-widest uppercase text-sm">Achievement</span>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
                                        <h3 className="text-xl text-gray-300 mb-4">{item.student}</h3>
                                        <p className="text-gray-400 mb-6">{item.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Medal className="w-4 h-4" />
                                            {item.date}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
