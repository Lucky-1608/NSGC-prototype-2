'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TiltCard } from '@/components/ui/TiltCard';
import {
    Users,
    Building2,
    Calendar,
    Vote,
    MessageSquare,
    ShoppingBag,
    Megaphone,
    Trophy
} from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        title: "Representation",
        description: "Ensuring student voices shape campus policies and decisions.",
        icon: Users,
    },
    {
        title: "Campus Development",
        description: "Driving infrastructure improvements and facility upgrades.",
        icon: Building2,
    },
    {
        title: "Events & Culture",
        description: "Organizing fests, workshops, and cultural celebrations.",
        icon: Calendar,
    },
    {
        title: "Digital Governance",
        description: "Transparent, tech-driven management of student affairs.",
        icon: Vote,
    },
    {
        title: "Student Support",
        description: "Dedicated channels for complaints and grievance redressal.",
        icon: MessageSquare,
    },
    {
        title: "Clubs & Communities",
        description: "Supporting diverse student clubs and interest groups.",
        icon: Users,
    },
];

const quickLinks = [
    { name: "Announcements", icon: Megaphone, href: "/announcements" },
    { name: "Events", icon: Calendar, href: "/events" },
    { name: "Elections", icon: Vote, href: "/elections" },
    { name: "Complaints", icon: MessageSquare, href: "/complaints" },
    { name: "Clubs", icon: Users, href: "/clubs" },
    { name: "Achievements", icon: Trophy, href: "/achievements" },
    { name: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
    { name: "Feedback", icon: MessageSquare, href: "/feedback" },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function FeaturesSection() {
    return (
        <section className="py-20 bg-black">
            <div className="container mx-auto px-4">
                {/* What We Do */}
                <div className="mb-20">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">What We Do</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The NSGC works tirelessly to improve every aspect of student life.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((feature, index) => (
                            <motion.div key={feature.title} variants={item}>
                                <TiltCard className="h-full">
                                    <Card className="h-full hover:bg-white/5 transition-colors border-white/10 group bg-black/50 backdrop-blur-sm">
                                        <CardHeader>
                                            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4 text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                                                <feature.icon className="w-6 h-6" />
                                            </div>
                                            <CardTitle>{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base">
                                                {feature.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Quick Access */}
                <div>
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Access</h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {quickLinks.map((link, index) => (
                            <motion.div key={link.name} variants={item}>
                                <Link href={link.href}>
                                    <Card className="h-full hover:bg-yellow-500 hover:text-black transition-all border-white/10 flex flex-col items-center justify-center p-4 text-center gap-2 group cursor-pointer hover:scale-105 duration-300">
                                        <link.icon className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-medium">{link.name}</span>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
