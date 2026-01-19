// src/lib/tool-registry.ts

export type ToolStatus = "functional" | "mock" | "wip" | "partial";
export type ToolCategory =
  | "pdf"
  | "converter"
  | "generator"
  | "calculator"
  | "editor"
  | "utility";

export interface Tool {
  // Identity / routing
  id: string; // stable id (also used as key)
  name: string; // display name
  path: string; // IMPORTANT: route path like "/tools/pdf-editor" (avoid storing full slug with domain)
  description: string; // short UI description

  // Classification
  category: ToolCategory;
  status: ToolStatus;

  // Quality / audit tracking
  functionalityScore: number; // 0-100
  lastTested: string;
  lastUpdated: string;
  dependencies: string[];
  hasRealConversion: boolean;
  hasFileProcessing: boolean;
  hasApiIntegration: boolean;
  features: string[];
  priority: number; // 1-10, 10 highest
  notes?: string;

  // SEO (NEW)
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  faqs: { q: string; a: string }[];

  // Growth (NEW)
  trending?: boolean;
}

/**
 * ✅ Site constants used by sitemap/metadata generators.
 * Keep these in one place so canonical URLs are consistent.
 */
export const SITE_URL = "https://utilably.com";
export const SITE_NAME = "Utilably";

/**
 * ✅ Helper to create consistent ISO timestamps
 */
const nowIso = () => new Date().toISOString();

/**
 * ✅ Helper to decide if a tool should be indexed by Google.
 * Rule: index ONLY when functional OR score >= 80 and not mock/wip.
 */
export function isToolIndexable(tool: Tool): boolean {
  if (tool.status === "functional") return true;
  if (tool.status === "partial" && tool.functionalityScore >= 80) return true;
  return false;
}

/**
 * ✅ FULL TOOL REGISTRY (19 tools)
 * IMPORTANT:
 * - Ensure "path" matches your actual folder route under src/app/tools/<tool>/page.tsx
 * - You can improve descriptions later, but this is already SEO-safe and usable.
 */
