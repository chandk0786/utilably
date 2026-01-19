import { Suspense } from "react";
import ToolsClient from "./tools-client";

export const dynamic = "force-dynamic";

export default function ToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading tools…</div>
        </div>
      }
    >
      <ToolsClient />
    </Suspense>
  );
}
