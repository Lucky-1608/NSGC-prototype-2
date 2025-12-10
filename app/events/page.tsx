'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import StaggeredList from '@/components/ui/motion/StaggeredList';
import TextReveal from '@/components/ui/motion/TextReveal';
import ScrollAnimation from '@/components/ui/motion/ScrollAnimation';

// Mock Data
const upcomingEvents = [
    {
        id: 1,
        title: "Tech Summit 2025",
        date: "2025-06-10",
        time: "10:00 AM",
        venue: "Main Auditorium",
        organizer: "Tech Club",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
        description: "A day of innovation, coding challenges, and tech talks from industry leaders."
    },
    {
        id: 2,
        title: "Inter-Hostel Cricket Tournament",
        date: "2025-06-15",
        time: "08:00 AM",
        venue: "Sports Complex",
        organizer: "Sports Committee",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop",
        description: "Cheer for your hostel in the biggest sporting event of the semester."
    },
    {
        id: 3,
        title: "Leadership Workshop",
        date: "2025-06-20",
        time: "02:00 PM",
        venue: "Seminar Hall B",
        organizer: "NSGC",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
        description: "Learn essential leadership skills from distinguished alumni."
    }
];

const pastEvents = [
    {
        id: 4,
        title: "Freshers' Welcome Party",
        date: "2024-09-01",
        time: "06:00 PM",
        venue: "Open Air Theatre",
        organizer: "Cultural Committee",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop",
        description: "A grand welcome for the batch of 2028."
    },
    {
        id: 5,
        title: "Hackathon v4.0",
        date: "2024-10-15",
        time: "09:00 AM",
        venue: "Library Block",
        organizer: "Coding Club",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&h=400&fit=crop",
        description: "24-hour coding marathon solving real-world problems."
    }
];

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

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
                <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" key={activeTab}>
                    {events.map((event) => (
                        <Card key={event.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-yellow-500/50 transition-colors h-full flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-yellow-500 border border-yellow-500/20">
                                    {event.organizer}
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                                <CardDescription className="flex flex-col gap-2 text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-yellow-500" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-yellow-500" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-yellow-500" />
                                        {event.venue}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-gray-300 text-sm">{event.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                    {activeTab === 'upcoming' ? 'Register Now' : 'View Gallery'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </StaggeredList>

            </div>
        </div>
    );
}
