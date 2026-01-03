'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
    SparklesIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    PhotoIcon,
    PaintBrushIcon,
    CloudArrowDownIcon,
    SunIcon,
    MoonIcon,
    CheckCircleIcon,
    CubeIcon,
    CpuChipIcon,
    ChartBarIcon,
    RocketLaunchIcon,
    CommandLineIcon,
    BeakerIcon,
    GlobeAltIcon,
} from '@heroicons/react/24/outline';
import * as Switch from '@radix-ui/react-switch';

interface LandingPageProps {
    onStart: () => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, isDark, toggleTheme }) => {
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
    const heroRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            
            // Check visibility of feature sections
            featuresRef.current.forEach((ref, index) => {
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
                    setIsVisible(prev => ({ ...prev, [`feature-${index}`]: isInView }));
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            title: 'AI-Powered Brand Intelligence',
            subtitle: 'Revolutionary Brand Extraction',
            description: 'Our advanced AI analyzes any website in seconds, extracting perfect brand colors, logos, and visual identity. No manual work. No guesswork. Just instant, pixel-perfect brand matching.',
            icon: CpuChipIcon,
            gradient: 'from-blue-500 to-cyan-500',
            image: '🎨',
            stats: ['99.9% Accuracy', 'Instant Analysis', 'Zero Manual Work']
        },
        {
            title: 'Infinite Design Possibilities',
            subtitle: 'Every Pixel, Under Your Control',
            description: 'Control every aspect of your QR code. Patterns, corners, eyes, colors, gradients, transparency—everything. Create designs that are truly yours, not templates.',
            icon: PaintBrushIcon,
            gradient: 'from-purple-500 to-pink-500',
            image: '✨',
            stats: ['50+ Pattern Styles', 'Unlimited Colors', 'Real-time Preview']
        },
        {
            title: 'Enterprise-Grade Reliability',
            subtitle: 'Scans Perfectly. Every Single Time.',
            description: 'Built with military-grade error correction. Your QR codes work flawlessly on any device, in any condition. Print them tiny or huge—they always scan.',
            icon: ShieldCheckIcon,
            gradient: 'from-green-500 to-emerald-500',
            image: '🛡️',
            stats: ['100% Scan Rate', 'Any Size Works', 'Perfect Every Time']
        },
        {
            title: 'Professional Export Suite',
            subtitle: 'Production-Ready Formats',
            description: 'Export in vector SVG for infinite scaling, transparent PNG for overlays, or optimized JPEG for web. Every format is production-ready, every time.',
            icon: PhotoIcon,
            gradient: 'from-orange-500 to-red-500',
            image: '📥',
            stats: ['Vector SVG', 'Transparent PNG', 'Optimized JPEG']
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-500 ${
            isDark 
                ? 'bg-black text-white' 
                : 'bg-[#F5F5F7] text-[#1D1D1F]'
        }`}>
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-500 ${
                isDark 
                    ? 'bg-black/80 border-b border-white/10' 
                    : 'bg-white/80 border-b border-black/5'
            }`}>
                <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight">NovaQR Studio</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/pricing"
                            className={`hidden sm:block text-sm font-semibold hover:opacity-70 transition-opacity ${
                                isDark ? 'text-white/80' : 'text-black/80'
                            }`}
                        >
                            Pricing
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full">
                            <SunIcon className={`w-4 h-4 transition-opacity ${isDark ? 'opacity-40' : 'opacity-100'}`} />
                            <Switch.Root
                                checked={isDark}
                                onCheckedChange={toggleTheme}
                                className={`w-11 h-6 rounded-full relative outline-none cursor-pointer transition-all ${
                                    isDark ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-md" />
                            </Switch.Root>
                            <MoonIcon className={`w-4 h-4 transition-opacity ${isDark ? 'opacity-100' : 'opacity-40'}`} />
                        </div>
                        <button
                            onClick={onStart}
                            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section - Massive & Animated */}
                <section 
                    ref={heroRef}
                    className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
                >
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div 
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                isDark 
                                    ? 'bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black' 
                                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-white'
                            }`}
                            style={{
                                transform: `translateY(${scrollY * 0.5}px)`,
                            }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
                    </div>

                    <div className="relative z-10 max-w-[1400px] mx-auto px-8 text-center">
                        {/* Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-xl border transition-all ${
                            isDark 
                                ? 'bg-white/5 border-white/10 text-blue-400' 
                                : 'bg-black/5 border-black/10 text-blue-600'
                        }`}>
                            <SparklesIcon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">AI-Powered QR Generation</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none tracking-tight">
                            <span className="block">Create QR Codes</span>
                            <span className={`block bg-gradient-to-r ${
                                isDark 
                                    ? 'from-blue-400 to-cyan-400' 
                                    : 'from-blue-600 to-cyan-600'
                            } bg-clip-text text-transparent`}>
                                That Actually Matter
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-2xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed font-light opacity-80">
                            The most advanced QR code generator ever built. 
                            <br />
                            <span className="font-medium">AI-powered. Infinitely customizable. Production-ready.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                            <button
                                onClick={onStart}
                                className="group px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg transition-all shadow-2xl shadow-blue-600/50 hover:shadow-blue-600/70 hover:scale-105 active:scale-95 flex items-center gap-3"
                            >
                                Start Creating Free
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                className={`px-10 py-5 rounded-full font-bold text-lg transition-all border-2 ${
                                    isDark
                                        ? 'border-white/20 text-white hover:bg-white/10'
                                        : 'border-black/20 text-black hover:bg-black/10'
                                } hover:scale-105 active:scale-95`}
                            >
                                Watch Demo
                            </button>
                        </div>

                        {/* Animated QR Code Preview */}
                        <div className="relative">
                            <div 
                                className={`inline-block p-8 rounded-[3rem] backdrop-blur-2xl border transition-all ${
                                    isDark 
                                        ? 'bg-white/5 border-white/10 shadow-2xl' 
                                        : 'bg-white/80 border-black/10 shadow-2xl'
                                }`}
                                style={{
                                    transform: `translateY(${Math.sin(scrollY * 0.01) * 20}px) rotate(${Math.sin(scrollY * 0.005) * 2}deg)`,
                                    transition: 'transform 0.1s ease-out',
                                }}
                            >
                                <div className="w-64 h-64 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                    <div className="w-48 h-48 bg-white rounded-2xl p-4">
                                        <div className="w-full h-full bg-black rounded-lg grid grid-cols-8 gap-1">
                                            {Array.from({ length: 64 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`rounded transition-all duration-300 ${
                                                        Math.random() > 0.5 
                                                            ? 'bg-black' 
                                                            : isDark ? 'bg-white/20' : 'bg-gray-200'
                                                    }`}
                                                    style={{
                                                        animationDelay: `${i * 0.01}s`,
                                                        animation: 'pulse 2s ease-in-out infinite',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className={`w-6 h-10 rounded-full border-2 ${
                            isDark ? 'border-white/30' : 'border-black/30'
                        } flex items-start justify-center p-2`}>
                            <div className={`w-1 h-3 rounded-full ${
                                isDark ? 'bg-white/50' : 'bg-black/50'
                            } animate-pulse`} />
                        </div>
                    </div>
                </section>

                {/* Feature Sections - Each is a Full Screen Experience */}
                {features.map((feature, index) => (
                    <section
                        key={index}
                        ref={el => { featuresRef.current[index] = el; }}
                        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
                            index % 2 === 0 
                                ? (isDark ? 'bg-black' : 'bg-white')
                                : (isDark ? 'bg-[#0a0a0a]' : 'bg-[#F5F5F7]')
                        }`}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className={`absolute inset-0 bg-gradient-to-br ${
                                feature.gradient
                            }`} />
                        </div>

                        <div className={`relative z-10 max-w-[1400px] mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                            index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                        }`}>
                            {/* Content Side */}
                            <div className={`space-y-8 ${
                                index % 2 === 1 ? 'lg:col-start-2' : ''
                            }`}>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                                    isDark 
                                        ? 'bg-white/5 border border-white/10' 
                                        : 'bg-black/5 border border-black/10'
                                }`}>
                                    <feature.icon className={`w-5 h-5 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        {feature.subtitle}
                                    </span>
                                </div>

                                <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tight">
                                    {feature.title}
                                </h2>

                                <p className="text-xl md:text-2xl leading-relaxed opacity-70 font-light max-w-2xl">
                                    {feature.description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 pt-8">
                                    {feature.stats.map((stat, statIndex) => (
                                        <div
                                            key={statIndex}
                                            className={`p-4 rounded-2xl backdrop-blur-xl border transition-all ${
                                                isDark 
                                                    ? 'bg-white/5 border-white/10' 
                                                    : 'bg-black/5 border-black/10'
                                            }`}
                                            style={{
                                                animationDelay: `${statIndex * 0.1}s`,
                                                animation: isVisible[`feature-${index}`] 
                                                    ? 'fadeInUp 0.6s ease-out forwards' 
                                                    : 'none',
                                                opacity: isVisible[`feature-${index}`] ? 1 : 0,
                                            }}
                                        >
                                            <div className={`text-2xl font-black bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                                {stat.split(' ')[0]}
                                            </div>
                                            <div className="text-xs opacity-60 mt-1">
                                                {stat.split(' ').slice(1).join(' ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={onStart}
                                    className={`px-8 py-4 rounded-full font-bold text-base transition-all bg-gradient-to-r ${feature.gradient} text-white shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2`}
                                >
                                    Try It Now
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Visual Side */}
                            <div className={`relative ${
                                index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''
                            }`}>
                                <div 
                                    className={`relative p-12 rounded-[3rem] backdrop-blur-2xl border transition-all ${
                                        isDark 
                                            ? 'bg-white/5 border-white/10' 
                                            : 'bg-white/80 border-black/10'
                                    } shadow-2xl`}
                                    style={{
                                        transform: isVisible[`feature-${index}`]
                                            ? 'translateY(0) scale(1)'
                                            : 'translateY(50px) scale(0.95)',
                                        opacity: isVisible[`feature-${index}`] ? 1 : 0,
                                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    {/* Large Emoji/Icon */}
                                    <div className={`text-9xl mb-8 text-center bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                        {feature.image}
                                    </div>

                                    {/* Feature-specific Visual */}
                                    <div className={`w-full h-64 rounded-2xl bg-gradient-to-br ${feature.gradient} p-8 flex items-center justify-center shadow-2xl`}>
                                        <div className={`w-full h-full rounded-xl ${
                                            isDark ? 'bg-black/20' : 'bg-white/20'
                                        } backdrop-blur-xl flex items-center justify-center`}>
                                            {index === 0 && (
                                                <div className="text-center space-y-4">
                                                    <GlobeAltIcon className="w-16 h-16 mx-auto text-white" />
                                                    <div className="text-white font-bold">AI Analyzing...</div>
                                                    <div className="flex gap-2 justify-center">
                                                        {[0, 1, 2].map(i => (
                                                            <div
                                                                key={i}
                                                                className="w-2 h-2 bg-white rounded-full animate-pulse"
                                                                style={{ animationDelay: `${i * 0.2}s` }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {index === 1 && (
                                                <div className="grid grid-cols-4 gap-2">
                                                    {Array.from({ length: 16 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`aspect-square rounded-lg bg-gradient-to-br ${feature.gradient} animate-pulse`}
                                                            style={{ animationDelay: `${i * 0.05}s` }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {index === 2 && (
                                                <div className="text-center space-y-4">
                                                    <ShieldCheckIcon className="w-16 h-16 mx-auto text-white" />
                                                    <div className="text-white font-bold text-2xl">100%</div>
                                                    <div className="text-white/80">Scan Success Rate</div>
                                                </div>
                                            )}
                                            {index === 3 && (
                                                <div className="flex gap-4">
                                                    {['SVG', 'PNG', 'JPG'].map((format, i) => (
                                                        <div
                                                            key={format}
                                                            className="px-6 py-4 bg-white/20 rounded-xl backdrop-blur-xl text-white font-bold"
                                                            style={{
                                                                animationDelay: `${i * 0.1}s`,
                                                                animation: 'fadeInUp 0.6s ease-out forwards',
                                                            }}
                                                        >
                                                            {format}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* Final CTA Section */}
                <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
                    isDark ? 'bg-gradient-to-b from-black to-blue-950/20' : 'bg-gradient-to-b from-white to-blue-50'
                }`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
                    
                    <div className="relative z-10 max-w-[1200px] mx-auto px-8 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-xl border ${
                            isDark 
                                ? 'bg-white/5 border-white/10' 
                                : 'bg-black/5 border-black/10'
                        }`}>
                            <RocketLaunchIcon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Ready to Transform Your Brand?</span>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-black mb-8 leading-none">
                            Start Creating
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Today
                            </span>
                        </h2>

                        <p className="text-2xl md:text-3xl mb-12 opacity-70 font-light max-w-2xl mx-auto">
                            Join thousands of brands creating stunning QR codes in minutes, not hours.
                        </p>

                        <button
                            onClick={onStart}
                            className="group px-12 py-6 bg-blue-600 text-white rounded-full font-bold text-xl transition-all shadow-2xl shadow-blue-600/50 hover:shadow-blue-600/70 hover:scale-110 active:scale-95 flex items-center gap-3 mx-auto"
                        >
                            Create Your First QR Code
                            <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {['No Credit Card', 'Free Forever', 'Instant Access'].map((item, i) => (
                                <div
                                    key={i}
                                    className={`p-6 rounded-2xl backdrop-blur-xl border ${
                                        isDark 
                                            ? 'bg-white/5 border-white/10' 
                                            : 'bg-black/5 border-black/10'
                                    }`}
                                >
                                    <CheckCircleIcon className={`w-8 h-8 mb-4 ${
                                        isDark ? 'text-green-400' : 'text-green-600'
                                    }`} />
                                    <div className="font-bold text-lg mb-2">{item}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className={`py-16 px-8 border-t ${
                isDark 
                    ? 'bg-black border-white/10' 
                    : 'bg-white border-black/5'
            }`}>
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="text-lg font-bold">NovaQR Studio</span>
                    </div>
                    <div className="flex gap-8">
                        {['Pricing', 'Documentation', 'Privacy', 'Terms'].map((link) => (
                            <Link
                                key={link}
                                href={link === 'Pricing' ? '/pricing' : '#'}
                                className={`text-sm font-medium hover:opacity-60 transition-opacity ${
                                    isDark ? 'text-white/60' : 'text-black/60'
                                }`}
                            >
                                {link}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className={`text-center mt-8 text-sm ${
                    isDark ? 'text-white/40' : 'text-black/40'
                }`}>
                    © 2025 NovaQR Studio. All rights reserved.
                </div>
            </footer>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
