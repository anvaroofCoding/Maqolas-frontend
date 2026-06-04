import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Backend/media CDN URL qo‘shilganda:
      // { protocol: "https", hostname: "cdn.example.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    turbopackUseSystemTlsCerts: true,
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
