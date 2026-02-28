'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, FileText, Send, Search, Lock, Camera, X, Image as ImageIcon, Upload, Users, ThumbsUp } from 'lucide-react';
import { useTickets, TicketProvider } from '@/lib/ticket-context';
import { useRef } from 'react';

function ComplaintsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { createTicket, updateTicketContent, tickets, upvoteTicket } = useTickets();
    const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'details' | 'community'>('submit');
    const [complaintId, setComplaintId] = useState('');
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        category: 'Academic',
        department: '',
        subject: '',
        description: '',
        isAnonymous: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedId, setSubmittedId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

    // Photo State
    const [image, setImage] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Check for authentication
        const userRole = localStorage.getItem('userRole');
        if (userRole) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);

    // Check for track, view or edit param
    useEffect(() => {
        const trackId = searchParams.get('track');
        const viewId = searchParams.get('view');
        const editParamId = searchParams.get('edit');

        if (editParamId && tickets.length > 0) {
            const foundTicket = tickets.find(t => t.id === editParamId);
            if (foundTicket) {
                setActiveTab('submit');
                setEditId(foundTicket.id);
                setFormData({
                    category: foundTicket.type,
                    department: foundTicket.department || '',
                    subject: foundTicket.subject || '',
                    description: foundTicket.description || '',
                    isAnonymous: foundTicket.studentName === 'Anonymous'
                });
                setImage(foundTicket.image || null);
            }
        } else if (viewId && tickets.length > 0) {
            const foundTicket = tickets.find(t => t.id === viewId);
            if (foundTicket) {
                setActiveTab('details');
                setTrackingResult({
                    id: foundTicket.id,
                    status: foundTicket.status,
                    date: new Date(foundTicket.createdAt).toLocaleDateString(),
                    title: foundTicket.type,
                    subject: foundTicket.subject,
                    department: foundTicket.department,
                    description: foundTicket.description,
                    timeline: foundTicket.timeline,
                    image: foundTicket.image
                });
            }
        } else if (trackId && tickets.length > 0) {
            const foundTicket = tickets.find(t => t.id === trackId);
            if (foundTicket) {
                setActiveTab('track');
                setComplaintId(trackId);
                setTrackingResult({
                    id: foundTicket.id,
                    status: foundTicket.status,
                    date: new Date(foundTicket.createdAt).toLocaleDateString(),
                    title: foundTicket.type,
                    subject: foundTicket.subject,
                    department: foundTicket.department,
                    description: foundTicket.description,
                    timeline: foundTicket.timeline,
                    image: foundTicket.image
                });
            }
        }
    }, [searchParams, tickets]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }));
    };

    // Camera & Image Handlers
    const startCamera = async () => {
        try {
            setIsCameraOpen(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please check permissions.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                // Set canvas dimensions to match video
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setImage(dataUrl);
                stopCamera();
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File size too large. Max 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setImage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Basic validation
            if (!formData.department || !formData.subject || !formData.description) {
                alert('Please fill in all required fields'); // Ideally use toast
                setIsSubmitting(false);
                return;
            }

            if (editId) {
                // Update existing ticket
                updateTicketContent(editId, {
                    studentName: formData.isAnonymous ? 'Anonymous' : (localStorage.getItem('userName') || 'Student'),
                    email: formData.isAnonymous ? 'anonymous@example.com' : 'student@example.com',
                    department: formData.department,
                    type: formData.category,
                    subject: formData.subject,
                    description: formData.description,
                    image: image || undefined
                });

                // Show success modal
                setShowUpdateSuccess(true);
                // Reset edit state but keep modal open until user navigates
                setEditId(null);
                setFormData({
                    category: 'Academic',
                    department: '',
                    subject: '',
                    description: '',
                    isAnonymous: false
                });

            } else {
                // Create ticket via context
                const newId = createTicket({
                    studentName: formData.isAnonymous ? 'Anonymous' : (localStorage.getItem('userName') || 'Student'),
                    email: formData.isAnonymous ? 'anonymous@example.com' : 'student@example.com',
                    department: formData.department, // In real app, map to specific enum if needed
                    type: formData.category,
                    subject: formData.subject,
                    description: formData.description,
                    priority: 'Medium', // Default priority
                    proofUrl: '',
                    image: image || undefined
                });

                // Set submitted ID to show success message
                setSubmittedId(newId);

                // Reset form
                setFormData({
                    category: 'Academic',
                    department: '',
                    subject: '',
                    description: '',
                    isAnonymous: false
                });
            }

        } catch (error) {
            console.error('Failed to submit complaint', error);
            alert('Failed to submit complaint. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        const foundTicket = tickets.find(t => t.id === complaintId);

        if (foundTicket) {
            setTrackingResult({
                id: foundTicket.id,
                status: foundTicket.status,
                date: new Date(foundTicket.createdAt).toLocaleDateString(),
                title: foundTicket.type, // Mapping category/type to title for display
                subject: foundTicket.subject,
                department: foundTicket.department,
                description: foundTicket.description,
                timeline: foundTicket.timeline,
                image: foundTicket.image
            });
        } else {
            setTrackingResult(null);
            alert('Complaint ID not found.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white/5 border-white/10">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-cyan-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Authentication Required</CardTitle>
                        <CardDescription>
                            You must be logged in to submit or track complaints.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/login">
                            <Button className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold">
                                Login to Continue
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Grievance Redressal</h1>
                    <p className="text-gray-400">We are here to listen and resolve your concerns.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/5 p-1 rounded-lg inline-flex overflow-x-auto max-w-full">
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={`px-4 sm:px-8 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'submit'
                                ? 'bg-cyan-500 text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Submit Complaint
                        </button>
                        <button
                            onClick={() => setActiveTab('track')}
                            className={`px-4 sm:px-8 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'track'
                                ? 'bg-cyan-500 text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Search className="w-4 h-4" />
                            Track Status
                        </button>
                        <button
                            onClick={() => setActiveTab('community')}
                            className={`px-4 sm:px-8 py-3 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'community'
                                ? 'bg-cyan-500 text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Community
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
                    {activeTab === 'submit' && (
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle>{editId ? 'Edit Complaint' : 'New Complaint'}</CardTitle>
                                <CardDescription>{editId ? 'Update your complaint details below.' : 'Please provide detailed information to help us resolve the issue faster.'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {submittedId ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center space-y-4"
                                    >
                                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Complaint Submitted!</h3>
                                        <p className="text-gray-300">
                                            Your complaint has been registered successfully. You can track its status using the Ticket ID below.
                                        </p>
                                        <div className="bg-black/50 p-4 rounded-md border border-white/10 inline-block">
                                            <span className="text-gray-400 text-sm block mb-1">Ticket ID</span>
                                            <span className="text-2xl font-mono text-cyan-500 font-bold tracking-wider">{submittedId}</span>
                                        </div>
                                        <div className="pt-4 flex gap-4 justify-center">
                                            <Button
                                                variant="outline"
                                                className="border-white/10 hover:bg-white/5"
                                                onClick={() => setSubmittedId(null)}
                                            >
                                                Submit Another
                                            </Button>
                                            <Button
                                                className="bg-cyan-500 text-black hover:bg-cyan-400"
                                                onClick={() => {
                                                    setComplaintId(submittedId); // Auto-fill tracking ID
                                                    setSubmittedId(null);
                                                    setActiveTab('track');
                                                    // Optional: auto-search
                                                }}
                                            >
                                                Track Status
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Category</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                >
                                                    <option value="Academic">Academic</option>
                                                    <option value="Hostel">Hostel</option>
                                                    <option value="Sanitation">Sanitation</option>
                                                    <option value="Ragging">Ragging</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Department</label>
                                                <input
                                                    type="text"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                    placeholder="e.g. Computer Science"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                placeholder="Brief summary of the issue"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={5}
                                                className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                                placeholder="Detailed explanation..."
                                                required
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="anonymous"
                                                name="isAnonymous"
                                                checked={formData.isAnonymous}
                                                onChange={handleCheckboxChange}
                                                className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-black/50"
                                            />
                                            <label htmlFor="anonymous" className="text-sm text-gray-300">Submit Anonymously</label>
                                        </div>

                                        {/* Photo Upload Section */}
                                        <div className="space-y-4">
                                            <label className="text-sm font-medium text-gray-300">Attach Photo (Optional)</label>

                                            {!isCameraOpen && !image && (
                                                <div className="flex gap-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => document.getElementById('file-upload')?.click()}
                                                        className="border-white/10 hover:bg-white/5 bg-black/50"
                                                    >
                                                        <input
                                                            id="file-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleFileUpload}
                                                        />
                                                        <Upload className="w-4 h-4 mr-2" /> Upload File
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
                                                <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden max-w-md">
                                                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                                                    <canvas ref={canvasRef} className="hidden" />
                                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                                        <Button type="button" onClick={capturePhoto} className="bg-cyan-500 text-black hover:bg-cyan-400">
                                                            <Camera className="w-4 h-4 mr-2" /> Capture
                                                        </Button>
                                                        <Button type="button" onClick={stopCamera} variant="destructive" className="bg-red-500 hover:bg-red-600">
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {image && (
                                                <div className="relative inline-block">
                                                    <img src={image} alt="Complaint Attachment" className="h-40 w-auto rounded-lg border border-white/10 object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={removePhoto}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold py-6 text-lg"
                                            >
                                                {isSubmitting ? (editId ? 'Updating...' : 'Submitting...') : (editId ? 'Update Complaint' : 'Submit Complaint')} <Send className="ml-2 w-5 h-5" />
                                            </Button>
                                            {editId && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditId(null);
                                                        setFormData({
                                                            category: 'Academic',
                                                            department: '',
                                                            subject: '',
                                                            description: '',
                                                            isAnonymous: false
                                                        });
                                                        router.push('/complaints/history');
                                                    }}
                                                    className="w-1/3 border-white/20 hover:bg-white/10 py-6 text-lg"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'details' && trackingResult && (
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl">Complaint Details</CardTitle>
                                        <CardDescription>Details of your submission.</CardDescription>
                                    </div>
                                    <Link href={`/complaints?track=${trackingResult.id}`} onClick={(e) => { e.preventDefault(); setActiveTab('track'); setComplaintId(trackingResult.id); }} className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto border-white/20 text-cyan-500 hover:text-cyan-400 hover:bg-white/10">
                                            Track Status
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Category</label>
                                        <div className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white">
                                            {trackingResult.title}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Department</label>
                                        <div className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white">
                                            {trackingResult.department}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Subject</label>
                                    <div className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white">
                                        {trackingResult.subject || 'No Subject Provided'}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <div className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white min-h-[120px] whitespace-pre-wrap">
                                        {trackingResult.description}
                                    </div>
                                </div>

                                {trackingResult.image && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Attached Photo</label>
                                        <div>
                                            <img src={trackingResult.image} alt="Attachment" className="max-w-full h-auto max-h-[300px] rounded-lg border border-white/10" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'track' && (
                        <div className="space-y-8">
                            <Card className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle>Track Complaint</CardTitle>
                                    <CardDescription>Enter your Complaint ID to check the current status.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="text"
                                            value={complaintId}
                                            onChange={(e) => setComplaintId(e.target.value)}
                                            className="flex-grow bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500 w-full"
                                            placeholder="e.g. CMP-2025-001"
                                        />
                                        <Button type="submit" className="bg-cyan-500 text-black hover:bg-cyan-400 w-full sm:w-auto">
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
                                    <Card className="bg-white/5 border-white/10 border-l-4 border-l-cyan-500">
                                        <CardHeader>
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div>
                                                    <Badge variant="outline" className="mb-2 border-cyan-500 text-cyan-500">
                                                        {trackingResult.status}
                                                    </Badge>
                                                    <CardTitle className="text-xl break-words">{trackingResult.subject || trackingResult.title}</CardTitle>
                                                    <CardDescription>ID: {trackingResult.id} • Submitted on {trackingResult.date}</CardDescription>
                                                </div>
                                                <Link href={`/complaints?view=${trackingResult.id}`} onClick={(e) => { e.preventDefault(); setActiveTab('details'); }} className="w-full sm:w-auto">
                                                    <Button variant="ghost" className="w-full sm:w-auto text-cyan-500 hover:bg-white/10 justify-start sm:justify-center px-0 sm:px-4">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-white/5 p-4 rounded-lg mb-8 space-y-3">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-400 block">Category</span>
                                                        <span className="text-white font-medium">{trackingResult.title}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block">Department</span>
                                                        <span className="text-white font-medium">{trackingResult.department}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block text-sm mb-1">Description</span>
                                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{trackingResult.description}</p>
                                                </div>
                                            </div>

                                            {trackingResult.image && (
                                                <div className="bg-white/5 p-4 rounded-lg mb-8 space-y-2">
                                                    <span className="text-gray-400 block text-sm">Attachment</span>
                                                    <img src={trackingResult.image} alt="Attachment" className="max-w-full h-auto max-h-[200px] rounded-lg border border-white/10" />
                                                </div>
                                            )}

                                            <div className="relative pl-8 border-l border-white/10 space-y-8">
                                                {trackingResult.timeline.map((step: any, index: number) => (
                                                    <div key={index} className="relative">
                                                        <div className={`absolute -left-[37px] w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-cyan-500 border-cyan-500' : 'bg-black border-gray-600'}`} />
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

                    {activeTab === 'community' && (
                        <div className="space-y-6">
                            <Card className="bg-white/5 border-white/10 mb-6">
                                <CardHeader>
                                    <CardTitle>Community Complaints</CardTitle>
                                    <CardDescription>View, discuss, and support issues raised by other students. Upvote priority issues.</CardDescription>
                                </CardHeader>
                            </Card>

                            {[...tickets]
                                .sort((a, b) => (b.votes || 0) - (a.votes || 0)) // Sort by votes desc
                                .map((ticket) => (
                                    <Card key={ticket.id} className="bg-white/5 border-white/10 hover:border-cyan-500/30 transition-colors">
                                        <CardContent className="pt-6">
                                            <div className="flex gap-4">
                                                {/* Vote Section */}
                                                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const email = localStorage.getItem('userEmail') || 'anonymous@example.com';
                                                            // Since we don't have real auth user ID, using a mock 'current-user' or trying to use email if stored.
                                                            // For now, let's assume 'currentUser' for demo purposes if no unique ID available.
                                                            // Wait, we need a unique ID to limit 1 vote per user.
                                                            // Let's use 'demo-user' if nothing else.
                                                            upvoteTicket(ticket.id, 'demo-user');
                                                        }}
                                                        className={`h-auto p-2 flex flex-col gap-1 hover:bg-white/10 ${ticket.votedBy?.includes('demo-user') ? 'text-cyan-500' : 'text-gray-400'}`}
                                                    >
                                                        <ThumbsUp className={`w-5 h-5 ${ticket.votedBy?.includes('demo-user') ? 'fill-current' : ''}`} />
                                                        <span className="font-bold text-sm">{ticket.votes || 0}</span>
                                                    </Button>
                                                </div>

                                                <div className="flex-1 space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Badge variant="outline" className={`
                                                                    ${ticket.priority === 'High' ? 'border-red-500 text-red-500' :
                                                                        ticket.priority === 'Medium' ? 'border-cyan-500 text-cyan-500' :
                                                                            'border-blue-500 text-blue-500'}
                                                                `}>
                                                                    {ticket.priority} Priority
                                                                </Badge>
                                                                <Badge variant="secondary" className="bg-white/10 text-gray-300">
                                                                    {ticket.status}
                                                                </Badge>
                                                                <span className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <h3 className="text-lg font-bold">{ticket.subject}</h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-400 text-sm line-clamp-2">{ticket.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                                                        <span>{ticket.department}</span>
                                                        <span>•</span>
                                                        <span>{ticket.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                            {tickets.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No complaints found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Update Success Modal */}
                {
                    showUpdateSuccess && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gray-900 border border-cyan-500 rounded-lg max-w-sm w-full p-6 text-center shadow-2xl"
                            >
                                <div className="w-16 h-16 bg-cyan-500/20 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Update Successful!</h3>
                                <p className="text-gray-400 mb-6">
                                    Your complaint details have been updated successfully.
                                </p>
                                <Button
                                    className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold"
                                    onClick={() => {
                                        setShowUpdateSuccess(false);
                                        router.push('/complaints/history');
                                    }}
                                >
                                    Back to History
                                </Button>
                            </motion.div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default function ComplaintsPage() {
    return (
        <TicketProvider>
            <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div></div>}>
                <ComplaintsContent />
            </Suspense>
        </TicketProvider>
    );
}
