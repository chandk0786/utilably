import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://utilably.com";

  const routes = [
    "",
    "/tools",
    "/tools/qr-generator",
    "/tools/password-generator",
    "/tools/currency-converter",
    "/tools/text-case-converter",
    "/tools/unit-converter",
    "/tools/loan-calculator",
    "/tools/emi-calculator",
    "/tools/mortgage-calculator",
    "/tools/random-number-generator",
    "/tools/uuid-generator",
    "/tools/email-signature-generator",
    "/tools/code-generator",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
