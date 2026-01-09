'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassModal } from '@/components/ui/glass-modal';
import {
    Users, Megaphone, Calendar, Flag, Plus, Trash2,
    LogOut, CheckCircle, AlertTriangle, Star, Menu, FileText, ShoppingBag, BarChart2, Vote, Trophy, MessageSquare, ExternalLink, Camera, Upload, X, Crop, ThumbsUp
} from 'lucide-react';
import { useTickets, TicketProvider, TicketStatus } from '@/lib/ticket-context';
import Link from 'next/link';

// --- Types ---
import { useSharedData, Announcement, CouncilMember, Club, Event, Election, Achievement, User } from '@/hooks/useSharedData';
import { ImageCropper } from '@/components/ui/image-cropper';

function PresidentDashboardContent() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // --- State Management ---
    const {
        announcements, setAnnouncements,
        members, setMembers,
        clubs, setClubs,
        events, setEvents,
        elections, setElections,
        achievements, setAchievements,
        users, setUsers,
        totalUsers
    } = useSharedData();

    const { tickets, updateTicketStatus } = useTickets();

    // UI States
    const [activeTab, setActiveTab] = useState('announcements');

    // Add Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModalType, setAddModalType] = useState<'announcement' | 'member' | 'club' | 'event' | 'election' | 'achievement' | 'user'>('announcement');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: string, id: string } | null>(null);

    // Camera & Image State for Forms
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null); // To keep track of stream for cleanup

    // Cropping State
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [isCandidateCrop, setIsCandidateCrop] = useState(false);

    // Temporary Candidate State for Election Form
    const [tempCandidateName, setTempCandidateName] = useState('');
    const [tempCandidateImage, setTempCandidateImage] = useState<string | undefined>(undefined);

    // Form States
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role !== 'president') {
            router.push('/president/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // --- Helpers ---
    const openAddModal = (type: 'announcement' | 'member' | 'club' | 'event' | 'election' | 'achievement' | 'user', data?: any) => {
        setAddModalType(type);
        setFormData(data || {}); // Reset form or load existing data
        setIsAddModalOpen(true);
    };

    const confirmDelete = (type: string, id: string) => {
        setItemToDelete({ type, id });
        setIsDeleteModalOpen(true);
    };

    // Camera Handlers
    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setIsCameraOpen(false);
            alert("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCandidate = false) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size > 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Open Cropper
                setCroppingImage(result);
                setIsCandidateCrop(isCandidate);
            };
            reader.readAsDataURL(file);
        }
    };

    const capturePhoto = (isCandidate = false) => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const imageData = canvasRef.current.toDataURL('image/jpeg');

                // Open Cropper
                setCroppingImage(imageData);
                setIsCandidateCrop(isCandidate);

                stopCamera();
            }
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        if (isCandidateCrop) {
            setTempCandidateImage(croppedImage);
        } else {
            setFormData(prev => ({ ...prev, image: croppedImage }));
        }
        setCroppingImage(null);
    };

    const removePhoto = (isCandidate = false) => {
        if (isCandidate) {
            setTempCandidateImage(undefined);
        } else {
            setFormData(prev => {
                const newData = { ...prev };
                delete newData.image;
                return newData;
            });
        }
    };

    const executeDelete = () => {
        if (!itemToDelete) return;

        const { type, id } = itemToDelete;
        switch (type) {
            case 'announcement': setAnnouncements(prev => prev.filter(i => i.id !== id)); break;
            case 'member': setMembers(prev => prev.filter(i => i.id !== id)); break;
            case 'club': setClubs(prev => prev.filter(i => i.id !== id)); break;
            case 'event': setEvents(prev => prev.filter(i => i.id !== id)); break;
            case 'election': setElections(prev => prev.filter(i => i.id !== id)); break;
            case 'achievement': setAchievements(prev => prev.filter(i => i.id !== id)); break;
            case 'user': setUsers(prev => prev.filter(i => i.id !== id)); break;
        }
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!formData.id;
        const itemId = isEditing ? formData.id : Math.random().toString(36).slice(2, 11);
        const newData = { ...formData, id: itemId };

        // Helper to update or add
        const updateState = (prev: any[], newItem: any) => {
            if (isEditing) {
                return prev.map(item => item.id === itemId ? { ...item, ...newItem } : item);
            }
            return [...prev, newItem];
        };

        switch (addModalType) {
            case 'announcement':
                setAnnouncements(prev => updateState(prev, { ...newData, date: (newData as Announcement).date || new Date().toISOString().split('T')[0] }));
                break;
            case 'member':
                setMembers(prev => updateState(prev, { ...newData, status: (newData as CouncilMember).status || 'Active' }));
                break;
            case 'club':
                setClubs(prev => updateState(prev, { ...newData, members: (newData as Club).members || 0 }));
                break;
            case 'event':
                setEvents(prev => updateState(prev, newData));
                break;
            case 'election':
                setElections(prev => updateState(prev, { ...newData, candidates: (newData as any).candidates || [] }));
                break;
            case 'achievement':
                setAchievements(prev => updateState(prev, { ...newData, image: (newData as any).image || '' }));
                break;
            case 'user':
                setUsers(prev => {
                    const exists = prev.find(u => u.id === itemId);
                    if (exists) {
                        return prev.map(u => u.id === itemId ? { ...u, ...formData } as User : u);
                    }
                    return prev;
                });
                break;
        }
        setIsAddModalOpen(false);
    };

    if (!isAuthorized) {
        return <div className="min-h-screen bg-black" />;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 relative">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                                President's Office
                            </h1>
                            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Authorized</Badge>
                        </div>
                        <p className="text-gray-400">Manage campus activities, board members, and announcements.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Quick Access Hamburger */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                className="border-white/20 hover:bg-white/10 text-white"
                                onClick={() => setActiveTab(activeTab === 'quick-access' ? 'announcements' : 'quick-access')} // Toggle state or simplified logic
                            >
                                <Menu className="w-4 h-4 mr-2" /> Quick Access
                            </Button>
                            {/* Note: User asked for a hamburger menu. I will implement a dropdown below. */}
                            {activeTab === 'quick-access' && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 p-1">
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Links</div>
                                    <Link href="/complaints">
                                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                            <FileText className="w-4 h-4 text-red-500" />
                                            Submit Complaint
                                        </div>
                                    </Link>
                                    <Link href="/marketplace">
                                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                            <ShoppingBag className="w-4 h-4 text-yellow-500" />
                                            Sell Item
                                        </div>
                                    </Link>
                                    <Link href="/feedback">
                                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                            <BarChart2 className="w-4 h-4 text-blue-500" />
                                            Take Survey
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => {
                                localStorage.removeItem('userRole');
                                router.push('/login');
                            }}
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="overflow-x-auto pb-2">
                        <TabsList className="bg-white/5 border border-white/10 p-1">
                            <TabsTrigger value="announcements" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><Megaphone className="w-4 h-4 mr-2" /> Announcements</TabsTrigger>
                            <TabsTrigger value="members" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><Users className="w-4 h-4 mr-2" /> Council Members</TabsTrigger>
                            <TabsTrigger value="clubs" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><Flag className="w-4 h-4 mr-2" /> Clubs</TabsTrigger>
                            <TabsTrigger value="events" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><Calendar className="w-4 h-4 mr-2" /> Events</TabsTrigger>
                            <TabsTrigger value="elections" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><Vote className="w-4 h-4 mr-2" /> Elections</TabsTrigger>
                            <TabsTrigger value="achievements" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><Trophy className="w-4 h-4 mr-2" /> Achievements</TabsTrigger>
                            <TabsTrigger value="complaints" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><MessageSquare className="w-4 h-4 mr-2" /> Complaints</TabsTrigger>
                            <TabsTrigger value="students" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"><Users className="w-4 h-4 mr-2" /> Students</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Announcements Content */}
                    <TabsContent value="announcements" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Public Announcements</h2>
                            <Button onClick={() => openAddModal('announcement')} className="bg-yellow-500 text-black hover:bg-yellow-400"><Plus className="w-4 h-4 mr-2" /> New Announcement</Button>
                        </div>
                        <div className="grid gap-4">
                            {announcements.map((item) => (
                                <Card key={item.id} className="bg-white/5 border-white/10 hover:border-yellow-500/50 transition-colors">
                                    <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold">{item.title}</h3>
                                                <Badge variant="outline" className={item.priority === 'High' ? 'text-red-500 border-red-500' : 'text-blue-500 border-blue-500'}>{item.priority}</Badge>
                                                <Badge variant="secondary" className="bg-white/10 text-gray-300">{item.category || 'General'}</Badge>
                                            </div>
                                            <p className="text-gray-400 mb-2">{item.content}</p>
                                            <p className="text-xs text-gray-500">Posted: {item.date}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openAddModal('announcement', item)} className="border-white/20 text-gray-300 hover:text-white mb-2 md:mb-0">
                                                Edit
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete('announcement', item.id)} className="text-red-500 hover:bg-red-500/10 hover:text-red-400 self-start md:self-center bg-black/20">
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {announcements.length === 0 && <p className="text-gray-500 italic">No active announcements.</p>}
                        </div>
                    </TabsContent>

                    {/* Council Members Content */}
                    <TabsContent value="members" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Council Members</h2>
                            <Button onClick={() => openAddModal('member')} className="bg-yellow-500 text-black hover:bg-yellow-400"><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {members.map((member) => (
                                <Card key={member.id} className="bg-white/5 border-white/10">
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-2 overflow-hidden border border-yellow-500/30">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="w-8 h-8" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{member.name}</h3>
                                            <p className="text-yellow-500 text-sm">{member.role}</p>
                                            <p className="text-gray-500 text-xs mt-1">{member.email}</p>
                                        </div>
                                        <div className="flex gap-2 w-full mt-2">
                                            <Button variant="outline" size="sm" onClick={() => openAddModal('member', member)} className="flex-1 border-white/20 text-gray-300 hover:text-white">Edit</Button>
                                            <Button variant="ghost" size="sm" onClick={() => confirmDelete('member', member.id)} className="flex-1 text-red-500 hover:text-red-400">Remove</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Clubs Content */}
                    <TabsContent value="clubs" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Student Clubs</h2>
                            <Button onClick={() => openAddModal('club')} className="bg-yellow-500 text-black hover:bg-yellow-400"><Plus className="w-4 h-4 mr-2" /> Register Club</Button>
                        </div>
                        <div className="grid gap-4">
                            {clubs.map((club) => (
                                <Card key={club.id} className="bg-white/5 border-white/10">
                                    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center">
                                                <Flag className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{club.name}</h3>
                                                <p className="text-sm text-gray-400">{club.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">Lead: {club.lead} • {club.members} Members</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openAddModal('club', club)} className="border-white/20 text-gray-300 hover:text-white">
                                                Edit
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete('club', club.id)} className="text-red-500 hover:bg-red-500/10">
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Events Content */}
                    <TabsContent value="events" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Upcoming Events</h2>
                            <Button onClick={() => openAddModal('event')} className="bg-yellow-500 text-black hover:bg-yellow-400"><Plus className="w-4 h-4 mr-2" /> Create Event</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((event) => (
                                <Card key={event.id} className="bg-white/5 border-white/10 group relative overflow-hidden">
                                    {event.image ? (
                                        <div className="h-32 w-full relative">
                                            <img src={event.image} alt={event.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                                            <div className="absolute bottom-2 left-4">
                                                <Badge variant="outline" className="border-white/20 bg-black/50 backdrop-blur-md">{event.type}</Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                                    )}
                                    <CardContent className={`p-6 ${event.image ? 'pt-4' : 'pl-8'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            {!event.image && <Badge variant="outline" className="border-white/20">{event.type}</Badge>}
                                            <div className="flex items-center gap-1 -mt-2 -mr-2 ml-auto z-10 relative">
                                                <Button variant="ghost" size="sm" onClick={() => openAddModal('event', event)} className="text-gray-300 hover:text-white h-8 px-2">
                                                    Edit
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => confirmDelete('event', event.id)} className="text-red-500 hover:bg-red-500/10 h-8 w-8">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                            <Star className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                        {event.registrationLink && (
                                            <div className="mt-3 pt-3 border-t border-white/10">
                                                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 font-medium">
                                                    <ExternalLink className="w-3 h-3" />
                                                    Registration Link
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Elections Content */}
                    <TabsContent value="elections" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Elections</h2>
                            <Button onClick={() => openAddModal('election')} className="bg-yellow-500 text-black hover:bg-yellow-400"><Plus className="w-4 h-4 mr-2" /> Schedule Election</Button>
                        </div>
                        <div className="grid gap-4">
                            {elections.map((election) => (
                                <Card key={election.id} className="bg-white/5 border-white/10">
                                    <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold">{election.title}</h3>
                                                <Badge variant="outline" className={election.status === 'Ongoing' ? 'text-green-500 border-green-500' : 'text-gray-500 border-gray-500'}>{election.status}</Badge>
                                            </div>
                                            <p className="text-gray-400 mb-2">{election.description}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                {election.date}
                                            </div>

                                            {/* Results Section */}
                                            {election.candidates && election.candidates.length > 0 && (
                                                <div className="mt-4 space-y-3">
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Results</h4>
                                                    <div className="space-y-2">
                                                        {election.candidates.map(candidate => {
                                                            const totalVotes = election.candidates.reduce((sum: number, c: any) => sum + (c.votes || 0), 0);
                                                            // Percentage based on total registered users
                                                            const percentage = totalUsers > 0 ? Math.round(((candidate.votes || 0) / totalUsers) * 100) : 0;
                                                            return (
                                                                <div key={candidate.id} className="space-y-1">
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-gray-300">{candidate.name}</span>
                                                                        <span className="font-mono text-yellow-500">{candidate.votes || 0} votes ({percentage}%)</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                                                                            style={{ width: `${percentage}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => confirmDelete('election', election.id)} className="text-red-500 hover:bg-red-500/10 self-start md:self-center">
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Achievements Content */}
                    <TabsContent value="achievements" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Hall of Fame</h2>
                            <Button onClick={() => openAddModal('achievement')} className="bg-yellow-500 text-black hover:bg-yellow-400"><Plus className="w-4 h-4 mr-2" /> Add Achievement</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {achievements.map((achievement) => (
                                <Card key={achievement.id} className="bg-white/5 border-white/10 overflow-hidden">
                                    <div className="h-40 bg-zinc-900 relative">
                                        {achievement.image ? (
                                            <img src={achievement.image} alt={achievement.title} className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-yellow-500/10 text-yellow-500">
                                                <Trophy className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-black/50 text-white border-white/10 backdrop-blur-md">{achievement.category}</Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg">{achievement.title}</h3>
                                                <p className="text-yellow-500 text-sm">{achievement.student}</p>
                                            </div>
                                            <div className="flex items-center gap-1 -mt-2 -mr-2">
                                                <Button variant="ghost" size="sm" onClick={() => openAddModal('achievement', achievement)} className="text-gray-300 hover:text-white h-8 px-2">
                                                    Edit
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => confirmDelete('achievement', achievement.id)} className="text-red-500 hover:bg-red-500/10 h-8 w-8">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2">{achievement.description}</p>
                                        <div className="mt-4 text-xs text-gray-500">{achievement.date}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Complaints Content */}
                    <TabsContent value="complaints" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Student Complaints</h2>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                                    {tickets.filter(t => t.status === 'Pending').length} Pending
                                </Badge>
                                <Badge variant="outline" className="border-blue-500 text-blue-500">
                                    {tickets.filter(t => t.status === 'In Progress').length} In Progress
                                </Badge>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {tickets.length === 0 ? (
                                <p className="text-gray-500 italic">No complaints found.</p>
                            ) : (
                                tickets.map((ticket) => (
                                    <Card key={ticket.id} className="bg-white/5 border-white/10 hover:border-yellow-500/30 transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-mono text-xs text-gray-500">{ticket.id}</span>
                                                                <Badge className={`${ticket.priority === 'High' ? 'bg-red-500/20 text-red-500' :
                                                                    ticket.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                        'bg-blue-500/20 text-blue-500'
                                                                    }`}>
                                                                    {ticket.priority}
                                                                </Badge>
                                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <ThumbsUp className="w-3 h-3 text-yellow-500" />
                                                                    {ticket.votes || 0} Votes
                                                                </span>
                                                                <Badge variant="outline" className="border-white/20 text-gray-400">
                                                                    {ticket.department}
                                                                </Badge>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-white">{ticket.subject}</h3>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-400 text-sm line-clamp-3">{ticket.description}</p>

                                                    {ticket.image && (
                                                        <div className="mt-2">
                                                            <a href={ticket.image} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-yellow-500 hover:underline">
                                                                <FileText className="w-3 h-3 mr-1" /> View Attachment
                                                            </a>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-white/5">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {ticket.studentName}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 min-w-[200px]">
                                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                                        <span className="text-xs text-gray-500 block mb-2">Current Status</span>
                                                        <Badge className={`w-full justify-center py-1 mb-3 ${ticket.status === 'Completed' ? 'bg-green-500 text-black' :
                                                            ticket.status === 'In Progress' ? 'bg-blue-500 text-white' :
                                                                ticket.status === 'In Review' ? 'bg-purple-500 text-white' :
                                                                    'bg-yellow-500 text-black'
                                                            }`}>
                                                            {ticket.status}
                                                        </Badge>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            {ticket.status !== 'In Progress' && ticket.status !== 'Completed' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 text-xs border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                                                                    onClick={() => updateTicketStatus(ticket.id, 'In Progress')}
                                                                >
                                                                    Start
                                                                </Button>
                                                            )}
                                                            {ticket.status !== 'Completed' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 text-xs border-green-500/50 text-green-500 hover:bg-green-500/10"
                                                                    onClick={() => updateTicketStatus(ticket.id, 'Completed')}
                                                                >
                                                                    Resolve
                                                                </Button>
                                                            )}
                                                            {ticket.status === 'Completed' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-8 text-xs border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 col-span-2"
                                                                    onClick={() => updateTicketStatus(ticket.id, 'In Progress', 'Reopened by President')}
                                                                >
                                                                    Reopen
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Students Content */}
                    <TabsContent value="students" className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <Card className="flex-1 bg-white/5 border-white/10">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Total Users</p>
                                        <h3 className="text-3xl font-bold text-white">{users.length}</h3>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-500" />
                                </CardContent>
                            </Card>
                            <Card className="flex-1 bg-white/5 border-white/10">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Suspended Users</p>
                                        <h3 className="text-3xl font-bold text-white">{users.filter(u => u.status === 'Suspended').length}</h3>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4">
                            {users.map((user) => (
                                <Card key={user.id} className="bg-white/5 border-white/10">
                                    <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
                                                    <Badge className={user.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                                                        {user.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-400">{user.email}</p>
                                                <p className="text-xs text-gray-500">Joined: {user.joinedDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openAddModal('user', user)} className="border-white/20 text-gray-300 hover:text-white">
                                                Edit
                                            </Button>
                                            {user.status === 'Active' ? (
                                                <Button variant="outline" size="sm" onClick={() => setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Suspended' } : u))} className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                                                    Suspend
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" onClick={() => setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Active' } : u))} className="border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-400">
                                                    Activate
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => confirmDelete('user', user.id)} className="text-red-500 hover:bg-red-500/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* --- Modals --- */}

                {/* Add Item Modal */}
                <GlassModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title={`Add New ${addModalType}`}
                    footer={
                        <>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="border-white/20 hover:bg-white/10 hover:text-white">Cancel</Button>
                            <Button onClick={handleSave} className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                                <CheckCircle className="w-4 h-4 mr-2" /> Save Item
                            </Button>
                        </>
                    }
                >
                    <form id="add-form" className="space-y-4">
                        {addModalType === 'announcement' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Title</label>
                                    <Input required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50 transition-colors" placeholder="e.g. Semester Dates" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Content</label>
                                    <Textarea required value={formData.content || ''} onChange={(e: any) => setFormData({ ...formData, content: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50 transition-colors" placeholder="Announcement details..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Category</label>
                                    <select value={formData.category || 'General'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-yellow-500/50 outline-none">
                                        <option value="General">General</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Event">Event</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Priority</label>
                                    <select value={formData.priority || 'Low'} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-yellow-500/50 outline-none">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {addModalType === 'member' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                                    <Input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Role</label>
                                    <Input required value={formData.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" placeholder="e.g. Secretary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <Input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>

                                {/* Photo Upload Section */}
                                <div className="space-y-4 pt-2 border-t border-white/10">
                                    <label className="text-sm font-medium text-gray-300">Member Photo (Optional)</label>

                                    {!isCameraOpen && !formData.image && (
                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('member-file-upload')?.click()}
                                                className="border-white/10 hover:bg-white/5 bg-black/50"
                                            >
                                                <input
                                                    id="member-file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                />
                                                <Upload className="w-4 h-4 mr-2" /> Upload Photo
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={startCamera}
                                                className="border-white/10 hover:bg-white/5 bg-black/50"
                                            >
                                                <Camera className="w-4 h-4 mr-2" /> Use Camera
                                            </Button>
                                        </div>
                                    )}

                                    {isCameraOpen && (
                                        <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden max-w-md mx-auto">
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                                            <canvas ref={canvasRef} className="hidden" />
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                                <Button type="button" onClick={() => capturePhoto(false)} className="bg-yellow-500 text-black hover:bg-yellow-400">
                                                    <Camera className="w-4 h-4 mr-2" /> Capture
                                                </Button>
                                                <Button type="button" onClick={stopCamera} variant="destructive" className="bg-red-500 hover:bg-red-600">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {formData.image && (
                                        <div className="relative inline-block">
                                            <img src={formData.image} alt="Member Preview" className="h-24 w-24 rounded-full border-2 border-yellow-500/50 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(false)}
                                                className="absolute 0 0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                                                style={{ top: '0', right: '0' }}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {addModalType === 'user' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">First Name</label>
                                        <Input required value={formData.firstName || ''} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Last Name</label>
                                        <Input required value={formData.lastName || ''} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <Input required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Status</label>
                                    <select value={formData.status || 'Active'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white outline-none">
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {addModalType === 'club' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Club Name</label>
                                    <Input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <Input required value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Lead Student</label>
                                    <Input required value={formData.lead || ''} onChange={e => setFormData({ ...formData, lead: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Club Website (Optional)</label>
                                    <Input type="url" placeholder="https://" value={formData.website || ''} onChange={e => setFormData({ ...formData, website: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-4 pt-2 border-t border-white/10">
                                    <label className="text-sm font-medium text-gray-300">Club Logo (Optional)</label>

                                    {!isCameraOpen && !formData.image && (
                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('club-file-upload')?.click()}
                                                className="border-white/10 hover:bg-white/5 bg-black/50"
                                            >
                                                <input
                                                    id="club-file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(e)}
                                                />
                                                <Upload className="w-4 h-4 mr-2" /> Upload Logo
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => startCamera()}
                                                className="border-white/10 hover:bg-white/5 bg-black/50"
                                            >
                                                <Camera className="w-4 h-4 mr-2" /> Use Camera
                                            </Button>
                                        </div>
                                    )}

                                    {isCameraOpen && (
                                        <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden max-w-md mx-auto">
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                                            <canvas ref={canvasRef} className="hidden" />
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                                <Button type="button" onClick={() => capturePhoto(false)} className="bg-yellow-500 text-black hover:bg-yellow-400">
                                                    <Camera className="w-4 h-4 mr-2" /> Capture
                                                </Button>
                                                <Button type="button" onClick={stopCamera} variant="destructive" className="bg-red-500 hover:bg-red-600">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {formData.image && (
                                        <div className="relative inline-block">
                                            <img src={formData.image} alt="Club Logo" className="h-24 w-24 rounded-full border-2 border-yellow-500/50 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(false)}
                                                className="absolute 0 0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                                                style={{ top: '0', right: '0' }}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {addModalType === 'event' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Event Name</label>
                                    <Input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Date</label>
                                    <Input type="date" required value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" style={{ colorScheme: 'dark' }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Location</label>
                                    <Input required value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Type</label>
                                    <select value={formData.type || 'Social'} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-yellow-500/50 outline-none">
                                        <option value="Social">Social</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Sports">Sports</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Registration Link (Optional)</label>
                                    <Input type="url" placeholder="https://forms.gle/..." value={formData.registrationLink || ''} onChange={e => setFormData({ ...formData, registrationLink: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>

                                {/* Photo Upload Section */}
                                <div className="space-y-4 pt-2 border-t border-white/10">
                                    <label className="text-sm font-medium text-gray-300">Event Photo (Optional)</label>

                                    {!isCameraOpen && !formData.image && (
                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('event-file-upload')?.click()}
                                                className="border-white/10 hover:bg-white/5 bg-black/50"
                                            >
                                                <input
                                                    id="event-file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                />
                                                <Upload className="w-4 h-4 mr-2" /> Upload Photo
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={startCamera}
                                                className="border-white/10 hover:bg-white/5 bg-black/50"
                                            >
                                                <Camera className="w-4 h-4 mr-2" /> Use Camera
                                            </Button>
                                        </div>
                                    )}

                                    {isCameraOpen && (
                                        <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden max-w-md mx-auto">
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                                            <canvas ref={canvasRef} className="hidden" />
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                                <Button type="button" onClick={() => capturePhoto(false)} className="bg-yellow-500 text-black hover:bg-yellow-400">
                                                    <Camera className="w-4 h-4 mr-2" /> Capture
                                                </Button>
                                                <Button type="button" onClick={stopCamera} variant="destructive" className="bg-red-500 hover:bg-red-600">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {formData.image && (
                                        <div className="relative inline-block w-full">
                                            <img src={formData.image} alt="Event Preview" className="h-32 w-full rounded-lg border border-yellow-500/50 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(false)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {addModalType === 'election' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Election Title</label>
                                    <Input required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <Textarea required value={formData.description || ''} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Date</label>
                                    <Input type="date" required value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" style={{ colorScheme: 'dark' }} />
                                </div>
                                <div className="space-y-2">
                                    <select value={formData.status || 'Upcoming'} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-yellow-500/50 outline-none">
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-300">Candidates</label>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    id="candidate-input"
                                                    value={tempCandidateName}
                                                    onChange={(e) => setTempCandidateName(e.target.value)}
                                                    placeholder="Candidate Name"
                                                    className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        const val = tempCandidateName.trim();
                                                        if (val) {
                                                            const currentCandidates = formData.candidates || [];
                                                            setFormData({
                                                                ...formData,
                                                                candidates: [...currentCandidates, {
                                                                    id: Math.random().toString(36).slice(2, 9),
                                                                    name: val,
                                                                    votes: 0,
                                                                    image: tempCandidateImage
                                                                }]
                                                            });
                                                            setTempCandidateName('');
                                                            setTempCandidateImage(undefined);
                                                        }
                                                    }}
                                                    className="bg-yellow-500 text-black hover:bg-yellow-400"
                                                >
                                                    <Plus className="w-4 h-4" /> Add
                                                </Button>
                                            </div>

                                            {/* Candidate Photo Upload */}
                                            <div>
                                                {/* Photo Buttons */}
                                                {!isCameraOpen && !tempCandidateImage && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => document.getElementById('candidate-file-upload')?.click()}
                                                            className="text-xs border-white/10 hover:bg-white/5 bg-black/50"
                                                        >
                                                            <input
                                                                id="candidate-file-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(e, true)}
                                                            />
                                                            <Upload className="w-3 h-3 mr-2" /> Upload Photo
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={startCamera}
                                                            className="text-xs border-white/10 hover:bg-white/5 bg-black/50"
                                                        >
                                                            <Camera className="w-3 h-3 mr-2" /> Camera
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Camera View */}
                                                {isCameraOpen && (
                                                    <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden max-w-xs mx-auto mt-2">
                                                        <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                                                        <canvas ref={canvasRef} className="hidden" />
                                                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                                                            <Button size="sm" type="button" onClick={() => capturePhoto(true)} className="bg-yellow-500 text-black hover:bg-yellow-400 text-xs">
                                                                Capture
                                                            </Button>
                                                            <Button size="sm" type="button" onClick={stopCamera} variant="destructive" className="bg-red-500 hover:bg-red-600 text-xs">
                                                                Close
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Image Preview */}
                                                {tempCandidateImage && (
                                                    <div className="relative inline-block mt-2">
                                                        <img src={tempCandidateImage} alt="Candidate Preview" className="h-16 w-16 rounded-full border border-yellow-500/50 object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(true)}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-lg"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        <div className="space-y-2 mt-2">
                                            {(formData.candidates || []).map((cand: any) => (
                                                <div key={cand.id} className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/10">
                                                    <div className="flex items-center gap-2">
                                                        {cand.image && <img src={cand.image} alt={cand.name} className="w-6 h-6 rounded-full object-cover" />}
                                                        <span className="text-sm">{cand.name}</span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            const currentCandidates = formData.candidates || [];
                                                            setFormData({
                                                                ...formData,
                                                                candidates: currentCandidates.filter((c: any) => c.id !== cand.id)
                                                            });
                                                        }}
                                                        className="text-red-500 h-6 w-6 p-0 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {addModalType === 'achievement' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Achievement Title</label>
                                    <Input required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Student/Team Name</label>
                                    <Input required value={formData.student || ''} onChange={e => setFormData({ ...formData, student: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <Textarea required value={formData.description || ''} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Category</label>
                                    <select value={formData.category || 'Academic'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:border-yellow-500/50 outline-none">
                                        <option value="Academic">Academic</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Research">Research</option>
                                        <option value="Cultural">Cultural</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Date</label>
                                    <Input required value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50" placeholder="e.g. March 2025" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Image (Max 500KB)</label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 512000) { // 500KB limit
                                                    alert("File size exceeds 500KB. Please upload a smaller image.");
                                                    e.target.value = ''; // Clear input
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setCroppingImage(reader.result as string);
                                                    setIsCandidateCrop(false);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="bg-black/50 border-white/10 text-white focus:border-yellow-500/50 file:bg-yellow-500 file:text-black file:border-0 file:rounded-md file:mr-4 file:px-2 file:py-1 file:text-sm file:font-semibold hover:file:bg-yellow-400"
                                    />
                                    {formData.image && (
                                        <p className="text-xs text-green-500 mt-1">Image loaded successfully!</p>
                                    )}
                                </div>
                            </>
                        )}
                    </form>
                </GlassModal>

                {/* Delete Confirmation Modal */}
                <GlassModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Deletion"
                    variant="danger"
                    footer={
                        <>
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="border-white/20 hover:bg-white/10 hover:text-white">Cancel</Button>
                            <Button onClick={executeDelete} className="bg-red-600 text-white hover:bg-red-700 font-bold border-none">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Item
                            </Button>
                        </>
                    }
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-white mb-2">Are you sure?</p>
                            <p className="text-gray-400">
                                This action cannot be undone. This default item will be permanently removed from the database.
                            </p>
                        </div>
                    </div>
                </GlassModal>

            </div>
            {
                croppingImage && (
                    <ImageCropper
                        image={croppingImage}
                        onCropComplete={handleCropComplete}
                        onCancel={() => setCroppingImage(null)}
                        aspectRatio={isCandidateCrop ? 1 : (addModalType === 'event' || addModalType === 'achievement') ? 16 / 9 : 1}
                    />
                )
            }
        </div >
    );
}

export default function PresidentDashboard() {
    return (
        <TicketProvider>
            <PresidentDashboardContent />
        </TicketProvider>
    );
}
