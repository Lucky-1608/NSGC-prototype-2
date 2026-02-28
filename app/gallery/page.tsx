'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const images = [
    { src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop", alt: "Convocation 2024", span: "col-span-2 row-span-2" },
    { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400&fit=crop", alt: "Tech Fest", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop", alt: "Hackathon", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop", alt: "Cultural Night", span: "col-span-2 row-span-1" },
    { src: "https://images.unsplash.com/photo-1475721027767-p42f563d6ce9?w=400&h=800&fit=crop", alt: "Sports Meet", span: "col-span-1 row-span-2" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=400&fit=crop", alt: "Workshop", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop", alt: "Seminar", span: "col-span-1 row-span-1" },
];

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 md:pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Campus Life</h1>
                    <p className="text-gray-400">Capturing moments that define our journey.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            className={`relative rounded-xl overflow-hidden group ${img.span}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-bold text-lg">{img.alt}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