export const toolRegistry: Tool[] = [
  // =========================
  // PDF TOOLS
  // =========================
  {
    id: "pdf-editor",
    name: "PDF Editor",
    path: "/tools/pdf-editor",
    description: "Edit PDFs online: add text, rotate pages, preview & download.",
    category: "pdf",
    status: "functional",
    functionalityScore: 90,
    lastTested: "2026-01-19T00:00:00.000Z",
    lastUpdated: "2026-01-19T00:00:00.000Z",
    dependencies: ["pdf-lib"],
    hasRealConversion: true,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: ["add-text", "rotate-pages", "zoom-preview", "download-pdf", "blank-pdf"],
    priority: 9,
    seoTitle: "PDF Editor Online Free | Utilably",
    seoDescription:
      "Edit PDF files online for free. Add text, rotate pages, preview changes and download instantly. No signup required.",
    keywords: [
      "pdf editor",
      "edit pdf online",
      "add text to pdf",
      "rotate pdf",
      "free pdf editor",
    ],
    faqs: [
      { q: "Is this PDF editor free to use?", a: "Yes, Utilably’s PDF Editor is free and requires no signup." },
      { q: "Are my PDF files uploaded to a server?", a: "No. Your PDF is processed in your browser for privacy." },
      { q: "Can I add text and download the edited PDF?", a: "Yes. Add text, preview, then download the updated PDF." },
    ],
    trending: true,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    path: "/tools/pdf-to-word",
    description: "Convert PDF documents into editable Word files.",
    category: "pdf",
    status: "mock",
    functionalityScore: 10,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: ["upload", "conversion", "download-docx"],
    priority: 10,
    seoTitle: "PDF to Word Converter Online | Utilably",
    seoDescription:
      "Convert PDF to Word online. Upload your PDF and download an editable DOCX file. Fast and simple.",
    keywords: ["pdf to word", "convert pdf to docx", "pdf to doc converter"],
    faqs: [
      { q: "Can I convert PDF to Word for free?", a: "Yes, this tool is intended to be free once fully released." },
      { q: "Will formatting be preserved?", a: "Basic formatting preservation is planned for the full release." },
      { q: "Is it safe to upload PDFs?", a: "We aim for secure processing and privacy-first behavior." },
    ],
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    path: "/tools/pdf-to-excel",
    description: "Convert PDF tables into Excel spreadsheets.",
    category: "pdf",
    status: "mock",
    functionalityScore: 10,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: ["table-detection", "export-xlsx"],
    priority: 9,
    seoTitle: "PDF to Excel Converter Online | Utilably",
    seoDescription:
      "Convert PDF tables to Excel online. Upload a PDF and export spreadsheet data for editing.",
    keywords: ["pdf to excel", "convert pdf to xlsx", "pdf table to excel"],
    faqs: [
      { q: "Does it extract tables from PDF?", a: "Table extraction is planned for the full release." },
      { q: "Can I download as XLSX?", a: "Yes, XLSX export is part of the planned feature set." },
      { q: "Is the conversion accurate?", a: "Accuracy improves with clean, table-based PDFs." },
    ],
  },

  // =========================
  // CALCULATORS
  // =========================
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    path: "/tools/loan-calculator",
    description: "Calculate EMI, interest and amortization for loans.",
    category: "calculator",
    status: "functional",
    functionalityScore: 90,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["amortization", "currency-selection", "high-loan-limit"],
    priority: 8,
    seoTitle: "Loan Calculator Online | Utilably",
    seoDescription:
      "Calculate loan EMIs, total interest and monthly payments with an online loan calculator. Includes amortization schedule.",
    keywords: ["loan calculator", "emi calculator", "amortization calculator", "interest calculator"],
    faqs: [
      { q: "How is EMI calculated?", a: "EMI is calculated using principal, interest rate and loan tenure." },
      { q: "Does it show amortization schedule?", a: "Yes, it provides a month-by-month amortization breakdown." },
      { q: "Can I change currency?", a: "Yes, currency selection is supported." },
    ],
    trending: true,
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    path: "/tools/emi-calculator",
    description: "Calculate equated monthly instalments for loans.",
    category: "calculator",
    status: "functional",
    functionalityScore: 90,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["multi-currency", "high-amount-support", "schedule"],
    priority: 8,
    seoTitle: "EMI Calculator Online | Utilably",
    seoDescription:
      "Use this free EMI calculator to estimate monthly instalments, total interest and payment schedule. Works on mobile.",
    keywords: ["emi calculator", "monthly emi", "loan emi calculator", "emi schedule"],
    faqs: [
      { q: "Is EMI calculator free?", a: "Yes, it’s free to use on Utilably." },
      { q: "Does it include interest total?", a: "Yes, you can see total interest and total payable amount." },
      { q: "Can I use it for home loans?", a: "Yes, it works for home loans, personal loans and more." },
    ],
  },
  {
    id: "mortgage-calculator",
    name: "Mortgage Calculator",
    path: "/tools/mortgage-calculator",
    description: "Calculate home loan payments and amortization.",
    category: "calculator",
    status: "functional",
    functionalityScore: 90,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["amortization", "currency-selection", "breakdown"],
    priority: 8,
    seoTitle: "Mortgage Calculator Online | Utilably",
    seoDescription:
      "Estimate mortgage payments and amortization with this free mortgage calculator. Calculate monthly payments and total interest.",
    keywords: ["mortgage calculator", "home loan calculator", "amortization schedule", "housing loan emi"],
    faqs: [
      { q: "Does it show amortization?", a: "Yes, it provides an amortization schedule." },
      { q: "Can I calculate total interest?", a: "Yes, total interest and total payable are included." },
      { q: "Is it mobile-friendly?", a: "Yes, it works well on mobile and desktop." },
    ],
  },

  // =========================
  // CONVERTERS
  // =========================
  {
    id: "currency-converter",
    name: "Currency Converter",
    path: "/tools/currency-converter",
    description: "Convert currencies using real-time exchange rates.",
    category: "converter",
    status: "functional",
    functionalityScore: 90,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: true,
    features: ["real-time-rates", "150+-currencies", "swap"],
    priority: 9,
    seoTitle: "Currency Converter Online | Utilably",
    seoDescription:
      "Convert currencies online with real-time exchange rates. Supports 150+ currencies with fast conversion and swap.",
    keywords: ["currency converter", "exchange rate", "usd to inr", "eur to inr", "forex rates"],
    faqs: [
      { q: "Are exchange rates real-time?", a: "Rates are fetched from an API and updated regularly." },
      { q: "How many currencies are supported?", a: "150+ currencies are supported." },
      { q: "Can I swap currencies?", a: "Yes, you can instantly swap base and target currencies." },
    ],
    trending: true,
  },
  {
    id: "text-case-converter",
    name: "Text Case Converter",
    path: "/tools/text-case-converter",
    description: "Convert text to UPPERCASE, lowercase, Title Case and more.",
    category: "editor",
    status: "functional",
    functionalityScore: 85,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["11-case-types", "copy", "instant-convert"],
    priority: 7,
    seoTitle: "Text Case Converter Online | Utilably",
    seoDescription:
      "Convert text case online: uppercase, lowercase, title case, sentence case and more. Copy results instantly.",
    keywords: ["text case converter", "uppercase to lowercase", "title case converter", "sentence case"],
    faqs: [
      { q: "Which cases are supported?", a: "Uppercase, lowercase, title case, sentence case and more." },
      { q: "Can I copy the output?", a: "Yes, copy-to-clipboard is supported." },
      { q: "Does it work in real time?", a: "Yes, conversions happen instantly." },
    ],
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    path: "/tools/unit-converter",
    description: "Convert length, weight, temperature, volume and more.",
    category: "converter",
    status: "functional",
    functionalityScore: 85,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["multi-category", "40+-units", "fast-convert"],
    priority: 7,
    seoTitle: "Unit Converter Online | Utilably",
    seoDescription:
      "Convert units online for free: length, weight, temperature, volume and more. Fast, accurate and mobile-friendly.",
    keywords: ["unit converter", "length converter", "weight converter", "temperature converter", "kg to lbs"],
    faqs: [
      { q: "Which unit categories are supported?", a: "Common categories like length, weight, temperature, volume and more." },
      { q: "Is it accurate?", a: "Yes, it uses standard conversion factors." },
      { q: "Can I convert quickly?", a: "Yes, results update instantly as you type." },
    ],
  },
  {
    id: "image-converter",
    name: "Image Converter",
    path: "/tools/image-converter",
    description: "Convert images to JPG, PNG, WEBP and more.",
    category: "converter",
    status: "mock",
    functionalityScore: 10,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: ["jpg", "png", "webp", "batch"],
    priority: 8,
    seoTitle: "Image Converter Online | Utilably",
    seoDescription:
      "Convert images online to JPG, PNG, WEBP and more. Batch convert and download in seconds.",
    keywords: ["image converter", "jpg to png", "png to webp", "convert image online"],
    faqs: [
      { q: "Which formats are supported?", a: "JPG, PNG, WEBP and more formats are planned." },
      { q: "Does it support batch conversion?", a: "Batch conversion is planned for the full release." },
      { q: "Is it free?", a: "Yes, it will remain free to use." },
    ],
  },
  {
    id: "video-converter",
    name: "Video Converter",
    path: "/tools/video-converter",
    description: "Convert videos between formats like MP4, MOV and more.",
    category: "converter",
    status: "mock",
    functionalityScore: 10,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: ["mp4", "mov", "webm", "quality-options"],
    priority: 7,
    seoTitle: "Video Converter Online | Utilably",
    seoDescription:
      "Convert video files online. Choose format and quality, then download your converted video.",
    keywords: ["video converter", "mp4 converter", "mov to mp4", "convert video online"],
    faqs: [
      { q: "Will this work in the browser?", a: "Yes, browser-based conversion via WASM is planned." },
      { q: "Which formats will be supported?", a: "MP4, MOV, WEBM and more are planned." },
      { q: "Is it free?", a: "Yes, it is intended to be free once released." },
    ],
  },
  {
    id: "audio-converter",
    name: "Audio Converter",
    path: "/tools/audio-converter",
    description: "Convert audio files between MP3, WAV, AAC and more.",
    category: "converter",
    status: "mock",
    functionalityScore: 10,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: ["mp3", "wav", "aac", "quality-options"],
    priority: 7,
    seoTitle: "Audio Converter Online | Utilably",
    seoDescription:
      "Convert audio files online to MP3, WAV, AAC and more. Fast conversion and easy downloads.",
    keywords: ["audio converter", "mp3 converter", "wav to mp3", "convert audio online"],
    faqs: [
      { q: "Which formats are supported?", a: "MP3, WAV, AAC and more are planned." },
      { q: "Does it support large files?", a: "Large file handling is planned and will depend on browser limits." },
      { q: "Is it free?", a: "Yes, it is intended to be free." },
    ],
  },

  // =========================
  // GENERATORS
  // =========================
  {
    id: "qr-generator",
    name: "QR Code Generator",
    path: "/tools/qr-generator",
    description: "Generate QR codes and download in multiple formats.",
    category: "generator",
    status: "functional",
    functionalityScore: 90,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: ["qrcode"],
    hasRealConversion: true,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["custom-colors", "download", "png", "svg"],
    priority: 8,
    seoTitle: "QR Code Generator Online Free | Utilably",
    seoDescription:
      "Generate QR codes online for free. Customize colors, preview instantly and download in multiple formats.",
    keywords: ["qr code generator", "create qr code", "qr code maker", "download qr code"],
    faqs: [
      { q: "Can I download the QR code?", a: "Yes, you can download the generated QR code instantly." },
      { q: "Can I change colors?", a: "Yes, custom colors are supported." },
      { q: "Which formats can I download?", a: "Common formats like PNG/SVG are supported." },
    ],
    trending: true,
  },
  {
    id: "password-generator",
    name: "Password Generator",
    path: "/tools/password-generator",
    description: "Generate strong passwords with custom settings.",
    category: "generator",
    status: "functional",
    functionalityScore: 85,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["secure-random", "strength-meter", "copy"],
    priority: 7,
    seoTitle: "Password Generator Online | Utilably",
    seoDescription:
      "Generate strong, secure passwords online. Customize length and character sets with a built-in strength meter.",
    keywords: ["password generator", "strong password", "random password", "secure password generator"],
    faqs: [
      { q: "Is the password generator secure?", a: "Yes, it uses cryptographic randomness in the browser." },
      { q: "Can I choose password length?", a: "Yes, you can set custom length and options." },
      { q: "Can I copy the password?", a: "Yes, copy-to-clipboard is supported." },
    ],
  },
  {
    id: "random-number-generator",
    name: "Random Number Generator",
    path: "/tools/random-number-generator",
    description: "Generate random numbers in custom ranges (bulk supported).",
    category: "generator",
    status: "functional",
    functionalityScore: 85,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["custom-range", "bulk-generate", "copy"],
    priority: 6,
    seoTitle: "Random Number Generator Online | Utilably",
    seoDescription:
      "Generate random numbers online with custom min/max ranges. Bulk generation and copy supported.",
    keywords: ["random number generator", "random number", "generate random numbers"],
    faqs: [
      { q: "Can I generate multiple numbers at once?", a: "Yes, bulk generation is supported." },
      { q: "Can I set a custom range?", a: "Yes, set minimum and maximum values." },
      { q: "Is it free?", a: "Yes, it’s free to use." },
    ],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    path: "/tools/uuid-generator",
    description: "Generate UUID v1/v4 in multiple formats.",
    category: "generator",
    status: "functional",
    functionalityScore: 85,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["uuid-v1", "uuid-v4", "multiple-formats", "copy"],
    priority: 6,
    seoTitle: "UUID Generator Online | Utilably",
    seoDescription:
      "Generate UUIDs online (v1 and v4). Choose format and copy instantly for development and testing.",
    keywords: ["uuid generator", "uuid v4", "uuid v1", "generate uuid"],
    faqs: [
      { q: "Which UUID versions are supported?", a: "UUID v1 and v4 are supported." },
      { q: "Can I copy UUIDs quickly?", a: "Yes, copy-to-clipboard is supported." },
      { q: "Is it free?", a: "Yes, it’s free to use." },
    ],
  },
  {
    id: "email-signature-generator",
    name: "Email Signature Generator",
    path: "/tools/email-signature-generator",
    description: "Create professional email signatures and export HTML.",
    category: "generator",
    status: "functional",
    functionalityScore: 85,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["templates", "social-links", "html-export", "copy"],
    priority: 7,
    seoTitle: "Email Signature Generator Online | Utilably",
    seoDescription:
      "Create a professional email signature online. Choose templates, add social links, and export HTML instantly.",
    keywords: ["email signature generator", "email signature html", "professional email signature"],
    faqs: [
      { q: "Can I export HTML signature?", a: "Yes, HTML export is available." },
      { q: "Does it include templates?", a: "Yes, multiple signature templates are included." },
      { q: "Is it free?", a: "Yes, it’s free to use." },
    ],
  },
  {
    id: "code-generator",
    name: "Code Generator",
    path: "/tools/code-generator",
    description: "Generate code snippets in multiple languages and templates.",
    category: "generator",
    status: "functional",
    functionalityScore: 80,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: false,
    hasApiIntegration: false,
    features: ["templates", "syntax-highlighting", "copy"],
    priority: 7,
    seoTitle: "Code Generator Online | Utilably",
    seoDescription:
      "Generate code snippets online in multiple languages. Use templates, customize output and copy instantly.",
    keywords: ["code generator", "generate code", "code templates", "snippet generator"],
    faqs: [
      { q: "Which languages are supported?", a: "Multiple languages are supported depending on templates." },
      { q: "Can I copy generated code?", a: "Yes, copy-to-clipboard is supported." },
      { q: "Is it free?", a: "Yes, it’s free to use." },
    ],
  },

  // =========================
  // UTILITY
  // =========================
  {
    id: "file-compressor",
    name: "File Compressor",
    path: "/tools/file-compressor",
    description: "Compress files to reduce size with quality control.",
    category: "utility",
    status: "mock",
    functionalityScore: 10,
    lastTested: nowIso(),
    lastUpdated: nowIso(),
    dependencies: [],
    hasRealConversion: false,
    hasFileProcessing: true,
    hasApiIntegration: false,
    features: ["compression-levels", "download"],
    priority: 8,
    seoTitle: "File Compressor Online | Utilably",
    seoDescription:
      "Compress files online to reduce size. Choose compression level and download optimized output.",
    keywords: ["file compressor", "compress files", "compress pdf", "compress images"],
    faqs: [
      { q: "Can I compress PDF and images?", a: "This is planned for the full release." },
      { q: "Will quality be reduced?", a: "Compression can affect quality; adjustable levels are planned." },
      { q: "Is it free?", a: "Yes, it is intended to be free." },
    ],
  },
];

