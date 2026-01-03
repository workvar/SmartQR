
import React, { useEffect, useRef, useState } from 'react';
import { QRSettings } from '../types';
import { FEATURE_FLAGS } from '../config';
import { ArrowDownTrayIcon, ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { getUserData } from '@/app/actions';

const SCRIPT_URL = 'https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js';

interface PreviewCardProps {
    settings: QRSettings;
    showDownload?: boolean;
    onUpdate?: (updates: Partial<QRSettings>) => void;
    currentStepIndex?: number; // 0 = Content, 1 = Branding, 2 = Design
}

const PreviewCard: React.FC<PreviewCardProps> = ({ settings, showDownload = false, onUpdate, currentStepIndex = 2 }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const qrStylingRef = useRef<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [libLoaded, setLibLoaded] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiRemaining, setAiRemaining] = useState<number | null>(null);
    const isDark = settings.theme === 'dark';

    // Load AI remaining count when on design step
    useEffect(() => {
        if (currentStepIndex === 2 && onUpdate && settings.url) {
            // Simple URL validation check
            const urlValid = settings.url.trim().length > 0 && 
                           settings.url.trim().match(/^https?:\/\//i);
            
            if (urlValid) {
                getUserData().then(data => {
                    if (data) {
                        setAiRemaining(Math.max(0, 2 - data.ai_suggestions_used));
                    }
                }).catch(() => {
                    setAiRemaining(null);
                });
            }
        }
    }, [currentStepIndex, settings.url, onUpdate]);

    useEffect(() => {
        // Check if script is already loaded
        if ((window as any).QRCodeStyling) {
            setLibLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.onload = () => setLibLoaded(true);
        document.body.appendChild(script);
        return () => {
            // Don't remove script as it might be used by other components or re-mounts
            // document.body.removeChild(script); 
        };
    }, []);

    useEffect(() => {
        // Only render QR code on step 2 (Design step)
        if (currentStepIndex !== 2) {
            if (qrStylingRef.current && qrRef.current) {
                qrRef.current.innerHTML = '';
                qrStylingRef.current = null;
            }
            return;
        }

        if (!libLoaded || !qrRef.current) return;

        // @ts-ignore
        const QRCodeStyling = (window as any).QRCodeStyling;
        if (!QRCodeStyling) return;

        // Ensure URL is present - if not, don't render QR code
        if (!settings.url || settings.url.trim() === '') {
            // Clear the QR code if URL is missing
            if (qrStylingRef.current && qrRef.current) {
                qrRef.current.innerHTML = '';
                qrStylingRef.current = null;
            }
            return;
        }

        const dotsOptions: any = {
            type: settings.dotsType,
            color: settings.dotsGradientEnabled ? undefined : settings.dotsColor,
            gradient: settings.dotsGradientEnabled ? {
                type: settings.dotsGradientType,
                rotation: (settings.dotsGradientRotation * Math.PI) / 180,
                colorStops: [
                    { offset: 0, color: settings.dotsColor },
                    { offset: 1, color: settings.dotsGradientSecondary }
                ]
            } : undefined
        };

        // For dynamic QRs, we need to use the scan URL for QR generation, not the destination URL
        // The settings.url might contain the destination URL (for editing), but we need the scan URL
        let qrDataUrl = settings.url.trim();
        
        // If it's a dynamic QR, check if the URL is a scan URL (contains /dynamic/scan/)
        // If not, it's the destination URL and we should use the scan URL from settings
        // For new dynamic QRs being created, we can't generate the QR yet (no scan URL exists)
        if (settings.isDynamic) {
            // Check if URL is already a scan URL
            if (!qrDataUrl.includes('/dynamic/scan/')) {
                // This is a destination URL, not a scan URL
                // For editing, the scan URL should be passed in settings.url
                // For new creation, we can't show QR preview (scan URL doesn't exist yet)
                // In this case, we'll use the destination URL as placeholder, but it won't be the final QR
                // The actual QR will be generated with scan URL when saved
            }
        }
        
        const qrConfig = {
            width: 320,
            height: 320,
            data: qrDataUrl, // Use trimmed URL, ensure it's not empty
            margin: settings.margin,
            dotsOptions,
            backgroundOptions: {
                color: settings.isTransparent ? 'transparent' : (settings.bgGradientEnabled ? undefined : settings.backgroundColor),
                gradient: !settings.isTransparent && settings.bgGradientEnabled ? {
                    type: settings.bgGradient.type,
                    rotation: (settings.bgGradient.rotation * Math.PI) / 180,
                    colorStops: settings.bgGradient.colorStops
                } : undefined
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: settings.logoMargin,
                imageSize: settings.logoSize,
                hideBackgroundDots: true,
            },
            cornersSquareOptions: {
                color: settings.cornerSquareColor,
                type: settings.cornerSquareType,
            },
            cornersDotOptions: {
                color: settings.cornerDotColor,
                type: settings.cornerDotType,
            },
            image: settings.logoUrl || undefined
        };

        try {
            if (!qrStylingRef.current) {
                qrStylingRef.current = new QRCodeStyling(qrConfig);
                qrStylingRef.current.append(qrRef.current);
            } else {
                // Clear and re-append if update fails or container is empty
                if (!qrRef.current.hasChildNodes()) {
                    qrStylingRef.current = new QRCodeStyling(qrConfig);
                    qrStylingRef.current.append(qrRef.current);
                } else {
                    qrStylingRef.current.update(qrConfig);
                }
            }
        } catch (error) {
            console.error('Error updating QR code:', error);
            // If update fails, try to recreate
            if (qrRef.current) {
                qrRef.current.innerHTML = '';
                qrStylingRef.current = new QRCodeStyling(qrConfig);
                qrStylingRef.current.append(qrRef.current);
            }
        }
    }, [settings, libLoaded, currentStepIndex]);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDownload = (ext: 'png' | 'svg' | 'webp' | 'jpeg', transparent = false) => {
        if (qrStylingRef.current) {
            if (transparent && ext === 'png') {
                const oldBg = settings.backgroundColor;
                const wasTransparent = settings.isTransparent;
                qrStylingRef.current.update({ backgroundOptions: { color: 'transparent', gradient: undefined } });
                qrStylingRef.current.download({ name: 'NovaQR_Transparent', extension: ext });
                setTimeout(() => {
                    qrStylingRef.current.update({
                        backgroundOptions: {
                            color: wasTransparent ? 'transparent' : (settings.bgGradientEnabled ? undefined : oldBg),
                            gradient: !wasTransparent && settings.bgGradientEnabled ? {
                                type: settings.bgGradient.type,
                                rotation: (settings.bgGradient.rotation * Math.PI) / 180,
                                colorStops: settings.bgGradient.colorStops
                            } : undefined
                        }
                    });
                }, 150);
            } else {
                qrStylingRef.current.download({ name: 'NovaQR_Design', extension: ext });
            }
        }
        setIsDropdownOpen(false);
    };

    // URL validation function (same as in StepBranding)
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
            const tldPattern = /\.[a-z]{2,}$/i;
            if (!tldPattern.test(hostname)) {
                return false;
            }
            
            // Reject IP addresses
            const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipPattern.test(hostname)) {
                return false;
            }
            
            return true;
        } catch {
            return false;
        }
    };

    const handleAISuggestion = async () => {
        if (!settings.url || !onUpdate) return;
        
        // Validate URL before making request
        if (!isValidUrl(settings.url)) {
            console.error('[AI] Invalid URL:', settings.url);
            return;
        }
        
        // Extract only the base URL (protocol + hostname + pathname) without query parameters or hash
        // This prevents passing large query strings that could cause 431 errors
        let urlToAnalyze: string;
        try {
            const urlObj = new URL(settings.url.trim());
            // Reconstruct URL with only protocol, hostname, and pathname
            urlToAnalyze = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
            
            // Validate length
            if (urlToAnalyze.length > 2048) {
                console.error('[AI] URL too long:', urlToAnalyze.length);
                return;
            }
        } catch (error) {
            console.error('[AI] Invalid URL format:', error);
            return;
        }
        
        setIsAILoading(true);
        try {
            // Only pass the content URL (what user entered) to AI
            console.log('[AI] Calling getBrandingInsights with URL:', urlToAnalyze);
            const { getBrandingInsights } = await import('@/app/actions');
            const suggestion = await getBrandingInsights(urlToAnalyze);
            
            console.log('[AI] Received suggestion:', suggestion);

            // Store the current URL before any updates to ensure it's preserved
            const currentUrl = settings.url;
            
            if (!currentUrl || currentUrl.trim() === '') {
                console.error('[AI] URL is missing');
                setIsAILoading(false);
                return;
            }

            // Prepare update object - only update colors, preserve everything else
            const updates: Partial<QRSettings> = {
                // CRITICAL: Always preserve the URL to prevent QR code from disappearing
                url: currentUrl,
                dotsColor: suggestion.primaryColor,
                cornerSquareColor: suggestion.secondaryColor,
                cornerDotColor: suggestion.secondaryColor,
            };

            // Handle background color/gradient
            const hasBackground = suggestion.backgroundColor && 
                                  suggestion.backgroundColor !== null && 
                                  suggestion.backgroundColor.trim() !== '';
            
            if (hasBackground && suggestion.backgroundColor) {
                const bgColor = suggestion.backgroundColor.trim();
                if (suggestion.bgGradientEnabled && suggestion.bgGradientSecondary && suggestion.bgGradientSecondary.trim() !== '') {
                    // Apply gradient background
                    updates.backgroundColor = bgColor;
                    updates.bgGradientEnabled = true;
                    updates.isTransparent = false;
                    // Update gradient color stops
                    updates.bgGradient = {
                        type: 'linear',
                        rotation: 45,
                        colorStops: [
                            { offset: 0, color: bgColor },
                            { offset: 1, color: suggestion.bgGradientSecondary.trim() }
                        ]
                    };
                } else {
                    // Apply solid background
                    updates.backgroundColor = bgColor;
                    updates.bgGradientEnabled = false;
                    updates.isTransparent = false;
                }
            } else {
                // Transparent background (skip background)
                updates.isTransparent = true;
                updates.bgGradientEnabled = false;
            }

            // Double-check URL is still in updates before applying
            if (!updates.url || updates.url.trim() === '') {
                console.error('[AI] URL was lost in updates object!', updates);
                setIsAILoading(false);
                return;
            }

            console.log('[AI] Applying updates:', updates);
            onUpdate(updates);
            
            // Update remaining count after successful AI suggestion
            const updatedData = await getUserData();
            if (updatedData) {
                setAiRemaining(Math.max(0, 2 - updatedData.ai_suggestions_used));
            }
        } catch (error: any) {
            console.error('[AI] Error:', error);
            if (error.message && error.message.includes('limit reached')) {
                alert(error.message);
                // Update count to show 0 remaining
                setAiRemaining(0);
            } else if (error.message && error.message.includes('not authenticated')) {
                alert('Please log in to use AI suggestions');
            }
        } finally {
            setIsAILoading(false);
        }
    };

    // Step 0 = Content (no preview), Step 1 = Branding (show logo), Step 2 = Design (show QR)
    const showQRCode = currentStepIndex === 2;
    const showLogo = currentStepIndex === 1;

    const frameStyle = settings.frameEnabled ? {
        border: `${settings.frameThickness}px ${settings.frameStyle} ${settings.frameColor}`,
        padding: `${settings.framePadding}px`,
        borderRadius: `${settings.frameBorderRadius}px`,
    } : {};

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">

            <div className={`relative p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden ${isDark ? 'bg-[#1D1D1F] ring-1 ring-white/10' : 'bg-white'
                }`}>

                {/* Anti-Direct-Download Overlay - only for QR code */}
                {showQRCode && (
                    <div
                        className="absolute inset-0 z-[50]"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                )}

                {/* Watermark Layer - only for QR code */}
                {showQRCode && FEATURE_FLAGS.ENABLE_WATERMARK && (
                    <div
                        className={`absolute inset-0 z-0 pointer-events-none flex items-center justify-center rotate-[-25deg] ${isDark ? 'opacity-5' : 'opacity-15'}`}
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, #C0C0C0 0, #C0C0C0 1px, transparent 0, transparent 50%)',
                            backgroundSize: '150px 150px',
                            color: isDark ? '#999' : '#333'
                        }}
                    >
                        <div className="grid grid-cols-4 gap-x-24 gap-y-16">
                            {Array(20).fill(0).map((_, i) => (
                                <span key={i} className={`text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>WORKVAR</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="relative aspect-square flex items-center justify-center">
                    {showQRCode && (
                        <>
                            <div style={frameStyle} className="relative z-10 transition-all duration-500 scale-95 group-hover:scale-100 flex items-center justify-center">
                                <div ref={qrRef} className="rounded-lg overflow-hidden flex items-center justify-center" />
                            </div>

                            {!libLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                </div>
                            )}
                        </>
                    )}
                    
                    {showLogo && (
                        <div className="w-full h-full flex items-center justify-center">
                            {settings.logoUrl ? (
                                <img 
                                    src={settings.logoUrl} 
                                    alt="Logo preview" 
                                    className="max-w-full max-h-full object-contain p-6" 
                                />
                            ) : (
                                <div className={`flex flex-col items-center justify-center gap-4 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium">No logo selected</span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {currentStepIndex === 0 && (
                        <div className={`flex flex-col items-center justify-center gap-4 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span className="text-sm font-medium">Enter URL to continue</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Unified Download Button with Dropdown - only show on Design step when QR code is visible */}
            {showDownload && showQRCode && FEATURE_FLAGS.ENABLE_DOWNLOAD_FORMATS && (
                <div className="space-y-4">
                    <div className="relative" ref={dropdownRef}>
                        <div className="flex">
                            <button
                                onClick={() => handleDownload('png')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-l-full text-sm font-semibold transition-all ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Download QR
                            </button>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`px-5 py-4 rounded-r-full border-l flex items-center justify-center transition-all ${isDark
                                        ? 'bg-white text-black hover:bg-gray-200 border-black/10'
                                        : 'bg-black text-white hover:bg-gray-800 border-white/10'
                                    }`}
                            >
                                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className={`absolute bottom-full left-0 right-0 mb-3 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-[100] ${isDark ? 'bg-zinc-900 ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'
                                }`}>
                                <div className="p-2 space-y-1">
                                    {FEATURE_FLAGS.DOWNLOAD_OPTIONS.PNG && (
                                        <button onClick={() => handleDownload('png')} className={`w-full text-left px-6 py-3 text-xs font-semibold rounded-2xl hover:bg-blue-600 hover:text-white transition-colors`}>PNG Image</button>
                                    )}
                                    {FEATURE_FLAGS.DOWNLOAD_OPTIONS.PNG_TRANSPARENT && (
                                        <button onClick={() => handleDownload('png', true)} className={`w-full text-left px-6 py-3 text-xs font-semibold rounded-2xl hover:bg-blue-600 hover:text-white transition-colors`}>PNG (Transparent)</button>
                                    )}
                                    {FEATURE_FLAGS.DOWNLOAD_OPTIONS.JPG && (
                                        <button onClick={() => handleDownload('jpeg')} className={`w-full text-left px-6 py-3 text-xs font-semibold rounded-2xl hover:bg-blue-600 hover:text-white transition-colors`}>JPG Format</button>
                                    )}
                                    {FEATURE_FLAGS.DOWNLOAD_OPTIONS.SVG && (
                                        <button onClick={() => handleDownload('svg')} className={`w-full text-left px-6 py-3 text-xs font-semibold rounded-2xl hover:bg-blue-600 hover:text-white transition-colors`}>Vector SVG</button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Suggestion Button - only show on Design step */}
                    {showQRCode && onUpdate && settings.url && isValidUrl(settings.url) && (
                        <div className="space-y-2">
                            <button
                                onClick={handleAISuggestion}
                                disabled={isAILoading || (aiRemaining !== null && aiRemaining === 0)}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-semibold transition-all ${isAILoading || (aiRemaining !== null && aiRemaining === 0)
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:scale-[1.02]'
                                } ${isDark 
                                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                }`}
                            >
                                {isAILoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-4 h-4" />
                                        <span>AI Design Suggestion</span>
                                    </>
                                )}
                            </button>
                            {aiRemaining !== null && (
                                <p className={`text-center text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                                    {aiRemaining > 0 ? (
                                        <span>{aiRemaining} suggestion{aiRemaining !== 1 ? 's' : ''} remaining</span>
                                    ) : (
                                        <span className={isDark ? 'text-orange-400' : 'text-orange-600'}>No AI suggestions remaining</span>
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Quality info - only show when QR code is visible */}
            {showQRCode && (
                <div className="flex justify-center gap-8 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                    <span>High Quality ECC</span>
                    <span>•</span>
                    <span>Resolution Optimized</span>
                </div>
            )}

        </div>
    );
};

export default PreviewCard;
