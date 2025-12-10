'use client';

import { Hero3D } from '@/components/home/Hero3D';
import { PresidentSection } from '@/components/home/PresidentSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero3D />
      <PresidentSection />
      <FeaturesSection />
    </div>
  );
}
