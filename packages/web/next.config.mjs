/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Web app served as a subpath at /AppBlueprints (under appblueprints.6x7.gr or 6x7.gr/AppBlueprints).
  basePath: process.env.APPBLUEPRINTS_BASE_PATH ?? "",
  transpilePackages: ["@appblueprints/core"],
  experimental: {
    serverComponentsExternalPackages: ["yaml"],
  },
};

export default nextConfig;
