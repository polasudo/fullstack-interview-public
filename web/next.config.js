/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:8000/:path*' // Použijeme název služby z docker-compose
      }
    ]
  }
}

module.exports = nextConfig 