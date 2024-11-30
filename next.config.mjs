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
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  assetPrefix: '.',
};

export default nextConfig;
