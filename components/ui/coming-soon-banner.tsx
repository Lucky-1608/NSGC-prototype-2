import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ComingSoonBannerProps {
    title?: string;
    description?: string;
}

export function ComingSoonBanner({
    title = "Update Rolling Out Soon",
    description = "This section is currently being updated. New features will be available shortly."
}: ComingSoonBannerProps) {
    return (
        <div className="w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <div>
                <h3 className="font-semibold text-cyan-500 text-sm md:text-base">
                    {title}
                </h3>
                {description && (
                    <p className="text-cyan-500/80 text-xs md:text-sm mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
