'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-yellow-500/10 p-6 rounded-full border border-yellow-500/20">
                        <Rocket className="w-12 h-12 text-yellow-500" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Update Rolling Out Soon
                </h1>

                <p className="text-gray-400 text-lg">
                    We are currently working on something amazing. Stay tuned!
                </p>
            </motion.div>
        </div>
    );
}
