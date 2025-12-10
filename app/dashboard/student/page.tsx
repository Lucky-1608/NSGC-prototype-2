'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ShoppingBag, BarChart2, Bell, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Student</h1>
                        <p className="text-gray-400">Here's what's happening with your account.</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Edit Profile
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Complaints Submitted</p>
                                <h3 className="text-2xl font-bold">3</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Polls Participated</p>
                                <h3 className="text-2xl font-bold">12</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Listings</p>
                                <h3 className="text-2xl font-bold">1</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Your Complaints</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { id: 'CMP-001', title: 'Water Cooler Malfunction', status: 'In Review', date: '2 days ago' },
                                        { id: 'CMP-002', title: 'Library Book Request', status: 'Resolved', date: '1 week ago' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                                            <div>
                                                <h4 className="font-medium">{item.title}</h4>
                                                <p className="text-xs text-gray-400">{item.id} • {item.date}</p>
                                            </div>
                                            <Badge variant={item.status === 'Resolved' ? 'default' : 'secondary'} className={item.status === 'Resolved' ? 'bg-green-500' : 'bg-yellow-500 text-black'}>
                                                {item.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Notifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { title: 'New Event: Tech Summit', desc: 'Registration is now open.', time: '2 hours ago' },
                                        { title: 'Poll Results', desc: 'The results for "Canteen Menu" are out.', time: '1 day ago' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-medium">{item.title}</h4>
                                                <p className="text-xs text-gray-400">{item.desc}</p>
                                                <p className="text-[10px] text-gray-500 mt-1">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                        <div className="grid gap-4">
                            <Link href="/complaints">
                                <Button className="w-full justify-start h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">Submit Complaint</div>
                                            <div className="text-xs text-gray-400">Report an issue</div>
                                        </div>
                                    </div>
                                </Button>
                            </Link>

                            <Link href="/marketplace">
                                <Button className="w-full justify-start h-auto py-4 bg-white/5 hover:bg-white/10 border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">Sell Item</div>
                                            <div className="text-xs text-gray-400">List a book or gadget</div>
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
                                            <div className="font-bold">Take Survey</div>
                                            <div className="text-xs text-gray-400">Share your opinion</div>
                                        </div>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
