import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-mono tracking-widest uppercase ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group border-l-[3px]",
    {
        variants: {
            variant: {
                default: "bg-blue-900/20 border border-blue-500/30 border-l-blue-500 text-blue-400 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
                destructive: "bg-red-900/20 border border-red-500/30 border-l-red-500 text-red-400 hover:text-white",
                outline: "border border-blue-500/20 border-l-blue-500/50 bg-black/50 text-blue-300 hover:text-blue-400 hover:border-l-blue-500",
                secondary: "bg-yellow-500/10 border border-yellow-500/20 border-l-yellow-500 text-yellow-500 hover:text-yellow-400",
                ghost: "border-transparent border-l-transparent hover:bg-blue-500/10 hover:border-l-blue-500 hover:text-blue-400 text-gray-400",
                link: "border-transparent border-l-transparent text-blue-400 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-sm px-3 text-xs",
                lg: "h-12 rounded-sm px-8 text-base",
                icon: "h-10 w-10 border-l-[1px] border-l-blue-500/30",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : motion.button
        const motionProps = asChild ? {} : {
            whileHover: { y: -2 },
            whileTap: { y: 2, scale: 0.98 },
            layout: true
        }

        // To handle the sweep animation nicely without breaking asChild
        const sweepClass = "before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-0 before:bg-white/5 before:transition-transform before:duration-300 before:ease-out before:-z-10 z-0"

        return (
            <Comp
                className={cn(buttonVariants({ variant, size }), sweepClass, className)}
                ref={ref}
                {...motionProps}
                {...props as any}
            >
                {children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }

