'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            <Card className="w-full max-w-md bg-white/5 border-white/10 relative z-10">
                <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                        N
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Join the NSGC community today</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">First Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    className="w-full bg-black/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                    placeholder="student@university.edu"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    className="w-full bg-black/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                            Create Account <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-400">
                        Already have an account? <Link href="/login" className="text-yellow-500 hover:underline">Sign in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
