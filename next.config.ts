import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Increase header size limit to prevent 431 errors
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
