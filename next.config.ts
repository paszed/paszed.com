import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/en" },
      { source: "/about", destination: "/en/about" },
      { source: "/contact", destination: "/en/contact" },
      { source: "/specs", destination: "/en/specs" },
      { source: "/projects", destination: "/en/projects" },
      { source: "/projects/:slug", destination: "/en/projects/:slug" },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
