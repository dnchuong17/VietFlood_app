import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

type RuntimeCachingRule = {
  urlPattern: RegExp;
  handler:
    | "NetworkOnly"
    | "CacheFirst"
    | "NetworkFirst"
    | "StaleWhileRevalidate";
  options?: {
    cacheName?: string;
  };
};

const runtimeCaching: RuntimeCachingRule[] = [
  {
    urlPattern: /^https?:\/\/vietflood-app\.azurewebsites\.net\/auth\/.*$/,
    handler: "NetworkOnly",
    options: {
      cacheName: "auth-api-network-only",
    },
  },
  {
    urlPattern: /^https?:\/\/vietflood-app\.azurewebsites\.net\/.*$/,
    handler: "NetworkOnly",
    options: {
      cacheName: "backend-api-network-only",
    },
  },
];

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching,
});

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
