
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow loading images from localhost or other domains if needed
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  }
};

export default nextConfig;
