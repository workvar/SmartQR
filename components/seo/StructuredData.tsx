'use client';

import { StructuredData } from '@/lib/seo/structuredData';

interface StructuredDataProps {
  data: StructuredData | StructuredData[];
}

export function StructuredDataScript({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
