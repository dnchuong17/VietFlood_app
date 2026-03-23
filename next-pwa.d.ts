declare module "next-pwa" {
  import type { NextConfig } from "next";

  type PWAPluginOptions = Record<string, unknown>;

  export default function withPWAInit(
    options?: PWAPluginOptions,
  ): (nextConfig: NextConfig) => NextConfig;
}
