'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, CheckCircle, XCircle, AlertCircle, LogOut, ThumbsUp } from 'lucide-react';
import { useTickets, TicketProvider } from '@/lib/ticket-context';

function CouncilDashboardContent() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { tickets, updateTicketStatus } = useTickets();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role !== 'council') {
            router.push('/council/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return <div className="min-h-screen bg-black" />;
    }

    const pendingCount = tickets.filter(t => t.status === 'Pending').length;

    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Council Dashboard</h1>
                        <p className="text-gray-400">Manage announcements, events, and complaints.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button className="bg-blue-600 text-white hover:bg-blue-500">
                            + New Announcement
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => {
                                localStorage.removeItem('userRole');
                                router.push('/council/login');
                            }}
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Pending Complaints', value: pendingCount.toString(), color: 'text-red-500' },
                        { label: 'Active Events', value: '3', color: 'text-blue-500' },
                        { label: 'Total Announcements', value: '24', color: 'text-yellow-500' },
                        { label: 'Feedback Responses', value: '150+', color: 'text-green-500' },
                    ].map((stat) => (
                        <Card key={stat.label} className="bg-white/5 border-white/10">
                            <CardContent className="p-6 text-center">
                                <h3 className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</h3>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Management Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Complaints Review */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Complaints Review</CardTitle>
                            <Badge variant="outline" className="text-red-500 border-red-500">{pendingCount} Pending</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {tickets.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No complaints found.</p>
                                ) : (
                                    tickets.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex-1 mr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium truncate">{item.subject}</h4>
                                                    <Badge variant="secondary" className="text-xs scale-90">{item.status}</Badge>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span>{item.id}</span>
                                                    <span>•</span>
                                                    <span>{item.department}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-yellow-500">
                                                        <ThumbsUp className="w-3 h-3" /> {item.votes || 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {item.status !== 'Completed' && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => updateTicketStatus(item.id, 'Completed')}
                                                        className="h-8 w-8 text-green-500 hover:bg-green-500/20"
                                                        title="Mark Resolved"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {item.status !== 'Rejected' && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => updateTicketStatus(item.id, 'Rejected')}
                                                        className="h-8 w-8 text-red-500 hover:bg-red-500/20"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                                <Button variant="link" className="text-blue-400 hover:text-blue-300">View All Complaints</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Announcement Creator (Placeholder) */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle>Quick Announcement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Title</label>
                                    <input className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white" placeholder="Announcement Title" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Content</label>
                                    <textarea className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white h-24" placeholder="Type your message..." />
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-500">
                                    <Megaphone className="w-4 h-4 mr-2" /> Post Announcement
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events Management */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Upcoming Events</CardTitle>
                            <Button variant="link" className="text-yellow-500">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { title: 'Tech Summit 2025', date: 'June 10', status: 'Approved' },
                                    { title: 'Cricket Tournament', date: 'June 15', status: 'Planning' },
                                    { title: 'Leadership Workshop', date: 'June 20', status: 'Draft' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <h4 className="font-medium">{item.title}</h4>
                                                <p className="text-xs text-gray-400">{item.date}</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-white/10">
                                            {item.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </div>
    );
}

export default function CouncilDashboard() {
    return (
        <TicketProvider>
            <CouncilDashboardContent />
        </TicketProvider>
    );
}
