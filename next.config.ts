import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/battle-mobile",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
