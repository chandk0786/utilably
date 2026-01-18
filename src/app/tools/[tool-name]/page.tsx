import Link from "next/link";
import { getToolBySlug } from "@/lib/tool-registry";

export default function ToolPage({
  params,
}: {
  params: { toolName: string };
}) {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {tool.name}
      </h1>

      <p className="text-muted-foreground max-w-2xl mb-8">
        {tool.description}
      </p>

      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">
          This page is a wrapper route.
        </p>
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
