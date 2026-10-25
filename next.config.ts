import type { NextConfig } from "next";

const firebaseProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const nextConfig: NextConfig = {
  // Login de Google desde el mismo dominio de Isora (necesario en Chrome/Safari del celular,
  // que bloquean el almacenamiento de terceros): /__/auth/* → <proyecto>.firebaseapp.com
  async rewrites() {
    if (!firebaseProject) return [];
    return [
      { source: "/__/auth/:path*", destination: `https://${firebaseProject}.firebaseapp.com/__/auth/:path*` },
      { source: "/__/firebase/:path*", destination: `https://${firebaseProject}.firebaseapp.com/__/firebase/:path*` },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
