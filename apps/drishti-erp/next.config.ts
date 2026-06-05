import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure TurboPack can locate the workspace root
  turbopack: {
    root: __dirname,
  },
  /* config options here */
};

export default nextConfig;
