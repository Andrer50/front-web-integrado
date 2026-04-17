import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/api/:path((?!auth|files/).*)",
          destination: `${process.env.BACKEND_URL}/api/:path*`,
        },
        {
          source: "/auth/:path((?!sign-in$).*)",
          destination: `${process.env.BACKEND_AUTH_URL}/auth/:path*`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
