'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb, Users, Shield } from 'lucide-react';
import { PageBackgroundSpace } from '@/components/solar/PageBackgroundSpace';
import ScrollAnimation from '@/components/ui/motion/ScrollAnimation';
import StaggeredList from '@/components/ui/motion/StaggeredList';
import TextReveal from '@/components/ui/motion/TextReveal';

export default function CouncilPage() {
    return (
        <PageBackgroundSpace>
            <div className="container mx-auto px-4 pt-24 pb-20">

                {/* Header */}
                <ScrollAnimation className="text-center mb-16" variant="fade-up">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <TextReveal text="About the Council" />
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        The National Student Governance Council (NSGC) is the premier student body dedicated to representing student interests, fostering leadership, and driving positive change on campus.
                    </p>
                </ScrollAnimation>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <ScrollAnimation variant="slide-in-left">
                        <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-500">
                                    <Target className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-3xl">Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    To empower every student by providing a transparent, inclusive, and effective platform for governance. We strive to bridge the gap between the administration and the student body, ensuring that every voice is heard and every concern is addressed with diligence and integrity.
                                </p>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>

                    <ScrollAnimation variant="slide-in-right">
                        <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-500">
                                    <Lightbulb className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-3xl">Our Vision</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    A campus where innovation thrives, leadership is cultivated, and unity prevails. We envision a future where students are active partners in their educational journey, contributing to a vibrant, dynamic, and world-class institutional environment.
                                </p>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>
                </div>

                {/* Core Values */}
                <div className="mb-20">
                    <ScrollAnimation variant="fade-up">
                        <h2 className="text-3xl font-bold text-center mb-12">Core Values</h2>
                    </ScrollAnimation>
                    <StaggeredList className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.2}>
                        {[
                            { title: "Transparency", icon: Shield, desc: "Open communication and accountability in all our actions." },
                            { title: "Inclusivity", icon: Users, desc: "Representing the diverse tapestry of our student community." },
                            { title: "Innovation", icon: Lightbulb, desc: "Embracing new ideas to solve old problems effectively." },
                        ].map((value) => (
                            <Card key={value.title} className="bg-black/50 border border-white/10 hover:border-yellow-500/50 transition-colors backdrop-blur-md h-full">
                                <CardContent className="pt-6 text-center">
                                    <value.icon className="w-10 h-10 mx-auto mb-4 text-yellow-500" />
                                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-gray-400">{value.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </StaggeredList>
                </div>

                {/* Structure Diagram (Simplified) */}
                <div>
                    <ScrollAnimation variant="fade-up">
                        <h2 className="text-3xl font-bold text-center mb-12">Council Structure</h2>
                    </ScrollAnimation>
                    <ScrollAnimation variant="scale-up" className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
                        <Badge className="px-6 py-2 text-lg bg-yellow-500 text-black hover:bg-yellow-400">President</Badge>
                        <div className="h-8 w-px bg-white/20" />
                        <div className="flex gap-4 md:gap-16 flex-wrap justify-center">
                            <Badge variant="outline" className="px-4 py-2 text-base border-white/20 bg-black/50 backdrop-blur-sm">Vice President</Badge>
                            <Badge variant="outline" className="px-4 py-2 text-base border-white/20 bg-black/50 backdrop-blur-sm">General Secretary</Badge>
                            <Badge variant="outline" className="px-4 py-2 text-base border-white/20 bg-black/50 backdrop-blur-sm">Treasurer</Badge>
                        </div>
                        <div className="h-8 w-px bg-white/20" />
                        <StaggeredList className="grid grid-cols-2 md:grid-cols-4 gap-4" itemVariant="scale-up">
                            {['Academic', 'Cultural', 'Sports', 'Welfare'].map((comm) => (
                                <Badge key={comm} variant="secondary" className="justify-center py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm w-full">
                                    {comm} Committee
                                </Badge>
                            ))}
                        </StaggeredList>
                    </ScrollAnimation>
                </div>

            </div>
        </PageBackgroundSpace>
    );
}
