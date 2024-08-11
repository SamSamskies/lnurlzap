/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/.well-known/lnurlp/:id',
        destination: '/api/zap/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
