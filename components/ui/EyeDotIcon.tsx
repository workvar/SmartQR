
import React from 'react';
import { CornerDotType } from '@/types';

interface EyeDotIconProps {
    type: CornerDotType;
    isSelected?: boolean;
    isDark?: boolean;
}

export const EyeDotIcon: React.FC<EyeDotIconProps> = ({ type, isSelected = false, isDark = false }) => {
    const color = isSelected ? '#2563eb' : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)');
    const fillColor = isSelected ? '#2563eb' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

    const renderEyeDot = () => {
        switch (type) {
            case 'square':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="12" height="12" fill={fillColor} stroke={color} strokeWidth="2" />
                        <rect x="4" y="4" width="12" height="12" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
                        <rect x="8" y="8" width="4" height="4" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="16" y="4" width="12" height="12" fill={fillColor} stroke={color} strokeWidth="2" />
                        <rect x="16" y="4" width="12" height="12" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
                        <rect x="20" y="8" width="4" height="4" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <rect x="4" y="16" width="12" height="12" fill={fillColor} stroke={color} strokeWidth="2" />
                        <rect x="4" y="16" width="12" height="12" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
                        <rect x="8" y="20" width="4" height="4" fill={fillColor} stroke={color} strokeWidth="1.5" />
                    </svg>
                );
            case 'dot':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="10" cy="10" r="6" fill={fillColor} stroke={color} strokeWidth="2" />
                        <circle cx="10" cy="10" r="6" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx="10" cy="10" r="2" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="22" cy="10" r="6" fill={fillColor} stroke={color} strokeWidth="2" />
                        <circle cx="22" cy="10" r="6" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx="22" cy="10" r="2" fill={fillColor} stroke={color} strokeWidth="1.5" />
                        <circle cx="10" cy="22" r="6" fill={fillColor} stroke={color} strokeWidth="2" />
                        <circle cx="10" cy="22" r="6" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx="10" cy="22" r="2" fill={fillColor} stroke={color} strokeWidth="1.5" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return <div className="flex items-center justify-center">{renderEyeDot()}</div>;
};

