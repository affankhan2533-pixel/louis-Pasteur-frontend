/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure Next.js doesn't look outside the frontend directory for tracing
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: false,
    minimumCacheTTL: 1,
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
    // Allow Google profile photos from Firebase Auth
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
