
import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Label from '@radix-ui/react-label';
import {
    PhotoIcon,
    ArrowPathIcon,
    CloudArrowDownIcon,
    PlusIcon,
    ExclamationCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { QRSettings } from '@/types';

interface StepBrandingProps {
    settings: QRSettings;
    onUpdate: (updates: Partial<QRSettings>) => void;
    isDark?: boolean;
}

export const StepBranding: React.FC<StepBrandingProps> = ({ settings, onUpdate, isDark = false }) => {
    const [isFetchingLogo, setIsFetchingLogo] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'info' } | null>(null);

    const labelClass = `block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-white/30' : 'text-black/30'}`;

    const compressImage = (file: File, maxSizeMB: number = 1.5): Promise<string> => {
        return new Promise((resolve, reject) => {
            const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
            
            // If file is already small enough, return as-is
            if (file.size <= maxSizeBytes) {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target?.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
                return;
            }

            // Create image to get dimensions
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (event) => {
                img.onload = () => {
                    // Calculate new dimensions (max 512x512 for logo)
                    const maxDimension = 512;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height / width) * maxDimension;
                            width = maxDimension;
                        } else {
                            width = (width / height) * maxDimension;
                            height = maxDimension;
                        }
                    }

                    // Create canvas and compress
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) {
                        reject(new Error('Could not create canvas context'));
                        return;
                    }

                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Try different quality levels to get under size limit
                    const qualityLevels = [0.8, 0.6, 0.4, 0.3, 0.2, 0.15];
                    let dataUrl = '';
                    
                    for (const quality of qualityLevels) {
                        dataUrl = canvas.toDataURL('image/jpeg', quality);
                        // Base64 is approximately 4/3 of the original size
                        // Subtract the data URL prefix length
                        const prefixLength = 'data:image/jpeg;base64,'.length;
                        const sizeInBytes = (dataUrl.length - prefixLength) * 3 / 4;
                        
                        if (sizeInBytes <= maxSizeBytes) {
                            resolve(dataUrl);
                            return;
                        }
                    }
                    
                    // If still too large, use the lowest quality
                    resolve(dataUrl || canvas.toDataURL('image/jpeg', 0.1));
                };
                
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = event.target?.result as string;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (2MB limit, but we'll compress to 1.5MB max)
        const maxSizeMB = 2;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        
        if (file.size > maxSizeBytes) {
            setToast({ 
                message: `Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${maxSizeMB}MB. Please use a smaller image.`, 
                type: 'error' 
            });
            setTimeout(() => setToast(null), 5000);
            // Reset the input
            e.target.value = '';
            return;
        }

        try {
            // Compress image if needed (target 1.5MB to be safe)
            const compressedDataUrl = await compressImage(file, 1.5);
            onUpdate({ logoUrl: compressedDataUrl });
            setToast({ message: "Logo uploaded successfully!", type: 'info' });
            setTimeout(() => setToast(null), 4000);
        } catch (error) {
            console.error('Error processing image:', error);
            setToast({ 
                message: "Failed to process image. Please try a different image.", 
                type: 'error' 
            });
            setTimeout(() => setToast(null), 5000);
            // Reset the input
            e.target.value = '';
        }
    };

    const isValidUrl = (url: string): boolean => {
        try {
            const trimmed = url.trim();
            if (!trimmed) return false;
            
            // Must start with http:// or https://
            if (!trimmed.match(/^https?:\/\//i)) {
                return false;
            }
            
            // Try to create URL object
            const urlObj = new URL(trimmed);
            
            // Must have a valid hostname
            const hostname = urlObj.hostname;
            if (!hostname) return false;
            
            // Must have a valid TLD (top-level domain)
            // Check for at least one dot and a TLD with 2+ characters
            const tldPattern = /\.[a-z]{2,}$/i;
            if (!tldPattern.test(hostname)) {
                return false;
            }
            
            // Additional check: hostname should not be just an IP address without TLD
            // But allow IP addresses if they're valid
            const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipPattern.test(hostname)) {
                // IP addresses are technically valid but we'll require domain names for logo fetching
                return false;
            }
            
            return true;
        } catch {
            return false;
        }
    };

    const fetchBrandLogo = async () => {
        if (!settings.url || !isValidUrl(settings.url)) {
            setToast({ 
                message: "Please enter a valid URL (e.g., https://example.com) to fetch logo.", 
                type: 'error' 
            });
            setTimeout(() => setToast(null), 4000);
            return;
        }
        
        setIsFetchingLogo(true);
        setToast(null); // Clear any previous toast
        
        try {
            const domain = settings.url.trim();
            const host = new URL(domain).hostname;
            
            // Try Clearbit logo API first
            const logoUrl = `https://logo.clearbit.com/${host}?size=512`;
            const { fetchLogo } = await import('@/app/actions');
            let base64 = await fetchLogo(logoUrl);

            if (base64) {
                onUpdate({ logoUrl: base64 });
                setIsFetchingLogo(false);
                setToast({ 
                    message: `Successfully fetched logo for ${host}`, 
                    type: 'info' 
                });
                setTimeout(() => setToast(null), 4000);
                return;
            }

            // Fallback to Google favicon API
            const fallbackUrl = `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
            base64 = await fetchLogo(fallbackUrl);

            if (base64) {
                onUpdate({ logoUrl: base64 });
                setIsFetchingLogo(false);
                setToast({ 
                    message: `Fetched favicon for ${host}`, 
                    type: 'info' 
                });
                setTimeout(() => setToast(null), 4000);
                return;
            }

            // Both methods failed
            setIsFetchingLogo(false);
            setToast({ 
                message: `Could not find a logo for ${host}. Please upload manually or try a different URL.`, 
                type: 'error' 
            });
            setTimeout(() => setToast(null), 5000);
            
        } catch (error) {
            console.error('Logo fetch error:', error);
            setIsFetchingLogo(false);
            
            // Provide more specific error messages
            let errorMessage = "Failed to fetch logo. ";
            if (error instanceof Error) {
                if (error.message.includes('fetch')) {
                    errorMessage += "Network error occurred. Please check your connection and try again.";
                } else if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
                    errorMessage += "CORS error. Please upload the logo manually.";
                } else {
                    errorMessage += "Please try uploading manually.";
                }
            } else {
                errorMessage += "Please upload the logo manually.";
            }
            
            setToast({ 
                message: errorMessage, 
                type: 'error' 
            });
            setTimeout(() => setToast(null), 5000);
        }
    };

    return (
        <div className="relative">
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                    <div className={`w-40 h-40 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 transition-all ${settings.logoUrl ? 'border-blue-600 bg-blue-600/5' : isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-6" />
                        ) : (
                            <PhotoIcon className="w-12 h-12 opacity-10" />
                        )}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${isDark ? 'border-white/10 hover:border-white/30' : 'border-black/5 hover:border-black/20'}`}>
                            <PlusIcon className="w-6 h-6 opacity-40" />
                            <span className="text-xs font-bold uppercase tracking-widest text-center">Upload File</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                        {(() => {
                            const urlValid = settings.url && isValidUrl(settings.url);
                            return urlValid ? (
                                <button
                                    onClick={fetchBrandLogo}
                                    disabled={isFetchingLogo}
                                    className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-[2rem] transition-all ${isDark ? 'border-blue-500/20 hover:border-blue-500/50' : 'border-blue-600/10 hover:border-blue-600/30'}`}
                                >
                                    {isFetchingLogo ? (
                                        <ArrowPathIcon className="w-6 h-6 animate-spin text-blue-600" />
                                    ) : (
                                        <CloudArrowDownIcon className="w-6 h-6 text-blue-600" />
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 text-center">Smart Fetch</span>
                                </button>
                            ) : null;
                        })()}
                    </div>
                </div>
            </div>

            {toast && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all animate-in slide-in-from-bottom-4 duration-300 z-[1000] border ${toast.type === 'error'
                    ? 'bg-red-500 border-red-600 text-white'
                    : 'bg-blue-600 border-blue-700 text-white'
                    }`}>
                    {toast.type === 'error' ? <ExclamationCircleIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                    <span className="text-sm font-bold">{toast.message}</span>
                </div>
            )}
        </div>
    );
};
