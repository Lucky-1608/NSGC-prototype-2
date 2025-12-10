'use client';

import { Stars, Cloud } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function SpaceBackground() {
    const starsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (starsRef.current) {
            starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
            starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <group>
            <group ref={starsRef}>
                <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </group>
            <ambientLight intensity={0.2} />
            {/* Subtle Nebula Effect using Cloud */}
            <Cloud opacity={0.1} speed={0.2} bounds={[50, 5, 50]} segments={20} position={[0, -10, -20]} color="#4c1d95" />
            <Cloud opacity={0.1} speed={0.2} bounds={[50, 5, 50]} segments={20} position={[0, 10, -20]} color="#1e3a8a" />
        </group>
    );
}
