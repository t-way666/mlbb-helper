import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8080/api/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'http://127.0.0.1:8080/static/:path*', // Проксируем статику (картинки)
      },
    ];
  },
};

export default nextConfig;
