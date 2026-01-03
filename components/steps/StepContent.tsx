
import React from 'react';
import { LinkIcon } from '@heroicons/react/24/outline';
import { QRSettings } from '@/types';
import { CustomSwitch } from '../ui/CustomSwitch';

interface StepContentProps {
    settings: QRSettings;
    onUpdate: (updates: Partial<QRSettings>) => void;
    isDark?: boolean;
}

export const StepContent: React.FC<StepContentProps> = ({ settings, onUpdate, isDark = false }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative">
            <div className={`flex items-center gap-4 px-6 py-8 rounded-[2rem] border-2 transition-all ${isDark ? 'border-white/5 bg-white/5 focus-within:border-blue-600' : 'border-black/5 bg-black/5 focus-within:border-blue-600'}`}>
                <LinkIcon className="w-8 h-8 opacity-20" />
                <input
                    type="text"
                    autoFocus
                    value={settings.url}
                    onChange={(e) => onUpdate({ url: e.target.value })}
                    placeholder="https://yourlink.com"
                    className="w-full text-2xl lg:text-3xl font-bold bg-transparent outline-none placeholder:text-muted-foreground"
                />
            </div>
        </div>
        <div className="mt-6">
            <CustomSwitch
                label="Dynamic Content"
                checked={settings.isDynamic || false}
                onCheckedChange={(checked) => onUpdate({ isDynamic: checked })}
                isDark={isDark}
            />
        </div>
    </div>
);
