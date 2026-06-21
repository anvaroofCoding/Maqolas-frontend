import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function getUploadProxyOrigin() {
  return (
    process.env.API_INTERNAL_ORIGIN ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ??
    "http://127.0.0.1:8000"
  );
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    const uploadProxyOrigin = getUploadProxyOrigin();

    return [
      {
        source: "/u/:username",
        destination: "/profil/:username",
      },
      {
        source: "/uploads/:path*",
        destination: `${uploadProxyOrigin}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/uzbek-maqolalar",
        destination: "/maqolalar",
        permanent: true,
      },
      {
        source: "/ozbek-maqolalar",
        destination: "/maqolalar",
        permanent: true,
      },
      {
        source: "/uzbekcha-maqolalar",
        destination: "/maqolalar",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "https", hostname: "maqolas.tm2.uz" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "c0.wallpaperflare.com" },
      { protocol: "https", hostname: "uzreport.news" },
      { protocol: "https", hostname: "static.norma.uz" },
      { protocol: "https", hostname: "tse1.mm.bing.net" },
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
