'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Text } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

interface PlanetProps {
    name: string;
    radius: number; // Size of the planet
    distance: number; // Distance from the sun
    speed: number; // Orbit speed
    color: string;
    route: string;
    description?: string;
}

export function Planet({ name, radius, distance, speed, color, route, description }: PlanetProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const orbitRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const router = useRouter();

    // Random starting angle
    const initialAngle = useRef(Math.random() * Math.PI * 2).current;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Orbit rotation
        if (orbitRef.current) {
            orbitRef.current.rotation.y = t * speed * 0.1 + initialAngle;
        }

        // Planet self-rotation
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    const handleClick = () => {
        // Simple navigation for now, camera zoom can be added in the parent scene
        router.push(route);
    };

    return (
        <group ref={orbitRef}>
            <group position={[distance, 0, 0]}>
                <motion.group
                    animate={{ scale: hovered ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Sphere
                        ref={meshRef}
                        args={[radius, 32, 32]}
                        onClick={handleClick}
                        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
                    >
                        <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} />
                    </Sphere>

                    {/* Orbit Ring Visual (Optional, maybe for selected planets) */}
                    {/* <Ring args={[distance - 0.1, distance + 0.1, 64]} rotation={[-Math.PI / 2, 0, 0]} /> */}
                </motion.group>

                {/* Label */}
                <Html distanceFactor={15} position={[0, radius + 0.5, 0]} style={{ pointerEvents: 'none' }}>
                    <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'} bg-black/80 text-white px-3 py-1 rounded-md border border-white/20 backdrop-blur-md whitespace-nowrap`}>
                        <div className="font-bold text-sm">{name}</div>
                        {description && <div className="text-xs text-gray-300">{description}</div>}
                    </div>
                </Html>

                {/* Always visible small label if needed, or just rely on hover */}
                <Html distanceFactor={20} position={[0, -radius - 0.5, 0]} style={{ pointerEvents: 'none' }}>
                    <div className={`transition-opacity duration-500 ${hovered ? 'opacity-0' : 'opacity-60'} text-white text-xs font-mono text-center`}>
                        {name}
                    </div>
                </Html>
            </group>

            {/* Orbit Path Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.02, distance + 0.02, 128]} />
                <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}
