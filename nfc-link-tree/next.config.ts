import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      // Upload de avatar aceita até 5MB; folga para o overhead do multipart.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    // Avatares enviados pelo painel ficam no Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
