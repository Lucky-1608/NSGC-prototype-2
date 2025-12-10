'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SpaceBackground } from './SpaceBackground';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { Suspense } from 'react';

const planets = [
    { name: 'Council', radius: 0.8, distance: 6, speed: 0.5, color: '#3b82f6', route: '/council', description: 'Meet the Team' },
    { name: 'Members', radius: 0.6, distance: 9, speed: 0.4, color: '#10b981', route: '/members', description: 'Our Community' },
    { name: 'Events', radius: 0.9, distance: 13, speed: 0.3, color: '#ef4444', route: '/events', description: 'Upcoming Activities' },
    { name: 'Announcements', radius: 0.5, distance: 16, speed: 0.6, color: '#a855f7', route: '/announcements', description: 'Latest News' },
    { name: 'Complaints', radius: 1.2, distance: 20, speed: 0.2, color: '#f97316', route: '/complaints', description: 'Voice Your Concerns' },
];

export function SolarSystem() {
    return (
        <div className="w-full h-full absolute inset-0">
            <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
                <Suspense fallback={null}>
                    <SpaceBackground />
                    <Sun />
                    {planets.map((planet) => (
                        <Planet key={planet.name} {...planet} />
                    ))}
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        maxDistance={50}
                        minDistance={10}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
