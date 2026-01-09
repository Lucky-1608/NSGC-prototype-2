'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import StaggeredList from '@/components/ui/motion/StaggeredList';
import TextReveal from '@/components/ui/motion/TextReveal';
import ScrollAnimation from '@/components/ui/motion/ScrollAnimation';
import { useSharedData } from '@/hooks/useSharedData';
import { Badge } from '@/components/ui/badge';

export default function EventsPage() {
    const { events } = useSharedData();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    // Filter events based on date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const filteredEvents = events.filter(e => {
        if (!e.date) return false;
        const eventDate = new Date(e.date);
        // If date string is invalid, eventDate will be 'Invalid Date'
        if (isNaN(eventDate.getTime())) return false;

        // For comparison, normalize time
        eventDate.setHours(0, 0, 0, 0);

        return activeTab === 'upcoming'
            ? eventDate >= today
            : eventDate < today;
    }).sort((a, b) =>
        activeTab === 'upcoming'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <TextReveal text="Events Calendar" />
                    </h1>
                    <ScrollAnimation delay={0.3}>
                        <p className="text-gray-400">Discover what's happening on campus.</p>
                    </ScrollAnimation>
                </div>

                {/* Tabs */}
                <ScrollAnimation className="flex justify-center mb-12" variant="scale-up" delay={0.4}>
                    <div className="bg-white/5 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upcoming'
                                ? 'bg-yellow-500 text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'past'
                                ? 'bg-yellow-500 text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Past Events
                        </button>
                    </div>
                </ScrollAnimation>

                {/* Grid */}
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>No {activeTab} events found.</p>
                    </div>
                ) : (
                    <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" key={activeTab}>
                        {filteredEvents.map((event) => (
                            <Card key={event.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-yellow-500/50 transition-colors h-full flex flex-col group">
                                <div className="h-48 overflow-hidden relative bg-gradient-to-br from-gray-800 to-black">
                                    {/* Placeholder specific image logic could go here if we had images in the data model */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                                        <Calendar className="w-16 h-16 opacity-20" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-yellow-500 border border-yellow-500/20">
                                        {event.type}
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl mb-2 group-hover:text-yellow-500 transition-colors">{event.name}</CardTitle>
                                    <CardDescription className="flex flex-col gap-2 text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-yellow-500" />
                                            {event.date}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-yellow-500" />
                                            {event.location}
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto pt-6">
                                    {activeTab === 'upcoming' ? (
                                        event.registrationLink ? (
                                            <Button
                                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold border-none"
                                                onClick={() => window.open(event.registrationLink, '_blank')}
                                            >
                                                Register Now
                                            </Button>
                                        ) : (
                                            <Button className="w-full bg-white/10 text-gray-400 border border-white/10 cursor-not-allowed" disabled>
                                                Registration Unavailable
                                            </Button>
                                        )
                                    ) : (
                                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                            View Details
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </StaggeredList>
                )}

            </div>
        </div>
    );
}
