'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

// Mock Data
const members = [
    {
        id: 1,
        name: "Alex Rivera",
        position: "President",
        department: "Computer Science",
        year: "4th Year",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
        bio: "Passionate about student welfare and tech innovation.",
        category: "Executive"
    },
    {
        id: 2,
        name: "Sarah Chen",
        position: "Vice President",
        department: "Economics",
        year: "3rd Year",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces",
        bio: "Focused on inclusive policy making and campus events.",
        category: "Executive"
    },
    {
        id: 3,
        name: "Marcus Johnson",
        position: "General Secretary",
        department: "Mechanical Eng.",
        year: "4th Year",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
        bio: "Ensuring smooth operations and transparent communication.",
        category: "Executive"
    },
    {
        id: 4,
        name: "Priya Patel",
        position: "Cultural Sec.",
        department: "Arts & Design",
        year: "3rd Year",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces",
        bio: "Bringing the campus to life with vibrant festivals.",
        category: "Committee Head"
    },
    {
        id: 5,
        name: "David Kim",
        position: "Sports Sec.",
        department: "Physical Ed.",
        year: "3rd Year",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces",
        bio: "Promoting health, fitness, and competitive spirit.",
        category: "Committee Head"
    },
    {
        id: 6,
        name: "Emily Davis",
        position: "Academic Rep",
        department: "Physics",
        year: "2nd Year",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces",
        bio: "Advocating for better academic resources and support.",
        category: "Representative"
    },
];

const categories = ["All", "Executive", "Committee Head", "Representative"];

export default function MembersPage() {
    const [filter, setFilter] = useState("All");

    const filteredMembers = filter === "All"
        ? members
        : members.filter(m => m.category === filter);

    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet the Team</h1>
                    <p className="text-gray-400">The dedicated individuals working for you.</p>
                </div>

                {/* Filter */}
                <div className="flex justify-center gap-2 mb-12 flex-wrap">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            onClick={() => setFilter(cat)}
                            className={filter === cat ? "bg-yellow-500 text-black hover:bg-yellow-400" : "border-white/20 text-gray-300"}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="bg-white/5 border-white/10 overflow-hidden group hover:border-yellow-500/50 transition-colors">
                                    <div className="aspect-square overflow-hidden relative">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />

                                        <div className="absolute bottom-0 left-0 w-full p-6">
                                            <Badge className="mb-2 bg-yellow-500 text-black hover:bg-yellow-400">{member.position}</Badge>
                                            <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                                            <p className="text-sm text-gray-300">{member.department} • {member.year}</p>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">"{member.bio}"</p>
                                        <div className="flex gap-4">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                                                <Linkedin className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                                                <Twitter className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
}
