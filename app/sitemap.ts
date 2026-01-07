import { TOOLS_REGISTRY, SITE_URL } from "@/lib/tools-registry"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = TOOLS_REGISTRY.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolPages,
  ]
}
