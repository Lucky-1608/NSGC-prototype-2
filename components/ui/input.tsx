import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500/70 pointer-events-none transition-opacity group-focus-within:border-blue-400 z-10" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500/70 pointer-events-none transition-opacity group-focus-within:border-blue-400 z-10" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/70 pointer-events-none transition-opacity group-focus-within:border-blue-400 z-10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500/70 pointer-events-none transition-opacity group-focus-within:border-blue-400 z-10" />

                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full bg-black/40 border border-blue-500/20 px-3 py-2 text-sm text-blue-400 font-mono shadow-[inset_0_0_15px_rgba(59,130,246,0.05)] placeholder:text-blue-500/30 focus-visible:outline-none focus:border-blue-500/50 focus:bg-blue-500/10 transition-all rounded-sm",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
