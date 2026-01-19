import type { Metadata } from "next";
import Link from "next/link";
import { getToolBySlug, isToolIndexable, SITE_NAME, SITE_URL, Tool } from "@/lib/tool-registry";

type Props = {
  params: { toolName: string };
};

function canonicalFromTool(tool: Tool, toolName: string) {
  if (tool?.path && tool.path.startsWith("/")) return `${SITE_URL}${tool.path}`;
  return `${SITE_URL}/tools/${toolName}`;
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolBySlug(params.toolName);

  if (!tool) {
    return {
      title: `Tool not found | ${SITE_NAME}`,
      description: `The tool you are looking for does not exist on ${SITE_NAME}.`,
      robots: { index: false, follow: false },
      alternates: { canonical: `${SITE_URL}/tools` },
    };
  }

  const canonical = canonicalFromTool(tool, params.toolName);

  // ✅ Use SAME rule across sitemap + metadata
  const indexable = isToolIndexable(tool);

  // ✅ Prefer SEO fields from registry (fallback to name/description)
  const title =
    tool.seoTitle?.trim() ||
    (tool.name ? `${tool.name} | ${SITE_NAME}` : `${SITE_NAME} Tool`);

  const description =
    tool.seoDescription?.trim() ||
    tool.description?.trim() ||
    `Free online tool on ${SITE_NAME}. Fast, secure, and easy to use.`;

  const keywords = Array.isArray(tool.keywords) ? tool.keywords : [];

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.toolName);

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Tool not found</h1>
        <p className="text-muted-foreground mb-6">
          The tool you’re looking for doesn’t exist.
        </p>
        <Link href="/tools" className="text-primary underline">
          Back to all tools
        </Link>
      </div>
    );
  }

  const indexable = isToolIndexable(tool);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{tool.name}</h1>

      <p className="text-muted-foreground max-w-2xl mb-8">
        {tool.seoDescription?.trim() || tool.description}
      </p>

      {!indexable && (
        <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          <p className="font-medium">Coming soon</p>
          <p className="text-sm mt-1">
            This tool is under development and is not indexed yet.
          </p>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">This page is a wrapper route.</p>
        <p className="text-muted-foreground mt-2">
          The actual tool UI is implemented in:
        </p>
        <code className="mt-3 inline-block rounded bg-muted px-3 py-2 text-sm">
          src/app/tools/{params.toolName}/page.tsx
        </code>

        <div className="mt-6">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium"
          >
            Browse all tools
          </Link>
        </div>
      </div>
    </div>
  );
}
