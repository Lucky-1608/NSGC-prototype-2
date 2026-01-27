'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Users, ArrowRight } from 'lucide-react';

export default function CouncilLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Server-Side Verification
        import('@/app/actions/auth').then(async ({ universalLogin }) => {
            const result = await universalLogin(email, password);
            if (result.success && result.role) {
                localStorage.setItem('userRole', result.role);
                localStorage.setItem('userName', result.userName || 'User');
                window.dispatchEvent(new Event('auth-change'));
                router.push(`/dashboard/${result.role}`);
            } else {
                alert('Invalid Credentials');
                setLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            <Card className="w-full max-w-md bg-white/5 border-white/10 relative z-10 border-t-4 border-t-blue-500">
                <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Council Access</CardTitle>
                    <CardDescription>Secure login for Council Members</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Council Email</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="member@council.nsgc.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white hover:bg-blue-500 font-bold"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Access Dashboard'}
                            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-400">
                        <Link href="/login" className="hover:text-white transition-colors">Return to Main Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
