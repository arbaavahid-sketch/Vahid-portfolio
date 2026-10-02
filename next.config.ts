import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Every route lives under /[locale]. The bare root sends people to Persian,
   * which is the market the brief puts first; the switcher in the header moves
   * them across without losing the page they are on.
   */
  async redirects() {
    return [{ source: "/", destination: "/fa", permanent: false }];
  },
};

export default nextConfig;
