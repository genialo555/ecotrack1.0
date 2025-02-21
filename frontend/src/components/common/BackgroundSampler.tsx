import React, { useRef, useEffect } from 'react';
import { useContrastDetection } from '@/hooks/useContrastDetection';

interface BackgroundSamplerProps {
    children: React.ReactNode;
    className?: string;
    onContrastChange?: (result: { textColor: string; backgroundColor: string; backgroundOpacity: number; isLight: boolean }) => void;
}

export const BackgroundSampler: React.FC<BackgroundSamplerProps> = ({
    children,
    className = '',
    onContrastChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contrastResult = useContrastDetection(containerRef);

    useEffect(() => {
        if (onContrastChange) {
            onContrastChange(contrastResult);
        }
    }, [contrastResult, onContrastChange]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
};
