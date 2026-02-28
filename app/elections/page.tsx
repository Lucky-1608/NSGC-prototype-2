'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlassModal } from '@/components/ui/glass-modal';
import { Vote, CheckCircle, Lock } from 'lucide-react';
import { useSharedData, Election } from '@/hooks/useSharedData';

export default function ElectionsPage() {
    const { elections, setElections } = useSharedData();
    const [userVotes, setUserVotes] = useState<string[]>([]);
    const [selectedElection, setSelectedElection] = useState<Election | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

    useEffect(() => {
        const votes = localStorage.getItem('nsgc_user_votes');
        if (votes) {
            setUserVotes(JSON.parse(votes));
        }
    }, []);

    const handleVote = () => {
        if (!selectedElection || !selectedCandidate) return;

        // update election votes
        setElections(prev => prev.map(e => {
            if (e.id === selectedElection.id) {
                return {
                    ...e,
                    candidates: e.candidates.map(c =>
                        c.id === selectedCandidate ? { ...c, votes: (c.votes || 0) + 1 } : c
                    )
                };
            }
            return e;
        }));

        // save user vote
        const newVotes = [...userVotes, selectedElection.id];
        setUserVotes(newVotes);
        localStorage.setItem('nsgc_user_votes', JSON.stringify(newVotes));

        setSelectedElection(null);
        setSelectedCandidate(null);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Elections</h1>
                    <p className="text-gray-400">Democracy in action. Choose your leaders.</p>
                </div>

                <div className="flex justify-center items-center min-h-[50vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-4xl"
                    >
                        {/* Dynamic Elections List */}
                        {elections.length > 0 ? (
                            <div className="grid gap-6 w-full">
                                {elections.map((election) => {
                                    const hasVoted = userVotes.includes(election.id);
                                    return (
                                        <Card key={election.id} className="bg-white/5 border-white/10 p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-left hover:border-cyan-500/30 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold">{election.title}</h3>
                                                    <span className={`px-2 py-1 text-xs rounded-full border ${election.status === 'Ongoing' ? 'text-green-500 border-green-500 bg-green-500/10' : 'text-gray-400 border-gray-500 bg-gray-500/10'}`}>
                                                        {election.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-2">{election.description}</p>
                                                <p className="text-xs text-gray-500">Date: {election.date}</p>
                                            </div>
                                            {election.status === 'Ongoing' && (
                                                <Button
                                                    onClick={() => !hasVoted && setSelectedElection(election)}
                                                    disabled={hasVoted}
                                                    className={`px-6 py-2 rounded-full font-bold transition-all ${hasVoted
                                                        ? 'bg-green-500/20 text-green-500 cursor-not-allowed'
                                                        : 'bg-cyan-500 text-black hover:bg-cyan-400'
                                                        }`}
                                                >
                                                    {hasVoted ? (
                                                        <><CheckCircle className="w-4 h-4 mr-2" /> Voted</>
                                                    ) : (
                                                        <><Vote className="w-4 h-4 mr-2" /> Vote Now</>
                                                    )}
                                                </Button>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <Vote className="w-16 h-16 text-cyan-500" />
                                <h2 className="text-2xl font-bold">No Upcoming Elections</h2>
                                <p className="text-gray-400">
                                    Election schedules and candidate information will be announced soon.
                                    Stay tuned for updates!
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Voting Modal */}
                <GlassModal
                    isOpen={!!selectedElection}
                    onClose={() => setSelectedElection(null)}
                    title={`Vote: ${selectedElection?.title}`}
                    footer={
                        <>
                            <Button variant="outline" onClick={() => setSelectedElection(null)} className="border-white/20 hover:bg-white/10 hover:text-white">Cancel</Button>
                            <Button
                                onClick={handleVote}
                                disabled={!selectedCandidate}
                                className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Vote className="w-4 h-4 mr-2" /> Confirm Vote
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <p className="text-gray-300 text-sm">Select a candidate to cast your vote. This action cannot be undone.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {selectedElection?.candidates && selectedElection.candidates.length > 0 ? (
                                selectedElection?.candidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        onClick={() => setSelectedCandidate(candidate.id)}
                                        className={`flex flex-col items-center text-center p-6 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${selectedCandidate === candidate.id
                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300'
                                            }`}
                                    >
                                        <div className="mb-3 relative">
                                            {candidate.image ? (
                                                <img src={candidate.image} alt={candidate.name} className="w-24 h-24 rounded-full object-cover border-2 border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10 group-hover:border-cyan-500/50 transition-colors">
                                                    <Vote className="w-10 h-10 text-gray-500" />
                                                </div>
                                            )}
                                            {selectedCandidate === candidate.id && (
                                                <div className="absolute top-0 right-0 bg-cyan-500 text-black rounded-full p-1 shadow-lg transform translate-x-1/4 -translate-y-1/4">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-bold text-lg">{candidate.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center p-8 text-gray-500 bg-white/5 rounded-xl border border-white/10 border-dashed">
                                    <Lock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                    <p>No candidates listed for this election yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </GlassModal>

            </div>
        </div>
    );
}
