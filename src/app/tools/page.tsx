"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Calculator,
  Image,
  Code,
  FileSpreadsheet,
  Percent,
  Mail,
  QrCode,
  Lock,
  Type,
  Film,
  Music,
  Archive,
  DollarSign,
  Ruler,
  Home,
  Hash,
  Search,
  Filter,
  ChevronRight,
  Check,
  Clock,
  TrendingUp,
} from "lucide-react";

type ToolItem = {
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  href: string;
  available: boolean;
  trending?: boolean;
  keywords?: string[];
};

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "coming-soon">("all");
  const searchParams = useSearchParams();

  // Based on your audit report - Only updating the "available" status
  // NOTE: Added `trending` flags + ensured all 19 tools exist.
  const allTools: ToolItem[] = [
    // ===== PDF Tools =====
    {
      name: "PDF Editor",
      description: "Edit, annotate, and modify PDF files online",
      icon: FileText,
      color: "from-red-500 to-pink-500",
      category: "PDF Tools",
      href: "/tools/pdf-editor",
      available: false,
      trending: true,
      keywords: ["pdf", "editor", "annotate", "rotate"],
    },
    {
      name: "PDF to Word",
      description: "Convert PDF documents to editable Word files",
      icon: FileText,
      color: "from-blue-600 to-indigo-600",
      category: "PDF Tools",
      href: "/tools/pdf-to-word",
      available: false,
      trending: true,
      keywords: ["pdf", "word", "docx", "convert"],
    },
    {
      name: "PDF to Excel",
      description: "Convert PDF tables to Excel spreadsheets",
      icon: FileSpreadsheet,
      color: "from-green-500 to-emerald-500",
      category: "PDF Tools",
      href: "/tools/pdf-to-excel",
      available: false,
      keywords: ["pdf", "excel", "xlsx", "tables"],
    },

    // ===== Calculators =====
    {
      name: "Loan Calculator",
      description: "Calculate loan payments and interest rates",
      icon: Calculator,
      color: "from-blue-500 to-cyan-500",
      category: "Calculators",
      href: "/tools/loan-calculator",
      available: true,
      trending: true,
      keywords: ["loan", "interest", "amortization"],
    },
    {
      name: "EMI Calculator",
      description: "Calculate Equated Monthly Installments",
      icon: Percent,
      color: "from-purple-500 to-violet-500",
      category: "Calculators",
      href: "/tools/emi-calculator",
      available: true,
      trending: true,
      keywords: ["emi", "monthly", "interest"],
    },
    {
      name: "Mortgage Calculator",
      description: "Calculate home loan payments and amortization",
      icon: Home,
      color: "from-orange-500 to-amber-500",
      category: "Calculators",
      href: "/tools/mortgage-calculator",
      available: true,
      keywords: ["mortgage", "home loan", "amortization"],
    },

    // ===== Generators =====
    {
      name: "QR Code Generator",
      description: "Generate customizable QR codes",
      icon: QrCode,
      color: "from-indigo-500 to-blue-500",
      category: "Generators",
      href: "/tools/qr-generator",
      available: true,
      trending: true,
      keywords: ["qr", "qrcode", "generate"],
    },
    {
      name: "Password Generator",
      description: "Create strong, secure passwords",
      icon: Lock,
      color: "from-gray-700 to-gray-900",
      category: "Generators",
      href: "/tools/password-generator",
      available: true,
      trending: true,
      keywords: ["password", "secure", "random"],
    },
    {
      name: "Random Number Generator",
      description: "Generate random numbers within custom ranges",
      icon: Hash,
      color: "from-indigo-500 to-purple-500",
      category: "Generators",
      href: "/tools/random-number-generator",
      available: true,
      keywords: ["random", "numbers", "range"],
    },
    {
      name: "UUID Generator",
      description: "Generate unique identifiers (UUIDs)",
      icon: Code,
      color: "from-gray-800 to-gray-600",
      category: "Generators",
      href: "/tools/uuid-generator",
      available: true,
      keywords: ["uuid", "guid", "identifier"],
    },
    {
      name: "Email Signature Generator",
      description: "Create professional email signatures",
      icon: Mail,
      color: "from-blue-500 to-cyan-500",
      category: "Generators",
      href: "/tools/email-signature-generator",
      available: true,
      keywords: ["email", "signature", "html"],
    },
    {
      name: "Code Generator",
      description: "Generate code snippets in multiple languages",
      icon: Code,
      color: "from-gray-800 to-gray-600",
      category: "Generators",
      href: "/tools/code-generator",
      available: true,
      trending: true,
      keywords: ["code", "templates", "snippets"],
    },

    // ===== Converters =====
    {
      name: "Currency Converter",
      description: "Convert between world currencies with real-time rates",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      category: "Converters",
      href: "/tools/currency-converter",
      available: true,
      trending: true,
      keywords: ["currency", "usd", "inr", "eur", "rates"],
    },
    {
      name: "Text Case Converter",
      description: "Change text between uppercase, lowercase, title case",
      icon: Type,
      color: "from-teal-500 to-green-500",
      category: "Converters",
      href: "/tools/text-case-converter",
      available: true,
      keywords: ["text", "case", "uppercase", "lowercase"],
    },
    {
      name: "Unit Converter",
      description: "Convert length, weight, temperature, volume units",
      icon: Ruler,
      color: "from-cyan-500 to-blue-500",
      category: "Converters",
      href: "/tools/unit-converter",
      available: true,
      keywords: ["unit", "length", "weight", "temperature"],
    },
    {
      name: "Image Converter",
      description: "Convert between different image formats",
      icon: Image,
      color: "from-pink-500 to-rose-500",
      category: "Converters",
      href: "/tools/image-converter",
      available: false,
      keywords: ["image", "jpg", "png", "webp"],
    },
    {
      name: "Video Converter",
      description: "Convert video files between formats",
      icon: Film,
      color: "from-purple-600 to-pink-600",
      category: "Converters",
      href: "/tools/video-converter",
      available: false,
      keywords: ["video", "mp4", "mkv", "mov"],
    },
    {
      name: "Audio Converter",
      description: "Convert audio files between formats",
      icon: Music,
      color: "from-blue-600 to-indigo-600",
      category: "Converters",
      href: "/tools/audio-converter",
      available: false,
      keywords: ["audio", "mp3", "wav", "aac"],
    },

    // ===== Utility =====
    {
      name: "File Compressor",
      description: "Compress images and PDF files to reduce size",
      icon: Archive,
      color: "from-purple-500 to-violet-500",
      category: "Utility",
      href: "/tools/file-compressor",
      available: false,
      keywords: ["compress", "zip", "reduce", "size"],
    },
  ];

  // Read URL params and set state on load/change
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlFilter = searchParams.get("filter") || "";

    // Priority:
    // 1) search=... -> sets searchQuery
    // 2) category=... -> sets searchQuery to category (your current behavior)
    // 3) otherwise keep current typed search
    if (urlSearch) {
      setSearchQuery(urlSearch);
    } else if (urlCategory) {
      setSearchQuery(urlCategory);
    }

    // Status filter from URL if provided
    if (urlStatus === "available" || urlStatus === "coming-soon" || urlStatus === "all") {
      setStatusFilter(urlStatus);
    } else if (urlFilter === "trending") {
      // If filter=trending, default to showing all statuses
      setStatusFilter("all");
    }
  }, [searchParams]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const activeFilter = searchParams.get("filter") || "";
  const activeCategory = searchParams.get("category") || "";

  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      // SEARCH MATCH
      const matchesSearch =
        !normalizedQuery ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery) ||
        (tool.keywords?.join(" ").toLowerCase().includes(normalizedQuery) ?? false);

      // STATUS MATCH
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && tool.available) ||
        (statusFilter === "coming-soon" && !tool.available);

      // CATEGORY PARAM MATCH (strong category filtering)
      const matchesCategoryParam = !activeCategory || tool.category === activeCategory;

      // TRENDING FILTER
      const matchesTrending = activeFilter !== "trending" || !!tool.trending;

      return matchesSearch && matchesStatus && matchesCategoryParam && matchesTrending;
    });
  }, [allTools, normalizedQuery, statusFilter, activeFilter, activeCategory]);

  const categories = Array.from(new Set(allTools.map((tool) => tool.category)));

  const availableCount = allTools.filter((t) => t.available).length;
  const comingSoonCount = allTools.filter((t) => !t.available).length;
  const trendingCount = allTools.filter((t) => t.trending).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All <span className="text-primary">Online Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {availableCount} ready-to-use tools + {comingSoonCount} coming soon
            {activeFilter === "trending" ? ` • Showing ${trendingCount} trending tools` : ""}
          </p>
        </div>

        {/* Search & Stats */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex-1 w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search tools by name, category, or description..."
                  className="w-full pl-12 pr-4 py-3 bg-card border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{availableCount}</div>
                <div className="text-sm text-muted-foreground">Ready Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">{comingSoonCount}</div>
                <div className="text-sm text-muted-foreground">Coming Soon</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{allTools.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border hover:border-primary"
              }`}
            >
              All Tools
            </button>

            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("available");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                statusFilter === "available"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-card border hover:border-green-300"
              }`}
            >
              <Check className="h-4 w-4" />
              Ready Now
            </button>

            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("coming-soon");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                statusFilter === "coming-soon"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-card border hover:border-amber-300"
              }`}
            >
              <Clock className="h-4 w-4" />
              Coming Soon
            </button>

            {/* Optional: quick link for trending */}
            <Link
              href="/tools?filter=trending"
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeFilter === "trending"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-card border hover:border-primary"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Link>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/tools?category=${encodeURIComponent(category)}`}
                className="px-4 py-2 bg-card border rounded-lg hover:border-primary transition-colors text-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {activeFilter === "trending"
                ? "Trending Tools"
                : statusFilter === "available"
                ? "Ready Now Tools"
                : statusFilter === "coming-soon"
                ? "Coming Soon Tools"
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : "All Tools"}
              <span className="text-muted-foreground ml-2">({filteredTools.length})</span>
            </h2>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                className="bg-card border rounded-lg px-4 py-2 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Tools</option>
                <option value="available">Ready Now Only</option>
                <option value="coming-soon">Coming Soon Only</option>
              </select>
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground">Try a different search term or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => {
                const Card = (
                  <div
                    className={`group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 ${
                      tool.available
                        ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer border-green-200 hover:border-green-300"
                        : "opacity-90 cursor-not-allowed border-amber-200"
                    }`}
                  >
                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          tool.available
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {tool.available ? (
                          <>
                            <Check className="h-3 w-3 mr-1" /> Ready Now
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" /> Coming Soon
                          </>
                        )}
                      </span>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        {tool.category}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`mt-10 mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${tool.color} ${
                        !tool.available ? "opacity-80" : ""
                      }`}
                    >
                      <tool.icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>

                    {/* Action */}
                    <div className={`flex items-center text-sm font-medium ${tool.available ? "text-green-600" : "text-amber-600"}`}>
                      {tool.available ? (
                        <>
                          Use tool now
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Coming soon
                        </>
                      )}
                    </div>

                    {/* Disabled overlay (prevents click feeling) */}
                    {!tool.available && (
                      <div className="absolute inset-0 bg-background/35 pointer-events-none" />
                    )}
                  </div>
                );

                // IMPORTANT: Coming soon tools are not links
                if (tool.available) {
                  return (
                    <Link key={tool.href} href={tool.href}>
                      {Card}
                    </Link>
                  );
                }

                return (
                  <div key={tool.href} aria-disabled="true">
                    {Card}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Missing something?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {availableCount} tools are ready to use. {comingSoonCount} more are in development. Suggest which tool we
            should prioritize next!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-8 py-3 font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Suggest a Tool Priority
          </Link>
        </div>
      </div>
    </div>
  );
}
