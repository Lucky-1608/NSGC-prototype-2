'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, User } from 'lucide-react';
import { useSharedData } from '@/hooks/useSharedData';

export default function MembersPage() {
    const { members } = useSharedData();
    // Start with "All" to show everyone; categories won't work perfectly without that field in data
    // so we'll simplify or remove the filter controls if they aren't useful.
    // For now, let's keep it simple and just show the list.

    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet the Team</h1>
                    <p className="text-gray-400">The dedicated individuals working for you.</p>
                </div>

                {/* Grid */}
                {members.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-gray-400">No council members listed yet.</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {members.map((member) => (
                                <motion.div
                                    key={member.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-white/5 border-white/10 overflow-hidden group hover:border-yellow-500/50 transition-colors h-full flex flex-col">
                                        <div className="aspect-square overflow-hidden relative bg-neutral-900 flex items-center justify-center">
                                            {/* Placeholder Avatar since we don't have images in shared data yet */}
                                            <div className="w-32 h-32 rounded-full bg-yellow-500/20 flex items-center justify-center text-4xl font-bold text-yellow-500">
                                                {member.name.charAt(0)}
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />

                                            <div className="absolute bottom-0 left-0 w-full p-6">
                                                <Badge className="mb-2 bg-yellow-500 text-black hover:bg-yellow-400">{member.role}</Badge>
                                                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                                                {/* <p className="text-sm text-gray-300">{member.department} • {member.year}</p> */}
                                                {/* Department/Year not in current schema */}
                                            </div>
                                        </div>
                                        <CardContent className="p-6 mt-auto">
                                            {/* <p className="text-gray-400 mb-6 text-sm leading-relaxed">"{member.bio}"</p> */}
                                            {/* Bio not in current schema */}
                                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <Mail className="w-4 h-4 text-yellow-500" />
                                                    {member.email}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
