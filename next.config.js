/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  basePath: "/github-pages",
  // exportPathMap: function () {
  //   return {
  //     "/": { page: "/" },
  //     // Add other routes here
  //   };
  // },
};

export default nextConfig;
