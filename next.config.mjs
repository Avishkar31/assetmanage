/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Disable Webpack cache temporarily for client-side builds
    if (!isServer) {
      config.cache = false;
    }

    // Example of additional custom configuration
    // config.plugins.push(new MyCustomWebpackPlugin());

    return config;
  }
};

export default nextConfig;
