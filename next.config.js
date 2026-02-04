/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // Cache gambar selama 1 tahun di CDN Vercel
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  compiler: {
    // Menghapus console logs di production untuk mengurangi ukuran bundle
    removeConsole: process.env.NODE_ENV === 'production',
  },
  output: 'standalone',
  // Kompresi gzip otomatis
  compress: true,
}

module.exports = nextConfig