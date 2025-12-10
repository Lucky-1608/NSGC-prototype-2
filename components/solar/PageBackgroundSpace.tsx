'use client';

import { Canvas } from '@react-three/fiber';
import { SpaceBackground } from './SpaceBackground';
import { motion } from 'framer-motion';

export function PageBackgroundSpace({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Background Scene */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <SpaceBackground />
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
