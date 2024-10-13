/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
  // Add this line to disable static exports for API routes
  output: 'standalone',
  serverRuntimeConfig: {
    // Will only be available on the server side
    dbCertPath: '/app/cert/ca-certificate.crt',
  },
};

module.exports = nextConfig;