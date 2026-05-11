import type { NextConfig } from "next";

const orderServiceUrl = process.env.ORDER_SERVICE_URL || "http://localhost:3001";
const inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || "http://localhost:3002";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/auth",
        destination: `${orderServiceUrl}/api/auth`,
      },
      {
        source: "/api/auth/:path*",
        destination: `${orderServiceUrl}/api/auth/:path*`,
      },
      {
        source: "/api/orders",
        destination: `${orderServiceUrl}/api/orders/`,
      },
      {
        source: "/api/orders/:path*",
        destination: `${orderServiceUrl}/api/orders/:path*`,
      },
      {
        source: "/api/books",
        destination: `${inventoryServiceUrl}/api/books/`,
      },
      {
        source: "/api/books/:path*",
        destination: `${inventoryServiceUrl}/api/books/:path*`,
      },
    ];
  },
};

export default nextConfig;
