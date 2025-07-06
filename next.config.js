/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add font optimization settings for static export
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Disable font optimization for static builds to avoid timeout issues
  optimizeFonts: false,
};

module.exports = nextConfig;