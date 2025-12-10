"use client";

import { motion, useInView, Variant } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
    children: React.ReactNode;
    className?: string;
    variant?: "fade-up" | "fade-in" | "scale-up" | "slide-in-right" | "slide-in-left";
    delay?: number;
    duration?: number;
    viewport?: { once?: boolean; margin?: string };
}

export default function ScrollAnimation({
    children,
    className,
    variant = "fade-up",
    delay = 0,
    duration = 0.5,
    viewport = { once: true, margin: "-100px" },
}: ScrollAnimationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport as any);

    const variants: Record<string, { hidden: Variant; visible: Variant }> = {
        "fade-up": {
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
        },
        "fade-in": {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
        },
        "slide-in-right": {
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
        },
        "slide-in-left": {
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
        },
    };

    const selectedVariant = variants[variant];

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={selectedVariant}
            transition={{ duration, delay, ease: "easeOut" }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
