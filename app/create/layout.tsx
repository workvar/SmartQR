
'use client';

import React, { useMemo, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import PreviewCard from '@/components/PreviewCard';
import { FEATURE_FLAGS } from '@/config';
import {
    SunIcon,
    MoonIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { saveQRCode } from '@/app/actions';
import { useState } from 'react';

const ALL_STEPS = [
    { id: 'url', title: 'Content', description: 'Enter the destination link', path: '/create/content' },
    { id: 'logo', title: 'Branding', description: 'Add your identity asset', flag: 'ENABLE_BRANDING_STEP', path: '/create/branding' },
    { id: 'style', title: 'Design', description: 'Refine visual aesthetics', path: '/create/design' },
];

export default function CreateLayout({ children }: { children: React.ReactNode }) {
    const settings = useAppSelector((state: any) => state.qrSettings);
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [editingQRId, setEditingQRId] = useState<string | null>(null);

    const isDark = settings.theme === 'dark';
    
    // Check if editing existing QR
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const editingQR = sessionStorage.getItem('editingQR');
            if (editingQR) {
                try {
                    const parsed = JSON.parse(editingQR);
                    setEditingQRId(parsed.id);
                    // Load settings if editing
                    if (parsed.settings) {
                        dispatch(updateSettings(parsed.settings));
                    }
                } catch (e) {
                    console.error('Error parsing editing QR:', e);
                }
            }
        }
    }, [dispatch]);
    
    const handleUpdateSettings = (updates: Partial<typeof settings>) => {
        dispatch(updateSettings(updates));
    };

    const handleSave = async () => {
        if (!settings.url || settings.url.trim() === '') {
            alert('Please enter a URL first');
            return;
        }

        setIsSaving(true);
        try {
            const name = editingQRId ? `QR Code ${new Date().toLocaleDateString()}` : `QR Code ${new Date().toLocaleDateString()}`;
            await saveQRCode(name, settings.url, settings, editingQRId);
            
            // Clear editing session
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('editingQR');
            }
            
            router.push('/dashboard');
        } catch (error: any) {
            alert(error.message || 'Failed to save QR code');
        } finally {
            setIsSaving(false);
        }
    };

    const activeSteps = useMemo(() => {
        return ALL_STEPS.filter(step => !step.flag || (FEATURE_FLAGS as any)[step.flag]);
    }, []);

    const currentStepIndex = activeSteps.findIndex(step => pathname.includes(step.path));
    const currentStep = activeSteps[currentStepIndex] || activeSteps[0];

    const progressPercent = ((currentStepIndex + 1) / activeSteps.length) * 100;
    const isFinalStep = currentStepIndex === activeSteps.length - 1;
    const isStepValid = currentStep.id !== 'url' || settings.url.trim().length > 0;

    const toggleTheme = () => {
        handleUpdateSettings({ theme: isDark ? 'light' : 'dark' });
    };

    const handleNext = () => {
        if (currentStepIndex < activeSteps.length - 1) {
            const nextPath = activeSteps[currentStepIndex + 1].path;
            router.push(nextPath);
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            const prevPath = activeSteps[currentStepIndex - 1].path;
            router.push(prevPath);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ease-in-out ${isDark ? 'bg-black text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'}`}>
            <header className={`h-16 border-b sticky top-0 z-50 flex items-center backdrop-blur-md transition-colors ${isDark ? 'border-white/10 bg-black/70' : 'border-black/5 bg-white/70'}`}>
                <div className="max-w-[1200px] w-full mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 cursor-pointer">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black">N</span>
                        </div>
                        <span className="text-sm font-bold tracking-tight">NovaQR Studio</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {FEATURE_FLAGS.ENABLE_DARK_MODE_TOGGLE && (
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                            >
                                {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                            </button>
                        )}
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </header>

            <div className="h-0.5 w-full bg-transparent overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <main className="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-6 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                    <div className="flex-1 w-full space-y-12">
                        <nav className="flex items-center gap-4">
                            {activeSteps.map((step, idx) => (
                                <React.Fragment key={step.id}>
                                    <div className={`flex flex-col gap-1 ${idx <= currentStepIndex ? 'opacity-100' : 'opacity-20'}`}>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">Step 0{idx + 1}</span>
                                        <span className={`text-xs font-bold ${idx === currentStepIndex ? 'text-blue-600' : ''}`}>{step.title}</span>
                                    </div>
                                    {idx < activeSteps.length - 1 && (
                                        <ChevronDoubleRightIcon className={`w-3 h-3 transition-colors ${idx < currentStepIndex ? 'text-blue-600 opacity-60' : 'opacity-20'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>

                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                            {currentStep.description}
                        </h1>

                        <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>

                        <div className="flex items-center gap-4 pt-10 border-t border-current border-opacity-5">
                            {currentStepIndex > 0 && (
                                <button
                                    onClick={handlePrev}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-[#1D1D1F]'
                                        }`}
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                    Back
                                </button>
                            )}
                            {!isFinalStep && (
                                <button
                                    onClick={handleNext}
                                    disabled={!isStepValid}
                                    className={`flex items-center gap-2 px-10 py-3 rounded-full font-bold text-sm transition-all shadow-xl ${isStepValid
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                            : 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    Continue
                                    <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            )}
                            {isFinalStep && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !isStepValid}
                                    className={`flex items-center gap-2 px-10 py-3 rounded-full font-bold text-sm transition-all shadow-xl ${isSaving || !isStepValid
                                            ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-50'
                                            : 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20'
                                        }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Save QR Code
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-[420px] shrink-0">
                        <div className="sticky top-28">
                            <PreviewCard 
                                settings={settings} 
                                showDownload={isFinalStep} 
                                onUpdate={handleUpdateSettings}
                                currentStepIndex={currentStepIndex}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 px-6 border-t border-current border-opacity-5 text-center">
                <p className="opacity-30 text-[11px] font-bold uppercase tracking-[0.2em]">© 2025 NovaQR Studio • Professional Edition</p>
            </footer>
        </div>
    );
}
