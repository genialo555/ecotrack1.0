import { useState, useEffect, useCallback } from 'react';

// Calculate relative luminance for RGB values
const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio between two colors
const getContrastRatio = (l1: number, l2: number) => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
};

// Convert RGB to HSL for better color manipulation
const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

export interface ContrastResult {
    textColor: string;
    backgroundColor: string;
    backgroundOpacity: number;
    isLight: boolean;
}

export const useContrastDetection = (elementRef: React.RefObject<HTMLElement>) => {
    const [contrast, setContrast] = useState<ContrastResult>({
        textColor: 'text-gray-900',
        backgroundColor: 'bg-white',
        backgroundOpacity: 0.8,
        isLight: true
    });

    const analyzeBackgroundColor = useCallback(() => {
        if (!elementRef.current) return;

        // Create a temporary canvas to sample the background
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Sample multiple points for better accuracy
        const samplePoints = [
            { x: 0, y: 0 },
            { x: elementRef.current.offsetWidth / 2, y: 0 },
            { x: elementRef.current.offsetWidth - 1, y: 0 }
        ];

        // Get average RGB values from sample points
        let totalR = 0, totalG = 0, totalB = 0;
        samplePoints.forEach(point => {
            const pixel = ctx.getImageData(point.x, point.y, 1, 1).data;
            totalR += pixel[0];
            totalG += pixel[1];
            totalB += pixel[2];
        });

        const avgR = totalR / samplePoints.length;
        const avgG = totalG / samplePoints.length;
        const avgB = totalB / samplePoints.length;

        // Calculate luminance and determine optimal text color
        const luminance = getLuminance(avgR, avgG, avgB);
        const isLight = luminance > 0.5;
        const hsl = rgbToHsl(avgR, avgG, avgB);

        // Determine optimal background opacity based on luminance
        const backgroundOpacity = isLight ? 0.8 : 0.9;

        setContrast({
            textColor: isLight ? 'text-gray-900' : 'text-gray-50',
            backgroundColor: isLight ? 'bg-white' : 'bg-gray-900',
            backgroundOpacity,
            isLight
        });
    }, [elementRef]);

    useEffect(() => {
        const observer = new MutationObserver(analyzeBackgroundColor);
        if (elementRef.current) {
            observer.observe(elementRef.current, {
                attributes: true,
                childList: true,
                subtree: true
            });
            analyzeBackgroundColor();
        }

        return () => observer.disconnect();
    }, [elementRef, analyzeBackgroundColor]);

    return contrast;
};
