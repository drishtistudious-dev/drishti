const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Turbopack can resolve the Next.js package from the monorepo root
  turbo: {
    root: path.resolve(__dirname, '../../'),
  },
  // Add any other production optimizations you need
  reactStrictMode: true,
  swcMinify: true,
};
module.exports = nextConfig;
