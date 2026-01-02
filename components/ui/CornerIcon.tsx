
import React from 'react';
import { CornerSquareType } from '@/types';

interface CornerIconProps {
    type: CornerSquareType;
    isSelected?: boolean;
    isDark?: boolean;
}

export const CornerIcon: React.FC<CornerIconProps> = ({ type, isSelected = false, isDark = false }) => {
    const color = isSelected ? '#2563eb' : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)');
    const fillColor = isSelected ? '#2563eb' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

    const renderCorner = () => {
        switch (type) {
            case 'square':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="12" height="12" fill={fillColor} stroke={color} strokeWidth="2" />
                        <rect x="16" y="4" width="12" height="12" fill={fillColor} stroke={color} strokeWidth="2" />
                        <rect x="4" y="16" width="12" height="12" fill={fillColor} stroke={color} strokeWidth="2" />
                    </svg>
                );
            case 'dot':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="10" cy="10" r="6" fill={fillColor} stroke={color} strokeWidth="2" />
                        <circle cx="22" cy="10" r="6" fill={fillColor} stroke={color} strokeWidth="2" />
                        <circle cx="10" cy="22" r="6" fill={fillColor} stroke={color} strokeWidth="2" />
                    </svg>
                );
            case 'extra-rounded':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="12" height="12" rx="3" fill={fillColor} stroke={color} strokeWidth="2" />
                        <rect x="16" y="4" width="12" height="12" rx="3" fill={fillColor} stroke={color} strokeWidth="2" />
                        <rect x="4" y="16" width="12" height="12" rx="3" fill={fillColor} stroke={color} strokeWidth="2" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return <div className="flex items-center justify-center">{renderCorner()}</div>;
};

