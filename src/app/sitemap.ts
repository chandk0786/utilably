import type { MetadataRoute } from "next";
import { toolRegistry } from "@/lib/tool-registry";

const SITE_URL = "https://utilably.com";

function isIndexable(tool: any) {
  return tool.status === "functional" || (tool.functionalityScore ?? 0) >= 80;
}

function toolUrl(tool: any) {
  // Support either field name: slug or path
  const p = tool.slug ?? tool.path;

  // If registry stores "/tools/xxx"
  if (typeof p === "string" && p.startsWith("/")) return `${SITE_URL}${p}`;

  // If registry stores "pdf-editor"
  if (typeof p === "string") return `${SITE_URL}/tools/${p}`;

  return null;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const urls = toolRegistry
    .filter(isIndexable)
    .map(toolUrl)
    .filter(Boolean) as string[];

  // remove duplicates safely
  const unique = Array.from(new Set(urls)).map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...unique,
  ];
}
