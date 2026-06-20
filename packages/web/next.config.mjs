/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Optional subpath when not served from the domain root (e.g. 6x7.gr/harness-forge).
  // Defaults to root, which is what harness-forge.6x7.gr uses.
  basePath: process.env.HARNESS_FORGE_BASE_PATH ?? "",
  transpilePackages: ["@appblueprints/core"],
  experimental: {
    serverComponentsExternalPackages: ["yaml"],
  },
};

export default nextConfig;
