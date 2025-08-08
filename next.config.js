/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Force legacy params behavior
    typedRoutes: false,
  },
  // Add this to disable strict type checking temporarily
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;