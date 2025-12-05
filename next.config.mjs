/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer'

const nextConfig = {
  // فعال کردن Output Standalone برای عملکرد بهتر
  // output: 'standalone',
  images: {
    domains: [], // نیازی به دامنه نیست برای تصاویر محلی
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/images/**',
      },
      {
        protocol: 'http',
        hostname: 'ali1354.ir',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ali1354.ir',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      optimizeCss: true,
    },
  },
  compiler: {
    // 👇 کد جاوااسکریپت مدرن‌تر و کوچیک‌تر
    // removeConsole: process.env.NODE_ENV === 'production', // باعث میشه همه console.log ها در Production حذف بشن
  },
  // فشرده‌سازی
  // compress: true,

  // تولید Source Map فقط در Dev
  // productionBrowserSourceMaps: false,
}

// export default nextConfig

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
