
import React from 'react';
import * as Label from '@radix-ui/react-label';
import { SwatchIcon } from '@heroicons/react/24/outline';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    secondaryValue?: string;
    onSecondaryChange?: (value: string) => void;
    gradientEnabled?: boolean;
    onGradientToggle?: () => void;
    isDark?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    label,
    value,
    onChange,
    secondaryValue,
    onSecondaryChange,
    gradientEnabled,
    onGradientToggle,
    isDark = false
}) => {
    const labelClass = `block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-white/70' : 'text-black/70'}`;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label.Root className={labelClass.replace('mb-3', 'mb-0')}>{label}</Label.Root>
                {onGradientToggle && (
                    <button
                        onClick={onGradientToggle}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${gradientEnabled 
                            ? 'bg-blue-600 text-white' 
                            : isDark 
                                ? 'bg-white/10 text-white/70 hover:bg-white/20' 
                                : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
                    >
                        <SwatchIcon className="w-3 h-3" />
                        Gradient
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3">
                <div className={`relative h-14 rounded-2xl border flex items-center gap-4 px-4 overflow-hidden transition-all ${isDark 
                    ? 'bg-white/10 border-white/20 hover:border-white/30' 
                    : 'bg-black/10 border-black/20 hover:border-black/30'}`}>
                    <div className="w-8 h-8 rounded-full shadow-inner border border-black/10 shrink-0" style={{ backgroundColor: value }} />
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isDark ? 'text-white/80' : 'text-black/80'}`}>{value}</span>
                    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>

                {gradientEnabled && secondaryValue && onSecondaryChange && (
                    <div className="animate-in slide-in-from-top-2 duration-300 space-y-3">
                        <div className={`relative h-14 rounded-2xl border flex items-center gap-4 px-4 overflow-hidden transition-all ${isDark 
                            ? 'bg-white/10 border-white/20 hover:border-white/30' 
                            : 'bg-black/10 border-black/20 hover:border-black/30'}`}>
                            <div className="w-8 h-8 rounded-full shadow-inner border border-black/10 shrink-0" style={{ backgroundColor: secondaryValue }} />
                            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isDark ? 'text-white/80' : 'text-black/80'}`}>{secondaryValue}</span>
                            <input type="color" value={secondaryValue} onChange={(e) => onSecondaryChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
