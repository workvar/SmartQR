
import React from 'react';
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
    ChartBarIcon
} from '@heroicons/react/24/outline';
import * as Switch from '@radix-ui/react-switch';

interface LandingPageProps {
    onStart: () => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, isDark, toggleTheme }) => {
    const features = [
        {
            title: 'AI-Powered Branding',
            description: 'Automatically extract high-resolution brand assets and color palettes from any domain using advanced AI.',
            icon: CloudArrowDownIcon,
            color: isDark ? 'text-blue-400' : 'text-blue-600'
        },
        {
            title: 'Precision Design Control',
            description: 'Granular control over pattern dots, eye geometry, corner styles, and visual aesthetics.',
            icon: PaintBrushIcon,
            color: isDark ? 'text-purple-400' : 'text-purple-600'
        },
        {
            title: 'Enterprise-Grade Reliability',
            description: 'Built-in error correction and verification ensure your QR codes scan perfectly every time.',
            icon: ShieldCheckIcon,
            color: isDark ? 'text-green-400' : 'text-green-600'
        },
        {
            title: 'Professional Export Formats',
            description: 'Download in SVG vector format, transparent PNG, or optimized JPEG for any production medium.',
            icon: PhotoIcon,
            color: isDark ? 'text-orange-400' : 'text-orange-600'
        }
    ];

    const capabilities = [
        'Custom color schemes and gradients',
        'Logo integration with smart positioning',
        'Multiple pattern styles',
        'Real-time preview and validation',
        'Batch generation support',
        'High-resolution vector exports'
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 flex flex-col ${
            isDark 
                ? 'bg-[#1a1a1a] text-[#ffffff]' 
                : 'bg-[#fafafa] text-[#323130]'
        }`}>
            {/* Header - Fluent Design Style */}
            <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
                isDark 
                    ? 'bg-[#1a1a1a]/80 border-b border-[#3a3a3a]' 
                    : 'bg-[#ffffff]/80 border-b border-[#edebe9]'
            }`}>
                <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isDark ? 'bg-[#0078d4]' : 'bg-[#0078d4]'
                        }`}>
                            <span className="text-white font-semibold text-lg">N</span>
                        </div>
                        <span className={`text-lg font-semibold ${
                            isDark ? 'text-[#ffffff]' : 'text-[#323130]'
                        }`}>NovaQR Studio</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-opacity-0">
                            <SunIcon className={`w-4 h-4 ${isDark ? 'text-[#605e5c]' : 'text-[#605e5c]'}`} />
                            <Switch.Root
                                checked={isDark}
                                onCheckedChange={toggleTheme}
                                className={`w-10 h-6 rounded-full relative outline-none cursor-pointer transition-colors ${
                                    isDark ? 'bg-[#0078d4]' : 'bg-[#c8c6c4]'
                                }`}
                            >
                                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px] shadow-sm" />
                            </Switch.Root>
                            <MoonIcon className={`w-4 h-4 ${isDark ? 'text-[#0078d4]' : 'text-[#605e5c]'}`} />
                        </div>
                        <button
                            onClick={onStart}
                            className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all ${
                                isDark
                                    ? 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                    : 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                            } shadow-sm hover:shadow-md`}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section - Microsoft Fluent Style */}
                <section className="relative pt-24 pb-32 px-6">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center mb-16">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md mb-8 ${
                                isDark 
                                    ? 'bg-[#0078d4]/10 text-[#60cdff] border border-[#0078d4]/20' 
                                    : 'bg-[#deecf9] text-[#0078d4] border border-[#c7e0f4]'
                            }`}>
                                <SparklesIcon className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Enterprise QR Solution</span>
                            </div>

                            <h1 className={`text-5xl md:text-7xl font-semibold mb-6 leading-tight ${
                                isDark ? 'text-[#ffffff]' : 'text-[#201f1e]'
                            }`}>
                                Professional QR Code
                                <br />
                                <span className="text-[#0078d4]">Generation Platform</span>
                            </h1>

                            <p className={`text-xl md:text-2xl mb-12 max-w-[800px] mx-auto leading-relaxed ${
                                isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                            }`}>
                                Create pixel-perfect QR codes with AI-powered branding, precision styling controls, and enterprise-grade reliability. Built for modern teams.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={onStart}
                                    className={`px-8 py-3.5 rounded-md font-semibold text-base transition-all flex items-center gap-2 ${
                                        isDark
                                            ? 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                            : 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                    } shadow-md hover:shadow-lg active:scale-[0.98]`}
                                >
                                    Start Creating
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                                <button
                                    className={`px-8 py-3.5 rounded-md font-semibold text-base transition-all ${
                                        isDark
                                            ? 'bg-transparent border-2 border-[#3a3a3a] text-[#ffffff] hover:bg-[#2a2a2a]'
                                            : 'bg-transparent border-2 border-[#c8c6c4] text-[#323130] hover:bg-[#f3f2f1]'
                                    }`}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Card-based Layout */}
                <section className="py-20 px-6 bg-opacity-0">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="text-center mb-16">
                            <h2 className={`text-4xl md:text-5xl font-semibold mb-4 ${
                                isDark ? 'text-[#ffffff]' : 'text-[#201f1e]'
                            }`}>
                                Powerful Features
                            </h2>
                            <p className={`text-lg ${
                                isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                            }`}>
                                Everything you need to create professional QR codes at scale
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-lg transition-all duration-200 ${
                                        isDark
                                            ? 'bg-[#252423] border border-[#3a3a3a] hover:border-[#0078d4]/50 hover:shadow-lg hover:shadow-[#0078d4]/10'
                                            : 'bg-[#ffffff] border border-[#edebe9] hover:border-[#0078d4]/50 hover:shadow-lg hover:shadow-[#0078d4]/10'
                                    } hover:-translate-y-1`}
                                >
                                    <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 ${
                                        isDark ? 'bg-[#0078d4]/10' : 'bg-[#deecf9]'
                                    }`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className={`text-xl font-semibold mb-2 ${
                                        isDark ? 'text-[#ffffff]' : 'text-[#201f1e]'
                                    }`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${
                                        isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                                    }`}>
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Capabilities Section */}
                <section className={`py-20 px-6 ${
                    isDark ? 'bg-[#252423]' : 'bg-[#f3f2f1]'
                }`}>
                    <div className="max-w-[1200px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className={`text-4xl md:text-5xl font-semibold mb-6 ${
                                    isDark ? 'text-[#ffffff]' : 'text-[#201f1e]'
                                }`}>
                                    Built for Modern Workflows
                                </h2>
                                <p className={`text-lg mb-8 ${
                                    isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                                }`}>
                                    NovaQR Studio combines cutting-edge AI technology with intuitive design tools to deliver professional results in minutes.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {capabilities.map((capability, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircleIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                                isDark ? 'text-[#107c10]' : 'text-[#107c10]'
                                            }`} />
                                            <span className={`text-sm ${
                                                isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                                            }`}>
                                                {capability}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`p-8 rounded-lg ${
                                isDark ? 'bg-[#1a1a1a] border border-[#3a3a3a]' : 'bg-[#ffffff] border border-[#edebe9]'
                            }`}>
                                <div className="aspect-square bg-gradient-to-br from-[#0078d4]/10 to-[#106ebe]/10 rounded-lg flex items-center justify-center">
                                    <div className="w-48 h-48 bg-white rounded-lg shadow-xl p-6 flex items-center justify-center">
                                        <div className="w-full h-full bg-gradient-to-br from-[#0078d4] to-[#106ebe] rounded opacity-20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6">
                    <div className="max-w-[1000px] mx-auto text-center">
                        <div className={`p-12 rounded-lg ${
                            isDark 
                                ? 'bg-gradient-to-br from-[#0078d4]/10 to-[#106ebe]/10 border border-[#0078d4]/20' 
                                : 'bg-gradient-to-br from-[#deecf9] to-[#c7e0f4] border border-[#0078d4]/20'
                        }`}>
                            <h2 className={`text-4xl md:text-5xl font-semibold mb-4 ${
                                isDark ? 'text-[#ffffff]' : 'text-[#201f1e]'
                            }`}>
                                Ready to Get Started?
                            </h2>
                            <p className={`text-lg mb-8 ${
                                isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                            }`}>
                                Create your first professional QR code in minutes
                            </p>
                            <button
                                onClick={onStart}
                                className={`px-10 py-4 rounded-md font-semibold text-lg transition-all ${
                                    isDark
                                        ? 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                        : 'bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]'
                                } shadow-lg hover:shadow-xl active:scale-[0.98]`}
                            >
                                Open Studio
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Fluent Design Style */}
            <footer className={`py-12 px-8 border-t ${
                isDark 
                    ? 'bg-[#1a1a1a] border-[#3a3a3a]' 
                    : 'bg-[#fafafa] border-[#edebe9]'
            }`}>
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className={`text-sm ${
                        isDark ? 'text-[#8a8886]' : 'text-[#605e5c]'
                    }`}>
                        © 2025 NovaQR Studio. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className={`text-sm hover:text-[#0078d4] transition-colors ${
                            isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                        }`}>
                            Documentation
                        </a>
                        <a href="#" className={`text-sm hover:text-[#0078d4] transition-colors ${
                            isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                        }`}>
                            Privacy
                        </a>
                        <a href="#" className={`text-sm hover:text-[#0078d4] transition-colors ${
                            isDark ? 'text-[#c8c6c4]' : 'text-[#605e5c]'
                        }`}>
                            Terms
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
