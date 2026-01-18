import Link from "next/link";
import { ToolStatusBadge } from "@/components/ToolStatusBadge";
import { getToolBySlug } from "@/lib/tool-registry";

export default function ToolPage({ params }: { params: { toolName: string } }) {
  const slug = params.toolName;

  const tool = getToolBySlug(slug);

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

  // tool.available should exist in your registry; fallback to true
  const available = typeof tool.available === "boolean" ? tool.available : true;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {tool.description}
          </p>
        </div>

        <ToolStatusBadge available={available} />
      </div>

      {!available && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            This tool is under development. You can explore other tools meanwhile.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium"
          >
            Explore all tools
          </Link>
        </div>
      )}

      {available && (
        <div className="rounded-xl border bg-card p-6">
          <p className="text-muted-foreground">
            This route is a placeholder wrapper. Your real tool UI is inside each tool page
            under <code className="px-2 py-1 bg-muted rounded">/src/app/tools/{slug}/page.tsx</code>.
          </p>
        </div>
      )}
    </div>
  );
}
