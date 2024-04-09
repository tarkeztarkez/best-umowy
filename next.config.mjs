/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/": ["./umowa.docx"]
    }
  }
};

export default nextConfig;
