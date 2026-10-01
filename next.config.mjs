const isCloudflare = process.env.CF_PAGES === "1";

const nextConfig = {
  agentRules: false,
  reactCompiler: true,

  ...(isCloudflare && {
    output: "export",
    images: {
      unoptimized: true,
    },
  }),

  ...(!isCloudflare && {
    async headers() {
      return [
        {
          source: "/:all*(svg|jpg|png|webp|ico)",
          headers: [
            {
              key: "Cache-Control",
              value:
                "public, max-age=86400, stale-while-revalidate=604800",
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;