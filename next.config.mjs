/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: false,
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      // Add other routes here
    };
  },
};

export default nextConfig;
