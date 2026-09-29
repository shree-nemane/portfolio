/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  agentRules: false,
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
