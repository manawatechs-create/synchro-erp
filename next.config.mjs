/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
  },
  // Ignorer les erreurs TypeScript en build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorer les erreurs ESLint en build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuration pour Netlify
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

export default nextConfig
