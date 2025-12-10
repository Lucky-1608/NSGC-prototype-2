'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, FileText, Send, Search } from 'lucide-react';

export default function ComplaintsPage() {
    const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
    const [complaintId, setComplaintId] = useState('');
    const [trackingResult, setTrackingResult] = useState<any>(null);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock result
        setTrackingResult({
            id: complaintId,
            status: 'In Review',
            date: '2025-05-20',
            title: 'Water cooler malfunction in Block A',
            timeline: [
                { status: 'Received', date: '2025-05-20 10:00 AM', completed: true },
                { status: 'In Review', date: '2025-05-21 09:00 AM', completed: true },
                { status: 'Assigned', date: 'Pending', completed: false },
                { status: 'Resolved', date: 'Pending', completed: false },
            ]
        });
    };

    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Grievance Redressal</h1>
                    <p className="text-gray-400">We are here to listen and resolve your concerns.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/5 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={`px-8 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'submit'
                                    ? 'bg-yellow-500 text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Submit Complaint
                        </button>
                        <button
                            onClick={() => setActiveTab('track')}
                            className={`px-8 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'track'
                                    ? 'bg-yellow-500 text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Search className="w-4 h-4" />
                            Track Status
                        </button>
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'submit' ? (
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle>New Complaint</CardTitle>
                                <CardDescription>Please provide detailed information to help us resolve the issue faster.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Category</label>
                                            <select className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                                                <option>Academic</option>
                                                <option>Hostel</option>
                                                <option>Sanitation</option>
                                                <option>Ragging</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Department</label>
                                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-yellow-500" placeholder="e.g. Computer Science" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Subject</label>
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-yellow-500" placeholder="Brief summary of the issue" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Description</label>
                                        <textarea rows={5} className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-yellow-500" placeholder="Detailed explanation..." />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="anonymous" className="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-black/50" />
                                        <label htmlFor="anonymous" className="text-sm text-gray-300">Submit Anonymously</label>
                                    </div>

                                    <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold py-6 text-lg">
                                        Submit Complaint <Send className="ml-2 w-5 h-5" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            <Card className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle>Track Complaint</CardTitle>
                                    <CardDescription>Enter your Complaint ID to check the current status.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleTrack} className="flex gap-4">
                                        <input
                                            type="text"
                                            value={complaintId}
                                            onChange={(e) => setComplaintId(e.target.value)}
                                            className="flex-grow bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                            placeholder="e.g. CMP-2025-001"
                                        />
                                        <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-400">
                                            Track
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {trackingResult && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <Card className="bg-white/5 border-white/10 border-l-4 border-l-yellow-500">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Badge variant="outline" className="mb-2 border-yellow-500 text-yellow-500">
                                                        {trackingResult.status}
                                                    </Badge>
                                                    <CardTitle className="text-xl">{trackingResult.title}</CardTitle>
                                                    <CardDescription>ID: {trackingResult.id} • Submitted on {trackingResult.date}</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="relative pl-8 border-l border-white/10 space-y-8">
                                                {trackingResult.timeline.map((step: any, index: number) => (
                                                    <div key={index} className="relative">
                                                        <div className={`absolute -left-[37px] w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-yellow-500 border-yellow-500' : 'bg-black border-gray-600'}`} />
                                                        <h4 className={`font-medium ${step.completed ? 'text-white' : 'text-gray-500'}`}>{step.status}</h4>
                                                        <p className="text-xs text-gray-500">{step.date}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
}
