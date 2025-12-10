"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface StaggeredListProps {
    children: React.ReactNode[];
    className?: string;
    staggerDelay?: number;
    itemVariant?: "fade-up" | "fade-in" | "scale-up";
    viewport?: { once?: boolean; margin?: string };
}

export default function StaggeredList({
    children,
    className,
    staggerDelay = 0.1,
    itemVariant = "fade-up",
    viewport = { once: true, margin: "-50px" },
}: StaggeredListProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport as any);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    };

    const itemVariants = {
        "fade-up": {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        },
        "fade-in": {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={cn(className)}
        >
            {children.map((child, index) => (
                <motion.div key={index} variants={itemVariants[itemVariant]}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}
