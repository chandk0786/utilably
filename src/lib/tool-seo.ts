// src/lib/tool-seo.ts
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, Tool, isToolIndexable } from "@/lib/tool-registry";

type JsonLd = Record<string, any>;

export function buildToolMetadata(tool: Tool): Metadata {
  const canonical = `${SITE_URL}${tool.path}`;
  const shouldIndex = isToolIndexable(tool);

  return {
    title: tool.seoTitle || `${tool.name} | ${SITE_NAME}`,
    description: tool.seoDescription || tool.description,
    keywords: tool.keywords?.length ? tool.keywords : undefined,

    alternates: {
      canonical,
    },

    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
      },
    },

    openGraph: {
      type: "website",
      url: canonical,
      title: tool.seoTitle || `${tool.name} | ${SITE_NAME}`,
      description: tool.seoDescription || tool.description,
      siteName: SITE_NAME,
    },

    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle || `${tool.name} | ${SITE_NAME}`,
      description: tool.seoDescription || tool.description,
    },
  };
}

export function buildToolJsonLd(tool: Tool): JsonLd[] {
  const canonical = `${SITE_URL}${tool.path}`;
  const categoryMap: Record<string, string> = {
    pdf: "PDF Tool",
    converter: "Converter",
    generator: "Generator",
    calculator: "Calculator",
    editor: "Editor",
    utility: "Utility Tool",
  };

  const softwareApp: JsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: categoryMap[tool.category] || "WebApplication",
    operatingSystem: "Web",
    url: canonical,
    description: tool.seoDescription || tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbs: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${SITE_URL}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: canonical,
      },
    ],
  };

  const faq: JsonLd | null =
    tool.faqs?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }
      : null;

  return [softwareApp, breadcrumbs, ...(faq ? [faq] : [])];
}
