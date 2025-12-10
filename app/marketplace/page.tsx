'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Book, Monitor, Shirt, Tag } from 'lucide-react';

// Mock Data
const items = [
    {
        id: 1,
        title: "Engineering Mathematics - HK Dass",
        price: "₹450",
        category: "Books",
        condition: "Like New",
        seller: "Rahul K.",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    },
    {
        id: 2,
        title: "Scientific Calculator fx-991EX",
        price: "₹800",
        category: "Electronics",
        condition: "Used",
        seller: "Sneha M.",
        image: "https://images.unsplash.com/photo-1587145820266-a5951eebebb1?w=400&h=400&fit=crop",
    },
    {
        id: 3,
        title: "Drafter & Drawing Kit",
        price: "₹300",
        category: "Stationery",
        condition: "Good",
        seller: "Amit S.",
        image: "https://images.unsplash.com/photo-1513346940221-18f4601d6d2e?w=400&h=400&fit=crop",
    },
    {
        id: 4,
        title: "Introduction to Algorithms - CLRS",
        price: "₹1200",
        category: "Books",
        condition: "New",
        seller: "Priya R.",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop",
    },
    {
        id: 5,
        title: "Lab Coat (Size M)",
        price: "₹200",
        category: "Others",
        condition: "Used",
        seller: "John D.",
        image: "https://images.unsplash.com/photo-1517677208171-0bc6799a4c6d?w=400&h=400&fit=crop",
    },
];

const categories = ["All", "Books", "Electronics", "Stationery", "Others"];

export default function MarketplacePage() {
    const [filter, setFilter] = useState("All");

    const filteredItems = filter === "All" ? items : items.filter(i => i.category === filter);

    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Student Marketplace</h1>
                        <p className="text-gray-400">Buy, sell, and exchange items within the campus.</p>
                    </div>
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                        <Tag className="w-4 h-4 mr-2" /> Sell Item
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            onClick={() => setFilter(cat)}
                            className={filter === cat ? "bg-white text-black hover:bg-gray-200" : "border-white/20 text-gray-300"}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="bg-white/5 border-white/10 overflow-hidden group hover:border-yellow-500/50 transition-colors">
                                <div className="aspect-square overflow-hidden relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-black/80 text-white border border-white/20">{item.category}</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-yellow-500 font-bold text-xl">{item.price}</span>
                                        <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">{item.condition}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Seller: {item.seller}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                        Contact Seller
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
