import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apricot-immense-carp-804.mypinata.cloud',
      },
    ],
  },
};

export default nextConfig;
