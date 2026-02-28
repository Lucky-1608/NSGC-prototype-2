'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ShoppingBag, BarChart2, Bell, Clock, Calendar, Flag, Users } from 'lucide-react';
import Link from 'next/link';
import SpotlightCard from '@/components/ui/spotlight-card';
import { useTickets, TicketProvider } from '@/lib/ticket-context';
import { useSharedData } from '@/hooks/useSharedData';
import { useCouncil, CouncilProvider } from '@/lib/council-context';

function StudentDashboardContent() {
    const { tickets } = useTickets();
    const { announcements: sharedAnnouncements, events: sharedEvents, clubs, members, isLoaded } = useSharedData();
    const { announcements: councilAnnouncements, events: councilEvents } = useCouncil();

    const myTickets = tickets.slice(0, 3); // Just show the recent 3 for dashboard overview

    // Merge and sort Announcements (newest first)
    const allAnnouncements = ([...sharedAnnouncements, ...councilAnnouncements] as any[]).sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateB - dateA;
    });

    // Merge and sort Events (upcoming first)
    const allEvents = [...sharedEvents, ...councilEvents].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
    });

    if (!isLoaded) {
        return <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Student</h1>
                        <p className="text-gray-400">Here's what's happening on campus.</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full md:w-auto">
                        Edit Profile
                    </Button>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <SpotlightCard className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Complaints Submitted</p>
                                <h3 className="text-2xl font-bold">{tickets.length}</h3>
                            </div>
                        </CardContent>
                    </SpotlightCard>
                    <SpotlightCard className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Polls / Surveys</p>
                                <h3 className="text-2xl font-bold">12</h3>
                            </div>
                        </CardContent>
                    </SpotlightCard>
                    <SpotlightCard className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Listings</p>
                                <h3 className="text-2xl font-bold">1</h3>
                            </div>
                        </CardContent>
                    </SpotlightCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Activity & Campus Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Announcements (Synced) */}
                        <SpotlightCard className="bg-white/5 border-white/10">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-cyan-500" />
                                    Campus Announcements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {allAnnouncements.length > 0 ? (
                                        allAnnouncements.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-start p-3 rounded-lg bg-black/20">
                                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                                                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">{(item as any).date || new Date((item as any).createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 leading-relaxed">{item.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic text-center text-sm py-4">No active announcements.</p>
                                    )}
                                </div>
                            </CardContent>
                        </SpotlightCard>

                        {/* Recent Complaints */}
                        <SpotlightCard className="bg-white/5 border-white/10">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg">Your Recent Complaints</CardTitle>
                                <Link href="/complaints/history" className="text-sm text-cyan-500 hover:text-cyan-400">
                                    View All
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {myTickets.length > 0 ? (
                                        myTickets.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                                                <div>
                                                    <h4 className="font-medium">{item.type}</h4>
                                                    <p className="text-xs text-gray-400">{item.id} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <Badge variant={item.status === 'Completed' ? 'default' : 'secondary'} className={item.status === 'Completed' ? 'bg-green-500' : 'bg-cyan-500 text-black'}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No recent complaints found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </SpotlightCard>

                        {/* 2. Upcoming Events (Synced) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allEvents.slice(0, 4).map((event) => (
                                <SpotlightCard key={event.id} className="bg-white/5 border-white/10 group">
                                    <div className="p-5 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="text-xs border-white/20">{event.type}</Badge>
                                            <span className="text-xs text-cyan-500 font-mono">{event.date}</span>
                                        </div>
                                        <h4 className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{event.name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Clock className="w-3 h-3" /> {event.location}
                                        </div>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </div>

                    </div>

                    {/* Right Column: Quick Actions & Lists */}
                    <div className="space-y-8">

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                            <div className="grid gap-4">
                                <Link href="/complaints">
                                    <Button className="w-full justify-start h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white">Submit Complaint</div>
                                                <div className="text-xs text-white">Report an issue</div>
                                            </div>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href="/marketplace">
                                    <Button className="w-full justify-start h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-500">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white">Sell Item</div>
                                                <div className="text-xs text-white">List a book or gadget</div>
                                            </div>
                                        </div>
                                    </Button>
                                </Link>

                                <Link href="/feedback">
                                    <Button className="w-full justify-start h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                                                <BarChart2 className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white">Take Survey</div>
                                                <div className="text-xs text-white">Share your opinion</div>
                                            </div>
                                        </div>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* 3. Student Clubs (Synced) */}
                        <SpotlightCard className="bg-white/5 border-white/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Flag className="w-4 h-4 text-cyan-500" /> Active Clubs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {clubs.map((club) => (
                                        <div key={club.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <div>
                                                <h5 className="font-bold text-sm">{club.name}</h5>
                                                <p className="text-xs text-gray-500">{club.lead}</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 text-[10px]">{club.members} members</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </SpotlightCard>

                        {/* 4. Council Members (Synced) */}
                        <SpotlightCard className="bg-white/5 border-white/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="w-4 h-4 text-cyan-500" /> Student Council
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-500">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium">{member.name}</h5>
                                                <p className="text-xs text-gray-500">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </SpotlightCard>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <TicketProvider>
            <CouncilProvider>
                <StudentDashboardContent />
            </CouncilProvider>
        </TicketProvider>
    );
}
