import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export", trailingSlash: true } : {}),
  images: {
    ...(isPages ? { unoptimized: true } : {}),
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
