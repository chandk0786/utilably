"use client";

import RelatedTools from "@/components/RelatedTools";
import { useState, useMemo } from "react";
import { 
  Type, 
  Copy, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Hash,
  Sparkles,
  Download,
  Trash2
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState<string>("");
  const [activeCase, setActiveCase] = useState<string>("sentence");
  const [copied, setCopied] = useState<boolean>(false);

  // Define all case conversion functions
  const caseConversions = useMemo(() => ({
    sentence: (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .split(/([.!?]+\s+)/)
        .map((sentence, index, arr) => {
          // If it's a punctuation mark followed by space, return as is
          if (/[.!?]+\s+$/.test(sentence) && index < arr.length - 1) {
            return sentence;
          }
          // Capitalize first letter of each sentence
          return sentence.charAt(0).toUpperCase() + sentence.slice(1);
        })
        .join('');
    },
    
    title: (text: string) => {
      if (!text) return "";
      
      // List of words that should remain lowercase (unless first/last word)
      const smallWords = /\b(a|an|and|as|at|but|by|for|in|nor|of|on|or|so|the|to|up|yet|with)\b/gi;
      
      // Words that should always be uppercase
      const alwaysUppercase = /\b(inc|ltd|llc|corp|plc|ceo|cto|cfo|coo|usa|uk|eu|usd|nyc|la|sf)\b/gi;
      
      // Preserve existing acronyms (2+ uppercase letters together)
      text = text.replace(/\b([A-Z]{2,})\b/g, (match) => match);
      
      // Handle always-uppercase words
      text = text.replace(alwaysUppercase, (match) => match.toUpperCase());
      
      // Split by lines to handle multiline text
      return text
        .split('\n')
        .map(line => {
          if (!line.trim()) return line;
          
          // Handle lines that start with bullet points, numbers, or dashes
          const bulletMatch = line.match(/^(\s*[•\-\*\d.)]\s*)/);
          if (bulletMatch) {
            const prefix = bulletMatch[0];
            const content = line.slice(prefix.length);
            if (!content.trim()) return line;
            
            // Capitalize first letter after bullet
            const firstChar = content[0];
            const rest = content.slice(1);
            return prefix + firstChar.toUpperCase() + rest.toLowerCase();
          }
          
          // Process regular line
          return line
            .toLowerCase()
            .replace(/\b(\w)(\w*)\b/g, (match, firstLetter, rest, offset, fullString) => {
              // Check if it's the first word of the line
              if (offset === 0) {
                return firstLetter.toUpperCase() + rest;
              }
              
              // Check character before this word
              const charBefore = fullString[offset - 1];
              
              // Always capitalize if:
              // 1. After end of sentence (.!?)
              // 2. After colon (:)
              // 3. After bullet-like characters
              if (/[.!?:•\-]\s*$/.test(fullString.slice(0, offset))) {
                return firstLetter.toUpperCase() + rest;
              }
              
              // Check if it's a small word
              const isSmallWord = smallWords.test(match.toLowerCase());
              
              // Check if it's the last word
              const isLastWord = !/\w/.test(fullString.slice(offset + match.length));
              
              // Capitalize if:
              // 1. Not a small word OR
              // 2. It's the last word OR
              // 3. Word looks like an acronym or proper noun
              if (!isSmallWord || isLastWord || /[A-Z]/.test(match) || /\d/.test(match)) {
                return firstLetter.toUpperCase() + rest;
              }
              
              // Keep small words lowercase
              return match.toLowerCase();
            });
        })
        .join('\n');
    },
    
    // Alternative: Title case that capitalizes EVERY word
    "title-all": (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/\b(\w)(\w*)\b/g, (match, firstLetter, rest) => {
          return firstLetter.toUpperCase() + rest;
        });
    },
    
    upper: (text: string) => text.toUpperCase(),
    lower: (text: string) => text.toLowerCase(),
    camel: (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, c => c.toLowerCase());
    },
    pascal: (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[a-z]/, c => c.toUpperCase());
    },
    snake: (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    },
    kebab: (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    },
    constant: (text: string) => {
      if (!text) return "";
      return text
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');
    },
    alternating: (text: string) => {
      if (!text) return "";
      return text
        .split('')
        .map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
        .join('');
    },
    inverse: (text: string) => {
      if (!text) return "";
      return text
        .split('')
        .map(char => {
          if (char === char.toLowerCase()) {
            return char.toUpperCase();
          } else {
            return char.toLowerCase();
          }
        })
        .join('');
    }
  }), []);

  // Calculate all conversions
  const allConversions = useMemo(() => {
    if (!inputText.trim()) return {};
    return Object.entries(caseConversions).reduce((acc, [key, func]) => {
      acc[key] = func(inputText);
      return acc;
    }, {} as Record<string, string>);
  }, [inputText, caseConversions]);

  const outputText = allConversions[activeCase] || "";

  // Action handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-text-${activeCase}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputText("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  const caseOptions = [
    { id: "sentence", label: "Sentence Case", icon: Type, description: "Capitalize first letter of each sentence" },
    { id: "title", label: "Title Case", icon: Sparkles, description: "Smart title case with small word rules" },
    { id: "title-all", label: "ALL WORDS CAPITAL", icon: ArrowUp, description: "Capitalize every word" },
    { id: "upper", label: "UPPERCASE", icon: ArrowUp, description: "Convert all letters to uppercase" },
    { id: "lower", label: "lowercase", icon: ArrowDown, description: "Convert all letters to lowercase" },
    { id: "camel", label: "camelCase", icon: Type, description: "camelCase style for programming" },
    { id: "pascal", label: "PascalCase", icon: Type, description: "PascalCase for class names" },
    { id: "snake", label: "snake_case", icon: Hash, description: "snake_case for variables" },
    { id: "kebab", label: "kebab-case", icon: Hash, description: "kebab-case for URLs" },
    { id: "constant", label: "CONSTANT_CASE", icon: ArrowUp, description: "CONSTANTS for programming" },
    { id: "alternating", label: "aLtErNaTiNg", icon: Sparkles, description: "Alternating case for styling" },
    { id: "inverse", label: "iNVERSE cASE", icon: Sparkles, description: "Invert the current case" }
  ];

  // Example text that demonstrates the fix
  const exampleText = `Annual Financial Report 2023
Company Name: Tech Innovations Inc.
Date: December 31, 2023

Executive Summary
This year marked significant growth in our core markets, with revenue increasing by 34% year-over-year. Our expansion into European markets proved particularly successful, contributing 28% to total revenue growth.

Key Performance Indicators:
• Revenue: $45.7M (2023) vs $34.1M (2022)
• Net Profit Margin: 22% (up from 18%)
• Customer Retention: 94%
• New Client Acquisition: 342 companies

Quarterly Sales Analysis - Q4 2023

Table 1: Regional Performance Comparison
Region      | Q3 Revenue   | Q4 Revenue  | Growth
North America | $12,450,000 | $15,200,000 | +22.1%
Europe      | $8,340,000  | $9,850,000  | +18.1%
Asia-Pacific| $6,120,000  | $7,890,000  | +28.9%
Latin America| $2,340,000  | $3,120,000  | +33.3%`;

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between different cases: uppercase, lowercase, title case, camelCase, and more."
      keywords="text case converter, uppercase, lowercase, title case, camelCase, text formatting"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Input Text
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePaste}
                    className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Paste
                  </button>
                  <button
                    onClick={() => setInputText(exampleText)}
                    className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    Load Example
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your text here to convert it to different cases..."
                className="w-full h-64 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Characters: {inputText.length} | Words: {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} | Lines: {inputText.split('\n').length}
                </span>
                <button
                  onClick={() => setInputText(inputText + " ")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Add Space
                </button>
              </div>
            </div>

            {/* Case Selection Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Select Case Type
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {caseOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = activeCase === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setActiveCase(option.id)}
                      className={`p-3 rounded-xl border transition-all ${isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      title={option.description}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium truncate">{option.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-emerald-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Converted Text
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${copied
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800"
                      }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full h-64 p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-xl overflow-auto">
                <pre className="whitespace-pre-wrap wrap-break-word text-gray-800 dark:text-gray-200 font-mono text-sm">
                  {outputText || "Converted text will appear here..."}
                </pre>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Selected: {caseOptions.find(o => o.id === activeCase)?.label}</span>
                    <span className="font-mono">
                      Length: {outputText.length}
                    </span>
                  </div>
                  {activeCase === "title" && (
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                      Smart title case: Small words remain lowercase unless first/last or after punctuation
                    </div>
                  )}
                  {activeCase === "title-all" && (
                    <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                      All words capitalized: Every word gets first letter uppercase
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Quick Preview
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {Object.entries(allConversions)
                  .filter(([key]) => key !== activeCase)
                  .slice(0, 5)
                  .map(([key, value]) => {
                    const option = caseOptions.find(o => o.id === key);
                    if (!value.trim() || !option) return null;
                    return (
                      <div
                        key={key}
                        className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => setActiveCase(key)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
                          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700">
                            Use
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {value.slice(0, 80)}...
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Text Case Converter Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Type className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                12 Case Types
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Convert between sentence, smart title, all words title, camelCase, and more
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Copy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Smart Title Case
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Intelligent handling of small words, bullets, colons, and proper nouns
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Advanced Features
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preserves acronyms, handles multiline text, and maintains proper formatting
              </p>
            </div>
          </div>
        </div>

        {/* Example Texts */}
        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Try these examples:
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "convert this text to different cases",
              "MY UPPERCASE TEXT NEEDS FIXING",
              "john doe's document title",
              "user_input_field_name",
              "The quick brown fox jumps over the lazy dog",
              "Annual report: q4 results and analysis",
              "bullet points: • first item • second item • third item"
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInputText(example)}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {example.slice(0, 25)}...
              </button>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            💡 Title Case Tips:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• <strong>"Title Case"</strong>: Smart capitalization (small words like "the", "and" remain lowercase)</li>
            <li>• <strong>"ALL WORDS CAPITAL"</strong>: Every word gets first letter uppercase</li>
            <li>• Words after <code>:</code> <code>•</code> <code>-</code> are always capitalized</li>
            <li>• Proper nouns like "Inc.", "Corp.", "USA" remain uppercase</li>
            <li>• First and last words of sentences are always capitalized</li>
          </ul>
        </div>
      </div>
      <RelatedTools currentToolId="TOOL_ID_HERE" />
    </ToolLayout>
  );
}