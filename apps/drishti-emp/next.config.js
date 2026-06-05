const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbo: {
    root: path.resolve(__dirname, '../../'),
  },
  reactStrictMode: true,
  swcMinify: true,
};
module.exports = nextConfig;
