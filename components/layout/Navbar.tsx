'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Sun, Moon } from 'lucide-react';
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
    const { scrollY } = useScroll();

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
                    <Button variant="outline" className="gap-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black rounded-full px-6 transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                        <User className="w-4 h-4" />
                        Login
                    </Button>
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
                                <Button className="w-full mt-4 bg-yellow-500 text-black hover:bg-yellow-400 rounded-full h-12 text-lg font-bold">
                                    Login
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
