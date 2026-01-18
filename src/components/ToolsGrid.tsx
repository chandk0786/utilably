import {
  FileText, Calculator, Image, Code, FileSpreadsheet,
  Percent, Mail, QrCode, Lock, DollarSign, Ruler,
  Home, Hash, Archive, Film, Music
} from "lucide-react";
import Link from "next/link";

type ToolStatus = "live" | "coming_soon";

type ToolItem = {
  name: string;
  description: string;
  icon: any;
  color: string;
  category: "PDF Tools" | "Calculators" | "Converters" | "Generators" | "Utility";
  href: string;
  status: ToolStatus;
};

const ToolsGrid = () => {
  // NOTE: update these statuses anytime you convert a tool from mock -> live
  const tools: ToolItem[] = [
    // PDF Tools
    { name: "PDF Editor", description: "Edit, annotate, and modify PDF files online", icon: FileText, color: "from-red-500 to-pink-500", category: "PDF Tools", href: "/tools/pdf-editor", status: "coming_soon" },
    { name: "PDF to Word", description: "Convert PDF documents to editable Word files", icon: FileText, color: "from-blue-600 to-indigo-600", category: "PDF Tools", href: "/tools/pdf-to-word", status: "coming_soon" },
    { name: "PDF to Excel", description: "Convert PDF tables to Excel spreadsheets", icon: FileSpreadsheet, color: "from-green-500 to-emerald-500", category: "PDF Tools", href: "/tools/pdf-to-excel", status: "coming_soon" },

    // Calculators (LIVE)
    { name: "Loan Calculator", description: "Calculate loan payments and interest rates", icon: Calculator, color: "from-blue-500 to-cyan-500", category: "Calculators", href: "/tools/loan-calculator", status: "live" },
    { name: "EMI Calculator", description: "Calculate Equated Monthly Installments", icon: Percent, color: "from-purple-500 to-violet-500", category: "Calculators", href: "/tools/emi-calculator", status: "live" },
    { name: "Mortgage Calculator", description: "Calculate home loan payments and amortization", icon: Home, color: "from-orange-500 to-amber-500", category: "Calculators", href: "/tools/mortgage-calculator", status: "live" },

    // Generators (LIVE)
    { name: "QR Code Generator", description: "Generate customizable QR codes", icon: QrCode, color: "from-indigo-500 to-blue-500", category: "Generators", href: "/tools/qr-generator", status: "live" },
    { name: "Password Generator", description: "Create strong, secure passwords", icon: Lock, color: "from-gray-700 to-gray-900", category: "Generators", href: "/tools/password-generator", status: "live" },
    { name: "Random Number Generator", description: "Generate random numbers within custom ranges", icon: Hash, color: "from-indigo-500 to-purple-500", category: "Generators", href: "/tools/random-number-generator", status: "live" },
    { name: "UUID Generator", description: "Generate unique identifiers (UUIDs)", icon: Code, color: "from-gray-800 to-gray-600", category: "Generators", href: "/tools/uuid-generator", status: "live" },
    { name: "Email Signature Generator", description: "Create professional email signatures", icon: Mail, color: "from-blue-500 to-cyan-500", category: "Generators", href: "/tools/email-signature-generator", status: "live" },
    { name: "Code Generator", description: "Generate code snippets in multiple languages", icon: Code, color: "from-gray-800 to-gray-600", category: "Generators", href: "/tools/code-generator", status: "live" },

    // Converters
    { name: "Currency Converter", description: "Convert between world currencies with real-time rates", icon: DollarSign, color: "from-yellow-500 to-orange-500", category: "Converters", href: "/tools/currency-converter", status: "live" },
    { name: "Text Case Converter", description: "Change text between uppercase, lowercase, title case", icon: Code, color: "from-teal-500 to-green-500", category: "Converters", href: "/tools/text-case-converter", status: "live" },
    { name: "Unit Converter", description: "Convert length, weight, temperature, volume units", icon: Ruler, color: "from-cyan-500 to-blue-500", category: "Converters", href: "/tools/unit-converter", status: "live" },
    { name: "Image Converter", description: "Convert between different image formats", icon: Image, color: "from-pink-500 to-rose-500", category: "Converters", href: "/tools/image-converter", status: "coming_soon" },
    { name: "Video Converter", description: "Convert video files between formats", icon: Film, color: "from-purple-600 to-pink-600", category: "Converters", href: "/tools/video-converter", status: "coming_soon" },
    { name: "Audio Converter", description: "Convert audio files between formats", icon: Music, color: "from-blue-600 to-indigo-600", category: "Converters", href: "/tools/audio-converter", status: "coming_soon" },

    // Utility
    { name: "File Compressor", description: "Compress images and PDF files to reduce size", icon: Archive, color: "from-purple-500 to-violet-500", category: "Utility", href: "/tools/file-compressor", status: "coming_soon" },
  ];

  const liveTools = tools.filter(t => t.status === "live");
  const comingSoonTools = tools.filter(t => t.status === "coming_soon");

  const ToolCard = ({ tool }: { tool: ToolItem }) => {
    const CardInner = (
      <div className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {tool.category}
          </span>
          {tool.status === "coming_soon" && (
            <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-700 px-3 py-1 text-xs font-semibold">
              Coming Soon
            </span>
          )}
        </div>

        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${tool.color}`}>
          <tool.icon className="h-7 w-7 text-white" />
        </div>

        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {tool.description}
        </p>

        <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {tool.status === "live" ? "Use tool" : "In progress"}
          <svg
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        <div className="absolute inset-0 -z-10 bg-linear-to-br from-transparent to-transparent group-hover:from-primary/5 group-hover:to-primary/5 transition-all duration-300" />

        {/* Disabled overlay */}
        {tool.status === "coming_soon" && (
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] pointer-events-none" />
        )}
      </div>
    );

    if (tool.status === "live") {
      return <Link href={tool.href}>{CardInner}</Link>;
    }

    // Coming soon: no link, no redirect
    return <div className="cursor-not-allowed opacity-90">{CardInner}</div>;
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Most Popular <span className="text-primary">Online Tools</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fully functional tools are ready now. Others are marked as Coming Soon.
          </p>
        </div>

        {/* LIVE */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold">✅ Fully Functional</h3>
            <span className="text-sm text-muted-foreground">{liveTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {liveTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>

        {/* COMING SOON */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-bold">⏳ Coming Soon</h3>
            <span className="text-sm text-muted-foreground">{comingSoonTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {comingSoonTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-input bg-background px-8 py-3 font-medium hover:bg-accent transition-colors"
          >
            View All {tools.length} Tools
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ToolsGrid;
