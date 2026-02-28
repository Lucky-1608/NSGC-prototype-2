'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Need to create or mock Progress
import { MessageSquare, BarChart2, CheckCircle } from 'lucide-react';

// Mock Data
import { useSharedData } from '@/hooks/useSharedData';

export default function FeedbackPage() {
    const { polls, setPolls, surveys } = useSharedData();

    const handleVote = (pollId: string, optionId: string) => {
        setPolls(currentPolls =>
            currentPolls.map(poll => {
                if (poll.id === pollId) {
                    const updatedOptions = poll.options.map(opt =>
                        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                    );
                    return { ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1, userVoted: true, userChoice: optionId };
                }
                return poll;
            })
        );
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Voice Matters</h1>
                    <p className="text-gray-400">Participate in polls and surveys to shape the campus.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Polls Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <BarChart2 className="w-6 h-6 text-cyan-500" />
                            <h2 className="text-2xl font-bold">Active Polls</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-6">
                                {polls.filter(p => p.status === 'Active').length > 0 ? (
                                    polls.filter(p => p.status === 'Active').map((poll) => (
                                        <motion.div
                                            key={poll.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <Card className="bg-white/5 border-white/10">
                                                <CardHeader>
                                                    <CardTitle className="text-xl">{poll.question}</CardTitle>
                                                    <CardDescription>{poll.totalVotes} votes so far</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {poll.options.map((option) => {
                                                        const percentage = Math.round((option.votes / poll.totalVotes) * 100) || 0;
                                                        const isSelected = poll.userVoted && poll.userChoice === option.id;

                                                        return (
                                                            <div key={option.id} className="space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className={isSelected ? "text-cyan-500 font-bold" : "text-gray-300"}>
                                                                        {option.text} {isSelected && "(You voted)"}
                                                                    </span>
                                                                    <span className="text-gray-400">{percentage}%</span>
                                                                </div>
                                                                {poll.userVoted ? (
                                                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            className={`h-full ${isSelected ? 'bg-cyan-500' : 'bg-gray-600'}`}
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${percentage}%` }}
                                                                            transition={{ duration: 1 }}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <Button
                                                                        variant="outline"
                                                                        className="w-full justify-start border-white/20 hover:bg-cyan-500 hover:text-black hover:border-cyan-500"
                                                                        onClick={() => handleVote(poll.id, option.id)}
                                                                    >
                                                                        Vote
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No active polls at the moment.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Surveys Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="w-6 h-6 text-cyan-500" />
                            <h2 className="text-2xl font-bold">Feedback Forms</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-6">
                                {surveys.length > 0 ? (
                                    surveys.map((survey, index) => (
                                        <motion.div
                                            key={survey.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-colors">
                                                <CardHeader>
                                                    <CardTitle className="text-xl">{survey.title}</CardTitle>
                                                    <CardDescription>{survey.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex gap-4 text-sm text-gray-400 mb-4">
                                                        <span className="bg-white/10 px-2 py-1 rounded">{survey.questions} Questions</span>
                                                        <span className="bg-white/10 px-2 py-1 rounded">{survey.time} to complete</span>
                                                    </div>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10" disabled={survey.status !== 'Active'} onClick={() => survey.link && window.open(survey.link, '_blank')}>
                                                        {survey.status === 'Active' ? 'Start Survey' : 'Closed'}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No feedback forms available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
