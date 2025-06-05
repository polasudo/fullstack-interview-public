/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/*' // Backend běží na portu 80
      }
    ]
  }
}

module.exports = nextConfig 