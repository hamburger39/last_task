import withAntdLess from 'next-plugin-antd-less';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 他のNext.jsの設定
};

export default withAntdLess(nextConfig);