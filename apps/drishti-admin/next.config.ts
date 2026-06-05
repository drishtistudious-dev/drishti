import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure TurboPack can locate the workspace root
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  // Keep existing options (if any)
  // config options here
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
