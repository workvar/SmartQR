
import React from 'react';
import { DotType } from '@/types';

interface PatternIconProps {
    type: DotType;
    isSelected?: boolean;
    isDark?: boolean;
}

export const PatternIcon: React.FC<PatternIconProps> = ({ type, isSelected = false, isDark = false }) => {
    const color = isSelected ? '#2563eb' : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)');
    const fillColor = isSelected ? '#2563eb' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

    const renderPattern = () => {
        switch (type) {
            case 'square':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="8" height="8" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="16" y="4" width="8" height="8" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="4" y="16" width="8" height="8" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="16" y="16" width="8" height="8" fill={fillColor} stroke={color} strokeWidth="1.5" />
                    </svg>
                );
            case 'dots':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="8" cy="8" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="16" cy="8" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="24" cy="8" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="8" cy="16" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="16" cy="16" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="24" cy="16" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="8" cy="24" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="16" cy="24" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="24" cy="24" r="3" fill={fillColor} stroke={color} strokeWidth="1.5" />
                    </svg>
                );
            case 'rounded':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="8" height="8" rx="2" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="16" y="4" width="8" height="8" rx="2" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="4" y="16" width="8" height="8" rx="2" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="16" y="16" width="8" height="8" rx="2" fill={fillColor} stroke={color} strokeWidth="1.5" />
                    </svg>
                );
            case 'extra-rounded':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="8" height="8" rx="4" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="16" y="4" width="8" height="8" rx="4" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="4" y="16" width="8" height="8" rx="4" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="16" y="16" width="8" height="8" rx="4" fill={fillColor} stroke={color} strokeWidth="1.5" />
                    </svg>
                );
            case 'classy':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M4 4 L12 4 L12 12 L4 12 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 4 L24 4 L24 12 L16 12 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 16 L12 16 L12 24 L4 24 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 16 L24 16 L24 24 L16 24 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'classy-rounded':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M4 4 Q8 4 8 8 L8 12 Q8 12 4 12 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 4 Q20 4 20 8 L20 12 Q20 12 16 12 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 16 Q8 16 8 20 L8 24 Q8 24 4 24 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 16 Q20 16 20 20 L20 24 Q20 24 16 24 Z" fill={fillColor} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return <div className="flex items-center justify-center">{renderPattern()}</div>;
};

