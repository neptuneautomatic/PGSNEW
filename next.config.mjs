/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // For easier canvas manipulation without duplicate mount resets
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
