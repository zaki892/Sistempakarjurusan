/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mysql2'],
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig
