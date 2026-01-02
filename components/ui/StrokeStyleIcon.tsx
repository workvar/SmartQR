
import React from 'react';
import { FrameStyle } from '@/types';

interface StrokeStyleIconProps {
    type: FrameStyle;
    isSelected?: boolean;
    isDark?: boolean;
}

export const StrokeStyleIcon: React.FC<StrokeStyleIconProps> = ({ type, isSelected = false, isDark = false }) => {
    const color = isSelected ? '#2563eb' : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)');

    const renderStroke = () => {
        switch (type) {
            case 'solid':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="24" height="24" fill="none" stroke={color} strokeWidth="3" />
                    </svg>
                );
            case 'dashed':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="24" height="24" fill="none" stroke={color} strokeWidth="3" strokeDasharray="4 4" />
                    </svg>
                );
            case 'dotted':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="24" height="24" fill="none" stroke={color} strokeWidth="3" strokeDasharray="2 2" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return <div className="flex items-center justify-center">{renderStroke()}</div>;
};

