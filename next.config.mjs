// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow dev asset loading from other origins (like your intranet IP)
  allowedDevOrigins: ["http://10.22.112.6"],

  // Optional: Webpack tweak if you had earlier changes
  webpack: (config, { isServer }) => {
    if (!isServer) config.cache = false;
    return config;
  },

  // Add a dev-time header to allow cross-origin API requests
  async headers() {
    return [
      {
        source: "/:path*", // match all routes
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
