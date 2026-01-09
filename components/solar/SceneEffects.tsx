// @ts-nocheck
'use client';

import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const NoiseEffect = Noise as any;
const BloomEffect = Bloom as any;
const VignetteEffect = Vignette as any;

export function SceneEffects() {
    return (
        <EffectComposer disableNormalPass>
            {/* Intense Bloom for the "Digital" look */}
            <BloomEffect
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={1.5}
                radius={0.6}
            />

            {/* Film Grain/Noise for texture */}
            <NoiseEffect
                opacity={0.05}
                blendFunction={BlendFunction.OVERLAY}
            />

            {/* Vignette to focus center */}
            <VignetteEffect
                eskil={false}
                offset={0.1}
                darkness={1.1}
            />
        </EffectComposer>
    );
}
