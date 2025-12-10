'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function Sun() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group>
            {/* Core Sun */}
            <Sphere args={[2.5, 64, 64]} ref={meshRef}>
                <MeshDistortMaterial
                    color="#fbbf24" // Amber-400
                    emissive="#f59e0b" // Amber-500
                    emissiveIntensity={2}
                    distort={0.3}
                    speed={2}
                    roughness={0}
                />
            </Sphere>

            {/* Glow Effect (Simplified) */}
            <pointLight intensity={2} distance={100} decay={2} color="#fbbf24" />
            <ambientLight intensity={0.5} />
        </group>
    );
}
