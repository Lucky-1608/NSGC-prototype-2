'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Flag, User, ExternalLink } from 'lucide-react';
import { useSharedData } from '@/hooks/useSharedData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ClubsPage() {
    const { clubs } = useSharedData();

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Clubs</h1>
                    <p className="text-gray-400">Join a community. Pursue your passion.</p>
                </div>

                {clubs.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-white/5 border-white/10 p-10 text-center flex flex-col items-center gap-4 max-w-md">
                                <Users className="w-16 h-16 text-cyan-500" />
                                <h2 className="text-2xl font-bold">No Clubs Active Yet</h2>
                                <p className="text-gray-400">
                                    New clubs will appear here once registered by the Student Council.
                                </p>
                            </Card>
                        </motion.div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map((club, index) => (
                            <motion.div
                                key={club.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors h-full">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
                                                <Flag className="w-6 h-6" />
                                            </div>
                                            <Badge variant="secondary" className="bg-white/10 text-gray-300">
                                                {club.members} Members
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl">{club.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-400 mb-6 min-h-[48px]">{club.description}</p>
                                        <div className="pt-4 border-t border-white/5 space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <User className="w-4 h-4" />
                                                <span>Lead by <span className="text-cyan-500 font-medium">{club.lead}</span></span>
                                            </div>
                                            {club.website && (
                                                <a href={club.website} target="_blank" rel="noopener noreferrer" className="block w-full">
                                                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-cyan-500 group">
                                                        <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                        Visit Website
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
