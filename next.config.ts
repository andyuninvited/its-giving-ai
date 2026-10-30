import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  outputFileTracingIncludes: { "/api/card": ["./assets/fonts/**"] },
};

export default nextConfig;
