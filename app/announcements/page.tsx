'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Need to create Input component or use standard input
import { Megaphone, Calendar, Search, Filter, ExternalLink } from 'lucide-react';
import { GlassModal } from '@/components/ui/glass-modal';

import { useSharedData, Announcement } from '@/hooks/useSharedData';

const categories = ["All", "Academic", "Events", "Facility", "Hostel", "Sports", "General"];

export default function AnnouncementsPage() {
    const { announcements } = useSharedData();
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const filteredAnnouncements = announcements.map(a => ({
        ...a,
        category: a.category || "General"
    })).filter(a => {
        const matchesCategory = filter === "All" || a.category === filter;
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Announcements</h1>
                    <p className="text-gray-400">Stay updated with the latest news and notices.</p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={filter === cat ? "default" : "outline"}
                                onClick={() => setFilter(cat)}
                                size="sm"
                                className={filter === cat ? "bg-cyan-500 text-black hover:bg-cyan-400" : "border-white/20 text-gray-300"}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="grid gap-6">
                    {filteredAnnouncements.map((announcement, index) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="outline" className={`
                          ${announcement.priority === 'High' ? 'border-red-500 text-red-500' :
                                                        announcement.priority === 'Medium' ? 'border-cyan-500 text-cyan-500' :
                                                            'border-green-500 text-green-500'}
                        `}>
                                                    {announcement.priority} Priority
                                                </Badge>
                                                <Badge variant="secondary" className="bg-white/10 text-gray-300">
                                                    {announcement.category}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl md:text-2xl mb-2">{announcement.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {announcement.date}
                                            </CardDescription>
                                        </div>
                                        <div className="hidden md:block">
                                            <Megaphone className="w-8 h-8 text-white/20" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300">{announcement.content}</p>
                                </CardContent>
                                <CardFooter className="flex flex-wrap items-center gap-4">
                                    <Button variant="link" className="text-cyan-500 p-0 h-auto hover:text-cyan-400" onClick={() => setSelectedAnnouncement(announcement)}>
                                        Read full notice &rarr;
                                    </Button>
                                    {announcement.link && (
                                        <a href={announcement.link.startsWith('http') ? announcement.link : `https://${announcement.link}`} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                                                Open Link
                                            </Button>
                                        </a>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}

                    {filteredAnnouncements.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p>No announcements found matching your criteria.</p>
                        </div>
                    )}
                </div>

                <GlassModal
                    isOpen={!!selectedAnnouncement}
                    onClose={() => setSelectedAnnouncement(null)}
                    title={selectedAnnouncement?.title || "Announcement Details"}
                    footer={
                        <>
                            <Button variant="outline" onClick={() => setSelectedAnnouncement(null)} className="border-white/20 hover:bg-white/10 hover:text-white">
                                Close
                            </Button>
                            {selectedAnnouncement?.link && (
                                <a href={selectedAnnouncement.link.startsWith('http') ? selectedAnnouncement.link : `https://${selectedAnnouncement.link}`} target="_blank" rel="noopener noreferrer">
                                    <Button className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold border-none">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Open Link
                                    </Button>
                                </a>
                            )}
                        </>
                    }
                >
                    {selectedAnnouncement && (
                        <div className="space-y-6 text-sm">
                            <div className="flex flex-col gap-2 pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className={`
                    ${selectedAnnouncement.priority === 'High' ? 'border-red-500 text-red-500' :
                                            selectedAnnouncement.priority === 'Medium' ? 'border-cyan-500 text-cyan-500' :
                                                'border-green-500 text-green-500'}
                  `}>
                                        {selectedAnnouncement.priority} Priority
                                    </Badge>
                                    <Badge variant="secondary" className="bg-white/10 text-gray-300">
                                        {selectedAnnouncement.category}
                                    </Badge>
                                </div>
                                <div className="text-gray-400 flex items-center gap-2 mt-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Date: {selectedAnnouncement.date}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300 mb-2">Description</h4>
                                <div className="bg-black/30 p-4 rounded-lg border border-white/5 text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                                    {selectedAnnouncement.content}
                                </div>
                            </div>
                        </div>
                    )}
                </GlassModal>

            </div>
        </div>
    );
}
