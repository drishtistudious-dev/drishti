import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure TurboPack can locate the workspace root
  turbopack: {
    root: __dirname,
  },
  // Keep existing options (if any)
}
  /* config options here */
};

export default nextConfig;
