// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Allow localhost for development
        port: '3000',
      },
    ],
  },
}

module.exports = nextConfig