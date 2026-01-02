
import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Label from '@radix-ui/react-label';

interface CustomSwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    icon?: React.ElementType;
    isDark?: boolean;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onCheckedChange, label, icon: Icon, isDark = false }) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${isDark 
        ? 'bg-white/10 border-white/20 hover:border-white/30' 
        : 'bg-black/10 border-black/20 hover:border-black/30'}`}>
        <div className="flex items-center gap-3">
            {Icon && <Icon className={`w-4 h-4 ${isDark ? 'text-white/70' : 'text-black/70'}`} />}
            <Label.Root className={`text-xs font-bold ${isDark ? 'text-white/90' : 'text-black/90'}`}>{label}</Label.Root>
        </div>
        <Switch.Root
            checked={checked}
            onCheckedChange={onCheckedChange}
            className={`w-10 h-6 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer transition-colors ${isDark ? 'bg-white/20' : 'bg-black/20'}`}
        >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px] shadow-md" />
        </Switch.Root>
    </div>
);
