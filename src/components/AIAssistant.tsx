"use client";

import { useEffect, useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

type AIAssistantProps = {
  initialCode: string;
  language: string;
};

export default function AIAssistant({
  initialCode,
  language,
}: AIAssistantProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Code Assistant
          </h3>
        </div>

        <span className="text-xs rounded-full bg-muted px-3 py-1 text-muted-foreground">
          {language}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">
        This assistant can help you review, improve, or extend the generated code.
      </p>

      {/* Code Preview */}
      <div className="relative">
        <pre className="max-h-72 overflow-auto rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-xs text-gray-800 dark:text-gray-100 border">
          {code || "// No code generated yet"}
        </pre>

        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1 text-xs hover:bg-muted transition"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Placeholder Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          disabled
          className="rounded-lg border px-3 py-1.5 text-xs text-muted-foreground cursor-not-allowed"
        >
          Improve code (coming soon)
        </button>
        <button
          disabled
          className="rounded-lg border px-3 py-1.5 text-xs text-muted-foreground cursor-not-allowed"
        >
          Add comments (coming soon)
        </button>
        <button
          disabled
          className="rounded-lg border px-3 py-1.5 text-xs text-muted-foreground cursor-not-allowed"
        >
          Optimize performance (coming soon)
        </button>
      </div>
    </div>
  );
}
