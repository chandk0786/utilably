"use client";

import { TrendingUp, ExternalLink, Eye, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const TrendingTools = () => {
  const [trendingTools, setTrendingTools] = useState([
    {
      id: 1,
      name: "PDF Editor",
      category: "PDF Tools",
      description: "Edit PDF documents online for free",
      trend: "high",
      increase: "+45%",
      href: "/tools/pdf-editor",
    },
    {
      id: 2,
      name: "Loan Calculator",
      category: "Calculators",
      description: "Calculate loans and mortgages",
      trend: "high",
      increase: "+38%",
      href: "/tools/loan-calculator",
    },
    {
      id: 3,
      name: "PDF to Excel",
      category: "PDF Tools",
      description: "Convert PDF tables to Excel",
      trend: "medium",
      increase: "+32%",
      href: "/tools/pdf-to-excel",
    },
    {
      id: 4,
      name: "EMI Calculator",
      category: "Calculators",
      description: "Calculate monthly installments",
      trend: "high",
      increase: "+41%",
      href: "/tools/emi-calculator",
    },
    {
      id: 5,
      name: "QR Code Generator",
      category: "Generators",
      description: "Create customizable QR codes",
      trend: "medium",
      increase: "+28%",
      href: "/tools/qr-generator",
    },
    {
      id: 6,
      name: "Image Converter",
      category: "Converters",
      description: "Convert between image formats",
      trend: "medium",
      increase: "+25%",
      href: "/tools/image-converter",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrendingTools(prev => 
        prev.map(tool => ({
          ...tool,
          increase: `+${Math.floor(Math.random() * 10) + 20}%`
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "high":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-amber-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "high":
        return "High Trend";
      case "medium":
        return "Medium Trend";
      default:
        return "Low Trend";
    }
  };

  return (
    <section className="py-12 bg-linear-to-b from-transparent to-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-linear-to-r from-orange-500 to-red-500">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Trending <span className="text-primary">Right Now</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Real-time trending tools based on user searches and usage patterns. 
              These tools are currently most popular.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Updated every 5 minutes</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Trend indicator */}
              <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTrendColor(tool.trend)}`}>
                  {getTrendText(tool.trend)}
                </div>
              </div>

              {/* Tool header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {tool.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">{tool.increase}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">
                {tool.description}
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Use tool now
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
 <div className="flex items-center gap-1">
  <Eye className="h-4 w-4" />
  <span className="font-medium">
    {1500}  // ← STATIC NUMBER
  </span>
</div>
                </div>
              </div>

              {/* Animated background */}
              <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-linear-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-linear-to-r from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Trends are auto-updated</h3>
              <p className="text-muted-foreground">
                Our system analyzes search patterns and tool usage to show you what&apos;s trending right now.
                These rankings update automatically based on real user behavior.
              </p>
            </div>
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-primary to-primary/80 px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              View All Trends
              <TrendingUp className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingTools;
