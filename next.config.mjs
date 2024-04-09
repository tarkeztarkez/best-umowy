/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/public': ['./public']
    }
  }
};

export default nextConfig;
