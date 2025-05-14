/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
