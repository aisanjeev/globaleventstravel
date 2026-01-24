/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during production builds to avoid config issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/api/v1/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;

