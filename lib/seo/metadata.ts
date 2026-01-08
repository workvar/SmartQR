import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DOMAIN || 'https://qrry.studio';
const siteName = 'QRry Studio';
const defaultDescription = 'Professional QR code generator with AI-powered branding, infinite customization, and production-ready exports. Create stunning QR codes in minutes.';
const defaultKeywords = [
  'QR code generator',
  'QR code creator',
  'custom QR codes',
  'AI QR code',
  'QR code design',
  'professional QR codes',
  'QR code branding',
  'dynamic QR codes',
  'vector QR codes',
  'QR code export',
  'free QR code generator',
  'free QR code download',
  'business QR codes',
  'marketing QR codes',
  'branded QR codes',
  'transparent QR generator'
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Professional QR Code Generator | AI-Powered & Customizable`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: 'Workvar Pvt. Ltd.' }],
  creator: 'Workvar Pvt. Ltd.',
  publisher: 'Workvar Pvt. Ltd.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${siteName} - Professional QR Code Generator`,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Professional QR Code Generator - Landing Page`,
        type: 'image/png',
      },
      {
        url: `${siteUrl}/Assets/logo-with-name.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Professional QR Code Generator`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Professional QR Code Generator`,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Professional QR Code Generator - Landing Page`,
      },
    ],
    creator: '@qrrystudio',
    site: '@qrrystudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'Technology',
};

export const homeMetadata: Metadata = {
  ...defaultMetadata,
  title: `${siteName} - Professional QR Code Generator | AI-Powered & Customizable`,
  description: 'Create professional QR codes with AI-powered branding, infinite customization options, and production-ready exports. Free QR code generator with advanced design tools.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: `${siteName} - Professional QR Code Generator | AI-Powered & Customizable`,
    description: 'Create professional QR codes with AI-powered branding, infinite customization options, and production-ready exports. Free QR code generator with advanced design tools.',
    url: siteUrl,
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: `${siteName} - Professional QR Code Generator | AI-Powered & Customizable`,
    description: 'Create professional QR codes with AI-powered branding, infinite customization options, and production-ready exports. Free QR code generator with advanced design tools.',
  },
};

export const pricingMetadata: Metadata = {
  ...defaultMetadata,
  title: 'Pricing Plans - Affordable QR Code Solutions',
  description: 'Transparent pricing for QR code generation. Start free with 4 QR codes and 2 AI suggestions. Upgrade with flexible add-ons for unlimited QR codes and features.',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'Pricing Plans - Affordable QR Code Solutions | QRry Studio',
    description: 'Transparent pricing for QR code generation. Start free with 4 QR codes and 2 AI suggestions. Upgrade with flexible add-ons for unlimited QR codes and features.',
    url: `${siteUrl}/pricing`,
    type: 'website',
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: 'Pricing Plans - Affordable QR Code Solutions | QRry Studio',
    description: 'Transparent pricing for QR code generation. Start free with 4 QR codes and 2 AI suggestions.',
  },
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
};

export const dashboardMetadata: Metadata = {
  ...defaultMetadata,
  title: 'Dashboard - Manage Your QR Codes',
  description: 'Manage and organize all your QR codes in one place. Edit, delete, and track your QR code usage and limits.',
  robots: {
    index: false,
    follow: false,
  },
};

export const createMetadata: Metadata = {
  ...defaultMetadata,
  title: 'Create QR Code - Custom QR Code Generator',
  description: 'Create custom QR codes with advanced design options. Add branding, customize colors, patterns, and export in multiple formats.',
  robots: {
    index: false,
    follow: false,
  },
};
