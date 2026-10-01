import { projects } from "../data/projects";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.CF_PAGES_URL ||
  "https://shreenemane.pages.dev";

export const dynamic = "force-static";

export default function sitemap() {
  const currentDate = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const projectRoutes = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
