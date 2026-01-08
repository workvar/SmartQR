
import React, { useEffect } from 'react';
import { LinkIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { QRSettings } from '@/types';
import { CustomSwitch } from '../ui/CustomSwitch';

interface StepContentProps {
    settings: QRSettings;
    onUpdate: (updates: Partial<QRSettings>) => void;
    isDark?: boolean;
    isEditing?: boolean;
    isDynamic?: boolean;
    dynamicQRQuota?: { count: number; limit: number; canCreate: boolean } | null;
}

export const StepContent: React.FC<StepContentProps> = ({ 
    settings, 
    onUpdate, 
    isDark = false,
    isEditing = false,
    isDynamic = false,
    dynamicQRQuota = null,
}) => {
    // Determine if URL input should be disabled
    const isUrlDisabled = isEditing && !isDynamic;
    
    // Determine if dynamic toggle should be disabled
    // Disable if editing OR if quota is maxed out
    const isQuotaMaxed = dynamicQRQuota ? !dynamicQRQuota.canCreate : false;
    const isDynamicToggleDisabled = isEditing || isQuotaMaxed;

    // Automatically set isDynamic to false if quota is maxed and not editing
    useEffect(() => {
        if (isQuotaMaxed && !isEditing && settings.isDynamic) {
            onUpdate({ isDynamic: false });
        }
    }, [isQuotaMaxed, isEditing, settings.isDynamic, onUpdate]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
                <div className={`flex items-center gap-4 px-6 py-8 rounded-[2rem] border-2 transition-all ${
                    isDark 
                        ? `border-white/5 ${isUrlDisabled ? 'bg-white/5 opacity-60' : 'bg-white/5 focus-within:border-blue-600'}` 
                        : `border-black/5 ${isUrlDisabled ? 'bg-black/5 opacity-60' : 'bg-black/5 focus-within:border-blue-600'}`
                }`}>
                    <LinkIcon className={`w-8 h-8 ${isUrlDisabled ? 'opacity-10' : 'opacity-20'}`} />
                    <input
                        type="text"
                        autoFocus={!isEditing}
                        value={settings.url}
                        onChange={(e) => {
                            if (!isUrlDisabled) {
                                onUpdate({ url: e.target.value });
                            }
                        }}
                        placeholder="https://yourlink.com"
                        disabled={isUrlDisabled}
                        className={`w-full text-2xl lg:text-3xl font-bold bg-transparent outline-none placeholder:text-muted-foreground ${
                            isUrlDisabled ? 'cursor-not-allowed' : ''
                        }`}
                    />
                </div>
                {isUrlDisabled && (
                    <div className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl ${
                        isDark ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <LockClosedIcon className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <p className={`text-sm font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                            Content cannot be changed for non-dynamic QR codes. Only dynamic QR codes allow content updates.
                        </p>
                    </div>
                )}
            </div>
            <div className="mt-6">
                <CustomSwitch
                    label="Dynamic Content"
                    checked={isQuotaMaxed ? false : (settings.isDynamic || false)}
                    onCheckedChange={(checked) => {
                        if (!isDynamicToggleDisabled) {
                            onUpdate({ isDynamic: checked });
                        }
                    }}
                    isDark={isDark}
                    disabled={isDynamicToggleDisabled}
                />
                {isEditing && (
                    <div className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl ${
                        isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                    }`}>
                        <LockClosedIcon className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                            QR code type cannot be changed after creation. This QR code is {isDynamic ? 'dynamic' : 'static'}.
                        </p>
                    </div>
                )}
                {isQuotaMaxed && !isEditing && (
                    <div className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl ${
                        isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
                    }`}>
                        <LockClosedIcon className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                        <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                                Dynamic QR quota maxed out ({dynamicQRQuota?.count || 0}/{dynamicQRQuota?.limit || 1}). Switch to a paid plan to create more dynamic QR codes.
                            </p>
                    </div>
                )}
            </div>
        </div>
    );
};
