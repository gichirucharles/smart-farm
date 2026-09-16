/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'kzmm5lume0e84kok2xki.lite.vusercontent.net',
      'v0.dev',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vusercontent.net',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
