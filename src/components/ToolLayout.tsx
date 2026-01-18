import { ReactNode } from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  keywords: string;
  children: ReactNode;
}

export default function ToolLayout({
  title,
  description,
  keywords,
  children,
}: ToolLayoutProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      {children}
    </>
  );
}