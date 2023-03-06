/** @type {import('next').NextConfig} */
require('dotenv').config()
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env : {
    API_BASE_URL : process.env.API_BASE_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
