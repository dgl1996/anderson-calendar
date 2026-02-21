/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
EOF && echo "✅ 彻底清理完成" && cat next.config.ts