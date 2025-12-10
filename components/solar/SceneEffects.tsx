'use client';

import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function SceneEffects() {
    return (
        <EffectComposer disableNormalPass>
            {/* Intense Bloom for the "Digital" look */}
            <Bloom
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={1.5}
                radius={0.6}
            />

            {/* Film Grain/Noise for texture */}
            <Noise
                opacity={0.05}
                blendFunction={BlendFunction.OVERLAY}
            />

            {/* Vignette to focus center */}
            <Vignette
                eskil={false}
                offset={0.1}
                darkness={1.1}
            />
        </EffectComposer>
    );
}
