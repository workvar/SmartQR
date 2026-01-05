import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DOMAIN || 'https://qrry.studio';
const siteName = 'QRry Studio';

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function generateOrganizationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/Assets/logo-main.png`,
    description: 'Professional QR code generator with AI-powered branding and infinite customization options.',
    sameAs: [
      // Add your social media profiles here
      // 'https://twitter.com/qrrystudio',
      // 'https://facebook.com/qrrystudio',
      // 'https://linkedin.com/company/qrrystudio',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@qrry.studio',
    },
  };
}

export function generateWebApplicationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteName,
    url: siteUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Professional QR code generator with AI-powered branding, infinite customization, and production-ready exports.',
    featureList: [
      'AI-Powered Brand Intelligence',
      'Infinite Design Possibilities',
      'Enterprise-Grade Reliability',
      'Professional Export Suite',
      'Dynamic QR Codes',
      'Custom Branding',
    ],
  };
}

export function generateSoftwareApplicationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    description: 'Professional QR code generator with AI-powered branding and infinite customization options.',
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency || 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}
