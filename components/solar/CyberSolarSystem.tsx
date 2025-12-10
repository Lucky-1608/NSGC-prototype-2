'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { CyberSun } from './CyberSun';
import { CyberPlanet } from './CyberPlanet';
import { SceneEffects } from './SceneEffects';
import * as THREE from 'three';

const planets = [
    { name: 'Council', radius: 1.2, distance: 8, speed: 0.1, color: '#3b82f6', route: '/council', description: 'Meet the Team' },
    { name: 'Members', radius: 1.0, distance: 12, speed: 0.08, color: '#10b981', route: '/members', description: 'Our Community' },
    { name: 'Events', radius: 1.5, distance: 17, speed: 0.06, color: '#ef4444', route: '/events', description: 'Upcoming Activities' },
    { name: 'Announcements', radius: 0.8, distance: 22, speed: 0.12, color: '#a855f7', route: '/announcements', description: 'Latest News' },
    { name: 'Complaints', radius: 1.1, distance: 27, speed: 0.05, color: '#f97316', route: '/complaints', description: 'Voice Your Concerns' },
];

export function CyberSolarSystem() {
    return (
        <div className="w-full h-full absolute inset-0 bg-black">
            <Canvas
                camera={{ position: [0, 20, 35], fov: 40 }}
                gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
                dpr={[1, 2]} // Quality scaling
            >
                <ambientLight intensity={0.2} />

                <Suspense fallback={null}>
                    {/* The Central Sun */}
                    <CyberSun />

                    {/* The Planets */}
                    {planets.map((planet) => (
                        <CyberPlanet key={planet.name} {...planet} />
                    ))}

                    {/* Background Stars - Dense and animated */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Scene Post-Processing Effects */}
                    <SceneEffects />

                    {/* Camera Controls - constrained mostly to look at system */}
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        maxDistance={60}
                        minDistance={15}
                        maxPolarAngle={Math.PI / 2} // Don't go below the plane too much
                        minPolarAngle={0}
                        autoRotate
                        autoRotateSpeed={0.2}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