// --------------------
// Helper functions
// --------------------

export function getToolByPath(path: string): Tool | undefined {
  return toolRegistry.find((tool) => tool.path === path);
}

export function getToolById(id: string): Tool | undefined {
  return toolRegistry.find((tool) => tool.id === id);
}

export function getToolsByStatus(status: ToolStatus): Tool[] {
  return toolRegistry.filter((tool) => tool.status === status);
}

export function getFunctionalTools(): Tool[] {
  return toolRegistry.filter((tool) => isToolIndexable(tool));
}

export function getMockTools(): Tool[] {
  return toolRegistry.filter((tool) => !isToolIndexable(tool));
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return toolRegistry.filter((tool) => tool.category === category);
}

export function getOverallProgress(): number {
  const functionalCount = getFunctionalTools().length;
  const totalCount = toolRegistry.length;
  return Math.round((functionalCount / totalCount) * 10000) / 100;
}

export function getSummary(): {
  total: number;
  functional: number;
  mock: number;
  wip: number;
  partial: number;
  overallProgress: number;
} {
  const total = toolRegistry.length;
  const functional = getToolsByStatus("functional").length;
  const mock = getToolsByStatus("mock").length;
  const wip = getToolsByStatus("wip").length;
  const partial = getToolsByStatus("partial").length;
  const overallProgress = getOverallProgress();

  return { total, functional, mock, wip, partial, overallProgress };
}

