'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import LandingPage from '@/components/LandingPage';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/qrSettingsSlice';
import { StructuredDataScript } from '@/components/seo/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';

export default function Page() {
  const router = useRouter();
  const settings = useAppSelector((state: any) => state.qrSettings);
  const dispatch = useAppDispatch();
  const isDark = settings.theme === 'dark';

  const handleStart = () => {
    router.push('/dashboard');
  };

  const toggleTheme = () => {
    dispatch(updateSettings({ theme: isDark ? 'light' : 'dark' }));
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: process.env.NEXT_PUBLIC_APP_URL || 'https://qrry.studio' },
  ]);

  return (
    <>
      <StructuredDataScript data={breadcrumbSchema} />
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <SignedOut>
        <Link
            href="/login?mode=sign-in"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
          <Link
            href="/login?mode=sign-up"
            className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign Up
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
      <LandingPage
        onStart={handleStart}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </>
  );
}
