/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  // Optimize development performance
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['placehold.co'],
  },
  webpack: (config, { dev, isServer }) => {
    // Add optimizations only for development
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig;