export function getIndexableToolPaths(): string[] {
  return toolRegistry.filter(isToolIndexable).map((t) => t.path);
}

export function getPriorityTools(limit: number = 5): Tool[] {
  return [...toolRegistry]
    .filter((tool) => !isToolIndexable(tool))
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      const statusOrder: Record<ToolStatus, number> = {
        mock: 3,
        wip: 2,
        partial: 1,
        functional: 0,
      };
      const statusDiff = statusOrder[b.status] - statusOrder[a.status];
      if (statusDiff !== 0) return statusDiff;
      return a.functionalityScore - b.functionalityScore;
    })
    .slice(0, limit);
}

// Convenience exports
export const allToolIds = toolRegistry.map((t) => t.id);
export const allToolNames = toolRegistry.map((t) => t.name);
export const indexableToolIds = toolRegistry.filter(isToolIndexable).map((t) => t.id);
export const nonIndexableToolIds = toolRegistry.filter((t) => !isToolIndexable(t)).map((t) => t.id);


// Backward-compatible alias (your dynamic tool page uses this)
export function getToolBySlug(slug: string): Tool | undefined {
  // Support both "/tools/xyz" and "xyz"
  if (!slug) return undefined;

  // If slug already looks like a path, match directly
  if (slug.startsWith("/")) {
    return toolRegistry.find((tool) => tool.path === slug);
  }

  // If slug is just "pdf-editor", match by id or by last path segment
  return toolRegistry.find(
    (tool) => tool.id === slug || tool.path.split("/").pop() === slug
  );
}

// Backward-compatible helper used by tool-checker.ts
export function updateToolStatus(toolId: string, updates: Partial<Tool>): Tool | null {
  const index = toolRegistry.findIndex((tool) => tool.id === toolId);
  if (index === -1) return null;

  toolRegistry[index] = {
    ...toolRegistry[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  return toolRegistry[index];
}
