'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Sun, Moon, Settings, LayoutDashboard, Shield, Bell, Monitor, LogOut, Crown, Megaphone, Calendar, Vote, MessageCircleWarning, Users, Trophy, ShoppingBag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Council', href: '/council' },
    { name: 'Members', href: '/members' },
    { name: 'Announcements', href: '/announcements' },
    { name: 'Events', href: '/events' },
    { name: 'Complaints', href: '/complaints' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const pathname = usePathname();
    const { scrollY } = useScroll();

    useEffect(() => {
        // Check authentication status on mount and path change
        const checkAuth = () => {
            const role = localStorage.getItem('userRole');
            const name = localStorage.getItem('userName');
            if (role && name) {
                setIsLoggedIn(true);
                setUserName(name);
                setUserRole(role);
            } else {
                setIsLoggedIn(false);
                setUserName('');
                setUserRole('');
            }
        };

        checkAuth();

        // Listen for custom auth-change event (triggered by login/logout)
        window.addEventListener('auth-change', checkAuth);
        return () => window.removeEventListener('auth-change', checkAuth);
    }, [pathname]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
                isScrolled
                    ? "bg-black/60 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    : "bg-transparent py-6"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300">
                        N
                    </div>
                    <div className="flex flex-col relative z-10">
                        <span className="text-xl font-bold tracking-tight text-white leading-none group-hover:text-yellow-400 transition-colors">NSGC</span>
                        <span className="text-xs text-gray-400 uppercase tracking-widest group-hover:text-gray-300 transition-colors">Student Council</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative group"
                        >
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors relative z-10">
                                {item.name}
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 ease-out group-hover:w-full" />
                            <span className="absolute inset-0 -z-10 scale-0 rounded-lg bg-white/5 transition-transform duration-300 group-hover:scale-150 blur-lg" />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/5 rounded-full">
                        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            {userRole === 'president' && (
                                <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-full border border-yellow-500/20" asChild>
                                    <Link href="/dashboard/president">
                                        <Crown className="w-4 h-4" />
                                        President's Office
                                    </Link>
                                </Button>
                            )}
                            {userRole === 'council' && (
                                <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full border border-blue-500/20" asChild>
                                    <Link href="/dashboard/council">
                                        <Users className="w-4 h-4" />
                                        Council Dashboard
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-full" asChild>
                                <Link href="/dashboard/student">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </Button>
                            <span className="text-sm font-medium text-white hidden sm:inline-block">Hello, {userName}</span>
                            <div className="relative group">
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/5 rounded-full" title="Quick Access">
                                    <Menu className="w-5 h-5" />
                                </Button>
                                {/* Quick Access Dropdown */}
                                <div className="absolute right-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden p-1">
                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Access</div>
                                        <div className="grid grid-cols-2 gap-1 p-1">
                                            <Link href="/announcements" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <Megaphone className="w-5 h-5 text-blue-500" />
                                                Announcements
                                            </Link>
                                            <Link href="/events" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <Calendar className="w-5 h-5 text-green-500" />
                                                Events
                                            </Link>
                                            <Link href="/elections" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <Vote className="w-5 h-5 text-yellow-500" />
                                                Elections
                                            </Link>
                                            <Link href="/complaints" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <MessageCircleWarning className="w-5 h-5 text-red-500" />
                                                Complaints
                                            </Link>
                                            <Link href="/clubs" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <Users className="w-5 h-5 text-purple-500" />
                                                Clubs
                                            </Link>
                                            <Link href="/achievements" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <Trophy className="w-5 h-5 text-orange-500" />
                                                Achievements
                                            </Link>
                                            <Link href="/marketplace" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <ShoppingBag className="w-5 h-5 text-pink-500" />
                                                Marketplace
                                            </Link>
                                            <Link href="/feedback" className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-center">
                                                <MessageSquare className="w-5 h-5 text-cyan-500" />
                                                Feedback
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group">
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/5 rounded-full" title="Settings" asChild>
                                    <Link href="/settings">
                                        <Settings className="w-5 h-5" />
                                    </Link>
                                </Button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden p-1">
                                        <Link href="/settings?tab=profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                            <User className="w-4 h-4 text-yellow-500" />
                                            Profile
                                        </Link>
                                        <Link href="/settings?tab=security" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                            <Shield className="w-4 h-4 text-yellow-500" />
                                            Security
                                        </Link>
                                        <Link href="/settings?tab=notifications" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                            <Bell className="w-4 h-4 text-yellow-500" />
                                            Notifications
                                        </Link>
                                        <Link href="/settings?tab=appearance" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                            <Monitor className="w-4 h-4 text-yellow-500" />
                                            Appearance
                                        </Link>

                                        <div className="h-px bg-white/10 my-1 mx-2" />

                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('userRole');
                                                localStorage.removeItem('userName');
                                                window.dispatchEvent(new Event('auth-change'));
                                                // Assuming router is available in scope or use window.location
                                                window.location.href = '/login';
                                            }}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button variant="outline" className="gap-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black rounded-full px-6 transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]" asChild>
                            <Link href="/login">
                                <User className="w-4 h-4" />
                                Login
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5 block"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {isLoggedIn ? (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <div className="text-gray-400 text-sm mb-2">Signed in as <span className="text-white font-bold">{userName}</span></div>
                                        <Button className="w-full bg-white/10 text-white hover:bg-white/20 rounded-full h-12 text-lg font-medium justify-start px-6" asChild>
                                            <Link href="/dashboard/student">
                                                <LayoutDashboard className="w-5 h-5 mr-3" />
                                                Dashboard
                                            </Link>
                                        </Button>
                                        <Button className="w-full bg-white/10 text-white hover:bg-white/20 rounded-full h-12 text-lg font-medium justify-start px-6" asChild>
                                            <Link href="/settings">
                                                <Settings className="w-5 h-5 mr-3" />
                                                Settings
                                            </Link>
                                        </Button>
                                        <Button
                                            className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full h-12 text-lg font-medium justify-start px-6"
                                            onClick={() => {
                                                localStorage.removeItem('userRole');
                                                localStorage.removeItem('userName');
                                                window.dispatchEvent(new Event('auth-change'));
                                                // Using window.location to force full reload/navigation or use router if available, but router is top level variable
                                                // Since we are in the component, router is available from hook at top of file
                                                window.location.href = '/login';
                                            }}
                                        >
                                            <LogOut className="w-5 h-5 mr-3" />
                                            Log Out
                                        </Button>
                                    </div>
                                ) : (
                                    <Button className="w-full mt-4 bg-yellow-500 text-black hover:bg-yellow-400 rounded-full h-12 text-lg font-bold" asChild>
                                        <Link href="/login">
                                            Login
                                        </Link>
                                    </Button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav >
    );
}
