/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*",
            destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/:path*`,
          },
        ]
      : []
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.onrender.com", pathname: "/**" },
    ],
  },
}

module.exports = nextConfig
