'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star } from 'lucide-react';

const achievements = [
    {
        id: 1,
        student: "Arjun Mehta",
        title: "Gold Medal - National Coding Olympiad",
        category: "Academic",
        date: "April 2025",
        image: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&h=400&fit=crop",
        description: "Secured 1st rank among 5000+ participants nationwide."
    },
    {
        id: 2,
        student: "University Football Team",
        title: "Winners - Inter-University Cup",
        category: "Sports",
        date: "March 2025",
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=400&fit=crop",
        description: "Defeated reigning champions 3-1 in the finals."
    },
    {
        id: 3,
        student: "Riya Singh",
        title: "Best Research Paper Award",
        category: "Research",
        date: "February 2025",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
        description: "Paper on 'Sustainable Energy' published in IEEE Journal."
    }
];

export default function AchievementsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
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
                                            <Badge className="bg-yellow-500 text-black hover:bg-yellow-400">{item.category}</Badge>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-yellow-500 mb-2">
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
