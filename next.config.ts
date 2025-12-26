import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 1. Reactの厳格モードを有効化
  reactStrictMode: true,

  // 2. 本番環境でのconsole.logを消す
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 3. 画像のドメイン許可
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
