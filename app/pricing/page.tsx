'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import {
  CheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
  SunIcon,
  MoonIcon,
  ArrowRightIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import * as Switch from '@radix-ui/react-switch';

export default function PricingPage() {
  const router = useRouter();
  const settings = useAppSelector((state: any) => state.qrSettings);
  const dispatch = useAppDispatch();
  const isDark = settings.theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleTheme = () => {
    dispatch(updateSettings({ theme: isDark ? 'light' : 'dark' }));
  };

  const handleGetStarted = () => {
    router.push('/create/content');
  };

  const pricingPlans = [
    {
      name: 'AI Suggestions Pack',
      price: '$10',
      period: 'one-time',
      description: 'Get 25 additional AI-powered design suggestions to enhance your QR codes',
      gradient: 'from-purple-500 to-pink-500',
      icon: SparklesIcon,
      features: [
        '25 AI suggestions',
        'One-time payment',
        'Never expires',
        'Works with any account',
        'Instant activation',
      ],
      buttonText: 'Purchase Now',
    },
    {
      name: 'QR Code Boost',
      price: '$5',
      period: 'one-time',
      description: 'Add 20 more QR codes to your account permanently',
      gradient: 'from-blue-500 to-cyan-500',
      icon: RocketLaunchIcon,
      features: [
        '20 additional QR codes',
        'One-time payment',
        'Permanent addition',
        'Works with any account',
        'Instant activation',
      ],
      buttonText: 'Purchase Now',
    },
    {
      name: 'Dynamic QR Codes',
      price: '$10',
      period: 'per month',
      description: 'Update QR code content without changing the code itself. Perfect for campaigns and marketing materials.',
      gradient: 'from-green-500 to-emerald-500',
      icon: QrCodeIcon,
      features: [
        '50 dynamic QR codes',
        'Update content anytime',
        'No reprinting needed',
        'Real-time updates',
        'Monthly subscription',
      ],
      buttonText: 'Subscribe Now',
    },
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
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="text-white font-black text-lg">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight">NovaQR Studio</span>
          </Link>
          <div className="flex items-center gap-4">
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
            <SignedOut>
              <Link
                href="/login?mode=sign-in"
                className="px-4 py-2 text-sm font-semibold hover:opacity-70 transition-opacity"
              >
                Sign In
              </Link>
              <Link
                href="/login?mode=sign-up"
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-500 transition-all"
              >
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-32 px-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-1000 ${
              isDark 
                ? 'bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-black' 
                : 'bg-gradient-to-br from-blue-50 via-purple-50 to-white'
            }`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-xl border transition-all ${
              isDark 
                ? 'bg-white/5 border-white/10 text-blue-400' 
                : 'bg-black/5 border-black/10 text-blue-600'
            }`}>
              <SparklesIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Simple, Transparent Pricing</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tight">
              Choose Your Plan
            </h1>

            <p className="text-2xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed font-light opacity-80">
              Start free with 4 QR codes and 2 AI suggestions. 
              <br />
              <span className="font-medium">Upgrade anytime with our flexible add-ons.</span>
            </p>
          </div>
        </section>

        {/* Free Tier Info */}
        <section className="py-16 px-8">
          <div className="max-w-[1000px] mx-auto">
            <div className={`p-8 rounded-[2rem] border text-center ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white border-black/10'
            }`}>
              <div className="mb-6">
                <h2 className="text-4xl font-black mb-4">Free Forever</h2>
                <p className={`text-xl ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  Every account starts with these features at no cost
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className={`p-6 rounded-2xl ${
                  isDark ? 'bg-white/5' : 'bg-black/5'
                }`}>
                  <div className="text-3xl font-black mb-2">4</div>
                  <div className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    QR Codes
                  </div>
                </div>
                <div className={`p-6 rounded-2xl ${
                  isDark ? 'bg-white/5' : 'bg-black/5'
                }`}>
                  <div className="text-3xl font-black mb-2">2</div>
                  <div className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    AI Suggestions
                  </div>
                </div>
              </div>
              <button
                onClick={handleGetStarted}
                className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-base hover:bg-blue-500 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Plans (Add-ons) */}
        <section className="py-20 px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-xl border ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-blue-400' 
                  : 'bg-black/5 border-black/10 text-blue-600'
              }`}>
                <RocketLaunchIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Upgrade Options</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                Enhance Your Experience
              </h2>
              <p className={`text-xl ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                Add more power to your QR code creation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative rounded-[3rem] p-8 transition-all duration-500 ${
                    isDark 
                      ? 'bg-white/5 border border-white/10 hover:border-white/20' 
                      : 'bg-white border border-black/10 hover:border-black/20'
                  } hover:scale-105 shadow-xl hover:shadow-2xl`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible 
                      ? 'translateY(0)' 
                      : 'translateY(50px)',
                    transitionDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="mb-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <plan.icon className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-3xl font-black mb-4">{plan.name}</h3>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black">{plan.price}</span>
                        <span className={`text-lg opacity-60 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                          /{plan.period}
                        </span>
                      </div>
                    </div>

                    <p className={`text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full py-4 rounded-full font-bold text-base transition-all mb-8 bg-gradient-to-r ${plan.gradient} text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95`}
                  >
                    {plan.buttonText}
                  </button>

                  <div className="space-y-4">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                      isDark ? 'text-white/40' : 'text-black/40'
                    }`}>
                      What's Included
                    </div>
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                        <span className={`text-sm ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-12 p-6 rounded-2xl border text-center ${
              isDark 
                ? 'bg-blue-500/10 border-blue-500/20' 
                : 'bg-blue-50 border-blue-200/50'
            }`}>
              <p className={`text-sm ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                <span className="font-bold">Note:</span> All add-ons can be purchased at any time and work with your free account. 
                Dynamic QR Codes require an active monthly subscription.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={`py-32 px-8 ${
          isDark ? 'bg-[#0a0a0a]' : 'bg-white'
        }`}>
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                Frequently Asked Questions
              </h2>
              <p className={`text-xl ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                Everything you need to know about our pricing
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: 'What do I get for free?',
                  a: 'Every account starts with 4 QR codes and 2 AI suggestions at no cost. You can use these features forever without any payment.',
                },
                {
                  q: 'Can I purchase multiple add-ons?',
                  a: 'Yes! You can purchase any combination of add-ons. For example, you can buy multiple AI suggestion packs or QR code boosts to stack them.',
                },
                {
                  q: 'Do one-time purchases expire?',
                  a: 'No, one-time purchases (AI Suggestions Pack and QR Code Boost) never expire. They\'re permanently added to your account.',
                },
                {
                  q: 'Can I cancel my Dynamic QR Codes subscription?',
                  a: 'Yes, you can cancel your Dynamic QR Codes subscription at any time. You\'ll retain access until the end of your billing period.',
                },
                {
                  q: 'What happens if I exceed my free limits?',
                  a: 'You can continue using the free tier, but you\'ll need to purchase add-ons to create more QR codes or use more AI suggestions.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 hover:border-white/20' 
                      : 'bg-black/5 border-black/10 hover:border-black/20'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                  <p className={`text-base ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`relative py-32 px-8 overflow-hidden ${
          isDark ? 'bg-gradient-to-b from-black to-blue-950/20' : 'bg-gradient-to-b from-white to-blue-50'
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
          
          <div className="relative z-10 max-w-[1000px] mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-xl border ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-black/5 border-black/10'
            }`}>
              <RocketLaunchIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Ready to Get Started?</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none">
              Start Creating
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Today
              </span>
            </h2>

            <p className="text-xl md:text-2xl mb-12 opacity-70 font-light max-w-2xl mx-auto">
              Join thousands of brands creating stunning QR codes. 
              <br />
              No credit card required to start.
            </p>

            <button
              onClick={handleGetStarted}
              className="group px-12 py-6 bg-blue-600 text-white rounded-full font-bold text-xl transition-all shadow-2xl shadow-blue-600/50 hover:shadow-blue-600/70 hover:scale-110 active:scale-95 flex items-center gap-3 mx-auto"
            >
              Start Free
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
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
            {['Documentation', 'Privacy', 'Terms'].map((link) => (
              <Link
                key={link}
                href="#"
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
    </div>
  );
}
