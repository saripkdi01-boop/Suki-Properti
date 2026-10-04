import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Foto hotlink langsung dari server SiKumbang BP Tapera
    remotePatterns: [{ protocol: "https", hostname: "sikumbang.tapera.go.id" }],
  },
};

export default nextConfig;
