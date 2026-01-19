"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

type Tool = {
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  href: string;
  available: boolean;
  trending?: boolean;
};

export default function ToolsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "coming-soon">("all");
  const searchParams = useSearchParams();

  // Tool data (based on your audit)
  const allTools: Tool[] = useMemo(
    () => [
      {
        name: "PDF Editor",
        description: "Edit, annotate, and modify PDF files online",
        icon: FileText,
        color: "from-red-500 to-pink-500",
        category: "PDF Tools",
        href: "/tools/pdf-editor",
        available: true,
        trending: true,
      },
      {
        name: "PDF to Word",
        description: "Convert PDF documents to editable Word files",
        icon: FileText,
        color: "from-blue-600 to-indigo-600",
        category: "PDF Tools",
        href: "/tools/pdf-to-word",
        available: false,
      },
      {
        name: "Loan Calculator",
        description: "Calculate loan payments and interest rates",
        icon: Calculator,
        color: "from-blue-500 to-cyan-500",
        category: "Calculators",
        href: "/tools/loan-calculator",
        available: true,
        trending: true,
      },
      {
        name: "QR Code Generator",
        description: "Generate customizable QR codes",
        icon: QrCode,
        color: "from-indigo-500 to-blue-500",
        category: "Generators",
        href: "/tools/qr-generator",
        available: true,
        trending: true,
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
      },
      {
        name: "Image Converter",
        description: "Convert between different image formats",
        icon: Image,
        color: "from-pink-500 to-rose-500",
        category: "Converters",
        href: "/tools/image-converter",
        available: false,
      },
      {
        name: "Currency Converter",
        description: "Convert between world currencies with real-time rates",
        icon: DollarSign,
        color: "from-yellow-500 to-orange-500",
        category: "Converters",
        href: "/tools/currency-converter",
        available: true,
        trending: true,
      },
      {
        name: "Text Case Converter",
        description: "Change text between uppercase, lowercase, title case",
        icon: Type,
        color: "from-teal-500 to-green-500",
        category: "Converters",
        href: "/tools/text-case-converter",
        available: true,
      },
      {
        name: "Unit Converter",
        description: "Convert length, weight, temperature, volume units",
        icon: Ruler,
        color: "from-cyan-500 to-blue-500",
        category: "Converters",
        href: "/tools/unit-converter",
        available: true,
      },
      {
        name: "File Compressor",
        description: "Compress files to reduce size",
        icon: Archive,
        color: "from-purple-500 to-violet-500",
        category: "Utility",
        href: "/tools/file-compressor",
        available: false,
      },
      {
        name: "PDF to Excel",
        description: "Convert PDF tables to Excel spreadsheets",
        icon: FileSpreadsheet,
        color: "from-green-500 to-emerald-500",
        category: "PDF Tools",
        href: "/tools/pdf-to-excel",
        available: false,
      },
      {
        name: "EMI Calculator",
        description: "Calculate Equated Monthly Installments",
        icon: Percent,
        color: "from-purple-500 to-violet-500",
        category: "Calculators",
        href: "/tools/emi-calculator",
        available: true,
      },
      {
        name: "Mortgage Calculator",
        description: "Calculate home loan payments and amortization",
        icon: Home,
        color: "from-orange-500 to-amber-500",
        category: "Calculators",
        href: "/tools/mortgage-calculator",
        available: true,
      },
      {
        name: "Random Number Generator",
        description: "Generate random numbers within custom ranges",
        icon: Hash,
        color: "from-indigo-500 to-purple-500",
        category: "Generators",
        href: "/tools/random-number-generator",
        available: true,
      },
      {
        name: "UUID Generator",
        description: "Generate unique identifiers (UUIDs)",
        icon: Code,
        color: "from-gray-800 to-gray-600",
        category: "Generators",
        href: "/tools/uuid-generator",
        available: true,
      },
      {
        name: "Email Signature Generator",
        description: "Create professional email signatures",
        icon: Mail,
        color: "from-blue-500 to-cyan-500",
        category: "Generators",
        href: "/tools/email-signature-generator",
        available: true,
      },
      {
        name: "Video Converter",
        description: "Convert video files between formats",
        icon: Film,
        color: "from-purple-600 to-pink-600",
        category: "Converters",
        href: "/tools/video-converter",
        available: false,
      },
      {
        name: "Audio Converter",
        description: "Convert audio files between formats",
        icon: Music,
        color: "from-blue-600 to-indigo-600",
        category: "Converters",
        href: "/tools/audio-converter",
        available: false,
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
      },
    ],
    []
  );

  const availableCount = useMemo(() => allTools.filter((t) => t.available).length, [allTools]);
  const comingSoonCount = useMemo(() => allTools.filter((t) => !t.available).length, [allTools]);
  const categories = useMemo(() => Array.from(new Set(allTools.map((t) => t.category))), [allTools]);

  // Read URL params (search, category, filter=trending)
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlCategory = searchParams.get("category");
    const urlFilter = searchParams.get("filter");

    if (urlFilter === "trending") {
      setStatusFilter("all");
      setSearchQuery(""); // show trending list
      return;
    }

    if (urlSearch) setSearchQuery(urlSearch);
    else if (urlCategory) setSearchQuery(urlCategory);
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    const urlFilter = searchParams.get("filter");

    return allTools.filter((tool) => {
      const matchesTrending = urlFilter === "trending" ? Boolean(tool.trending) : true;

      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && tool.available) ||
        (statusFilter === "coming-soon" && !tool.available);

      return matchesTrending && matchesSearch && matchesStatus;
    });
  }, [allTools, searchQuery, statusFilter, searchParams]);

  const isTrendingView = searchParams.get("filter") === "trending";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isTrendingView ? (
              <>
                Trending <span className="text-primary">Tools</span>
              </>
            ) : (
              <>
                All <span className="text-primary">Online Tools</span>
              </>
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {availableCount} ready-to-use tools + {comingSoonCount} coming soon
          </p>
        </div>

        {/* Search & Stats */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex-1 w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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

            <Link
              href="/tools?filter=trending"
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-card border hover:border-primary"
            >
              Trending
            </Link>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className="px-4 py-2 bg-card border rounded-lg hover:border-primary transition-colors text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {statusFilter === "available"
                ? "Ready Now Tools"
                : statusFilter === "coming-soon"
                ? "Coming Soon Tools"
                : isTrendingView
                ? "Trending Tools"
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
              {filteredTools.map((tool) => (
                <div key={tool.href} className="group relative">
                  {tool.available ? (
                    <Link
                      href={tool.href}
                      className="block overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-green-200 hover:border-green-300"
                    >
                      <CardContent tool={tool} />
                    </Link>
                  ) : (
                    <div className="block overflow-hidden rounded-xl border bg-card p-6 opacity-90 cursor-not-allowed border-amber-200">
                      <CardContent tool={tool} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Missing something?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {availableCount} tools are ready to use. {comingSoonCount} more are in development.
            Suggest which tool we should prioritize next!
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

function CardContent({ tool }: { tool: Tool }) {
  return (
    <>
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
      <div className={`mt-10 mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${tool.color}`}>
        <tool.icon className="h-7 w-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
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
    </>
  );
}
