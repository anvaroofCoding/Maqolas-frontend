import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/u/:username",
        destination: "/profil/:username",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
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
