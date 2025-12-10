'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function CouncilDashboard() {
    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Council Dashboard</h1>
                        <p className="text-gray-400">Manage announcements, events, and complaints.</p>
                    </div>
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                        + New Announcement
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Pending Complaints', value: '5', color: 'text-red-500' },
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
                            <Badge variant="outline" className="text-red-500 border-red-500">5 Pending</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { id: 'CMP-005', title: 'Hostel Wi-Fi Issue', dept: 'IT', date: 'Today' },
                                    { id: 'CMP-004', title: 'Canteen Hygiene', dept: 'Health', date: 'Yesterday' },
                                    { id: 'CMP-003', title: 'Classroom Projector', dept: 'Academic', date: '2 days ago' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/5">
                                        <div>
                                            <h4 className="font-medium">{item.title}</h4>
                                            <p className="text-xs text-gray-400">{item.id} • {item.dept} • {item.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/20">
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/20">
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
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
