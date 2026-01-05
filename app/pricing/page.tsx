'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { AppHeader } from '@/components/common/AppHeader';
import { AppFooter } from '@/components/common/AppFooter';
import { PricingCard } from '@/components/pricing/PricingCard';
import { FAQItem } from '@/components/pricing/FAQItem';
import { pricingPlans, pricingFAQs, freePlanFeatures, pricingNote } from '@/data/pricingData';
import { StructuredDataScript } from '@/components/seo/StructuredData';
import { generateFAQSchema, generateBreadcrumbSchema, generateProductSchema } from '@/lib/seo/structuredData';

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

  const faqSchema = generateFAQSchema(
    pricingFAQs.map(faq => ({ question: faq.q, answer: faq.a }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_APP_URL || 'https://qrry.studio' },
    { name: 'Pricing', url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://qrry.studio'}/pricing` },
  ]);

  const productSchemas = pricingPlans.map(plan => 
    generateProductSchema({
      name: plan.name,
      description: plan.description,
      price: plan.price.replace('$', ''),
    })
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-black text-white' 
        : 'bg-[#F5F5F7] text-[#1D1D1F]'
    }`}>
      <StructuredDataScript data={[faqSchema, breadcrumbSchema, ...productSchemas]} />
      <AppHeader 
        isDark={isDark}
        onToggleTheme={toggleTheme}
        showPricing={false}
        showDashboard
      />

      <main className="pt-20">
        {/* Hero Section */}
        <section className={`relative py-24 px-8 border-b ${
          isDark 
            ? 'bg-black border-white/10' 
            : 'bg-white border-black/10'
        }`}>
          <div className="max-w-[1200px] mx-auto text-center">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 tracking-tight ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Pricing Plans
            </h1>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? 'text-white/70' : 'text-black/70'
            }`}>
              Transparent, flexible pricing designed to scale with your business needs
            </p>
          </div>
        </section>

        {/* Free Tier Info */}
        <section className={`py-20 px-8 ${
          isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'
        }`}>
          <div className="max-w-[1200px] mx-auto">
            <div className={`p-12 border ${
              isDark 
                ? 'bg-black border-white/10' 
                : 'bg-white border-black/10'
            }`}>
              <div className="grid md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-2">
                  <h2 className={`text-3xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>
                    Free Plan
                  </h2>
                  <p className={`text-lg mb-6 ${
                    isDark ? 'text-white/70' : 'text-black/70'
                  }`}>
                    Get started with our free tier. Perfect for individuals and small projects.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className={`text-4xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-black'
                      }`}>{freePlanFeatures.qrCodes}</div>
                      <div className={`text-sm font-medium ${
                        isDark ? 'text-white/60' : 'text-black/60'
                      }`}>
                        QR Codes
                      </div>
                    </div>
                    <div>
                      <div className={`text-4xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-black'
                      }`}>{freePlanFeatures.aiSuggestions}</div>
                      <div className={`text-sm font-medium ${
                        isDark ? 'text-white/60' : 'text-black/60'
                      }`}>
                        AI Suggestions
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className={`text-5xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-black'
                  }`}>$0</div>
                  <div className={`text-sm font-medium mb-6 ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}>
                    Forever free
                  </div>
                  <button
                    onClick={handleGetStarted}
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans (Add-ons) */}
        <section className={`py-20 px-8 ${
          isDark ? 'bg-black' : 'bg-white'
        }`}>
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-16">
              <h2 className={`text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Add-Ons & Upgrades
              </h2>
              <p className={`text-lg ${
                isDark ? 'text-white/70' : 'text-black/70'
              }`}>
                Enhance your plan with additional features and capabilities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {pricingPlans.map((plan, index) => (
                <PricingCard
                  key={plan.name}
                  plan={plan}
                  isDark={isDark}
                  isVisible={isVisible}
                  index={index}
                  onPurchase={handleGetStarted}
                />
              ))}
            </div>

            <div className={`mt-12 p-6 border ${
              isDark 
                ? 'bg-blue-950/20 border-blue-500/20' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm text-center ${
                isDark ? 'text-white/90' : 'text-black/90'
              }`}>
                <span className="font-semibold">Note:</span> {pricingNote}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={`py-20 px-8 border-t ${
          isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-gray-50 border-black/10'
        }`}>
          <div className="max-w-[1000px] mx-auto">
            <div className="mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-lg ${
                isDark ? 'text-white/70' : 'text-black/70'
              }`}>
                Common questions about our pricing and plans
              </p>
            </div>

            <div className="space-y-4">
              {pricingFAQs.map((faq, index) => (
                <FAQItem key={index} faq={faq} isDark={isDark} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 px-8 border-t ${
          isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'
        }`}>
          <div className="max-w-[1000px] mx-auto text-center">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              Ready to Get Started?
            </h2>
            <p className={`text-lg mb-8 ${
              isDark ? 'text-white/70' : 'text-black/70'
            }`}>
              Join thousands of businesses creating professional QR codes. No credit card required.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Start Free
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      <AppFooter isDark={isDark} />
    </div>
  );
}
