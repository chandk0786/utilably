"use client";

import RelatedTools from "@/components/RelatedTools";
import { useState, useEffect } from "react";
import { 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Hash,
  Layers,
  Database,
  Code,
  Link,
  Lock,
  Shield,
  FileText,
  Download,
  Trash2,
  Filter,
  Zap,
  AlertCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type UUIDVersion = 'v1' | 'v4';
type UUIDFormat = 'standard' | 'compact' | 'urn' | 'base64';
type HistoryItem = {
  id: string;
  uuid: string;
  version: UUIDVersion;
  format: UUIDFormat;
  timestamp: Date;
  isValid: boolean;
};

export default function UUIDGenerator() {
  const [count, setCount] = useState<number>(1);
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [format, setFormat] = useState<UUIDFormat>('standard');
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Generate cryptographically secure random bytes
  const getRandomBytes = (count: number): Uint8Array => {
    const array = new Uint8Array(count);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for older browsers (not cryptographically secure)
      for (let i = 0; i < count; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return array;
  };

  // Generate unique ID for history items
  const generateUniqueId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback: timestamp + random string
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Generate proper RFC 4122 v4 UUID (cryptographically secure)
  const generateUUIDv4 = (): string => {
    const bytes = getRandomBytes(16);
    
    // Set version bits: 0100 (v4)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant bits: 10xxxxxx (RFC 4122)
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    
    // Convert to hex string with proper format
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
  };

  // Generate simplified v1 UUID (time-based simulation)
  // Note: Real v1 UUIDs require MAC address and precise timestamps
  const generateUUIDv1Simplified = (): string => {
    // Get current timestamp in 100-nanosecond intervals since Oct 15, 1582
    const timestamp = Date.now() * 10000 + 122192928000000000;
    
    // Convert to hex
    const timestampHex = timestamp.toString(16).padStart(16, '0');
    
    // Generate random clock sequence and node
    const bytes = getRandomBytes(10);
    
    // Format: timestamp-low (8) - timestamp-mid (4) - timestamp-high (4) - version (1) - clock-seq (4) - node (12)
    // Version bits: 0001 (v1)
    // Variant bits: 10xxxxxx (RFC 4122)
    const clockSeq = ((bytes[0] << 8) | bytes[1]) & 0x3fff;
    const node = Array.from(bytes.slice(2)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${timestampHex.substring(8)}-${timestampHex.substring(4, 8)}-1${timestampHex.substring(0, 3)}-${(clockSeq | 0x8000).toString(16).substring(1)}-${node}`;
  };

  // Validate UUID format
  const validateUUID = (uuid: string, version: UUIDVersion): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) return false;
    
    const parts = uuid.split('-');
    if (version === 'v4') {
      // Check version bits: 0100 (v4)
      return parts[2][0] === '4';
    } else if (version === 'v1') {
      // Check version bits: 0001 (v1)
      return parts[2][0] === '1';
    }
    return true;
  };

  // UUID format functions
  const formatUUID = (uuid: string, format: UUIDFormat): string => {
    // First ensure we have a standard format UUID
    let standardUUID = uuid;
    if (!uuid.includes('-')) {
      // Re-add hyphens if missing
      standardUUID = `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
    }
    
    switch (format) {
      case 'compact':
        return standardUUID.replace(/-/g, '');
      case 'urn':
        return `urn:uuid:${standardUUID}`;
      case 'base64':
        // Convert hex to bytes then to base64
        const hex = standardUUID.replace(/-/g, '');
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
        }
        return btoa(String.fromCharCode(...bytes)).replace(/=/g, '').slice(0, 22);
      default:
        return standardUUID;
    }
  };

  // Generate UUIDs
  const generateUUIDs = () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setValidationErrors([]);
    
    setTimeout(() => {
      const uuids: string[] = [];
      const errors: string[] = [];
      
      for (let i = 0; i < count; i++) {
        try {
          const rawUUID = version === 'v1' ? generateUUIDv1Simplified() : generateUUIDv4();
          
          // Validate UUID
          const isValid = validateUUID(rawUUID, version);
          if (!isValid) {
            errors.push(`Generated invalid ${version} UUID: ${rawUUID}`);
          }
          
          let formattedUUID = formatUUID(rawUUID, format);
          
          if (!includeHyphens && format === 'standard') {
            formattedUUID = formattedUUID.replace(/-/g, '');
          }
          
          uuids.push(formattedUUID);
          
          // Add to history with unique ID
          const historyItem: HistoryItem = {
            id: generateUniqueId(), // ← FIXED: Always unique
            uuid: formattedUUID,
            version,
            format,
            timestamp: new Date(),
            isValid,
          };
          
          setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20
        } catch (error) {
          console.error('Error generating UUID:', error);
          errors.push(`Failed to generate UUID ${i + 1}: ${error}`);
        }
      }
      
      setGeneratedUUIDs(uuids);
      setValidationErrors(errors);
      setIsGenerating(false);
    }, 100); // Reduced delay
  };

  // Generate on mount
  useEffect(() => {
    generateUUIDs();
  }, []);

  // Handle copy
  const handleCopy = (uuid?: string) => {
    let textToCopy = '';
    
    if (uuid) {
      textToCopy = uuid;
    } else if (generatedUUIDs.length > 0) {
      textToCopy = generatedUUIDs.join('\n');
    } else {
      return;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // Handle download
  const handleDownload = () => {
    if (generatedUUIDs.length === 0) return;
    
    try {
      const text = generatedUUIDs.join('\n');
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `uuids-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Clear generated UUIDs
  const handleClearGenerated = () => {
    setGeneratedUUIDs([]);
  };

  // Quick presets
  const presets = [
    { label: "Single UUID", count: 1 },
    { label: "5 UUIDs", count: 5 },
    { label: "10 UUIDs", count: 10 },
    { label: "Batch (50)", count: 50 },
  ];

  // Version descriptions (updated with accurate info)
  const versionInfo = {
    v1: {
      name: "Version 1 (Time-based)",
      description: "Based on timestamp and MAC address. Time-ordered but predictable.",
      useCase: "Database records where chronological ordering is needed",
      note: "Note: This implementation simulates v1 without MAC address"
    },
    v4: {
      name: "Version 4 (Random)",
      description: "Cryptographically secure random numbers. Most common use.",
      useCase: "Session IDs, API keys, security tokens, general purpose",
      note: "Uses crypto.getRandomValues() for security"
    }
  };

  // Format descriptions
  const formatInfo = {
    standard: {
      name: "Standard",
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "RFC 4122 format: 8-4-4-4-12 hex with hyphens"
    },
    compact: {
      name: "Compact",
      example: "123e4567e89b12d3a456426614174000",
      description: "32 hexadecimal characters, no hyphens"
    },
    urn: {
      name: "URN Format",
      example: "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
      description: "Standard format prefixed with 'urn:uuid:'"
    },
    base64: {
      name: "Base64",
      example: "Ej5FZ+ibEtOkVkJhQXgAAA",
      description: "22 character Base64 encoded (URL-safe)"
    }
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate RFC 4122 compliant UUIDs in multiple versions and formats. Cryptographically secure with validation."
      keywords="UUID generator, GUID generator, unique identifier, random UUID, version 4 UUID, version 1 UUID, RFC 4122"
    >
      <div className="max-w-6xl mx-auto">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Validation Issues</span>
            </div>
            <ul className="text-sm text-red-600/80 dark:text-red-400/80 space-y-1">
              {validationErrors.slice(0, 3).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
              {validationErrors.length > 3 && (
                <li>• ...and {validationErrors.length - 3} more issues</li>
              )}
            </ul>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-linear-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-purple-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      UUID Generator
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Generate RFC 4122 compliant UUIDs
                    </p>
                  </div>
                </div>
                <button
                  onClick={generateUUIDs}
                  disabled={isGenerating}
                  className={`p-2 rounded-lg transition-all ${isGenerating
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 hover:scale-105"
                    }`}
                  title="Generate UUIDs"
                  aria-label="Generate UUIDs"
                >
                  <Zap className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Count Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Number of UUIDs
                    </label>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {count} UUID{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:dark:bg-purple-500"
                      aria-label="Number of UUIDs to generate"
                    />
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setCount(Math.max(1, Math.min(1000, value)));
                        }
                      }}
                      className="w-24 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-center transition-all"
                      min="1"
                      max="1000"
                      step="1"
                      aria-label="Exact number of UUIDs"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>1</span>
                    <span className="text-xs">Drag or type to adjust</span>
                    <span>1000</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => setCount(preset.count)}
                        className={`p-3 rounded-lg border transition-all ${count === preset.count
                            ? "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20"
                            : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        aria-label={`Generate ${preset.label}`}
                      >
                        <div className="font-medium text-sm">{preset.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Version Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    UUID Version
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['v1', 'v4'] as UUIDVersion[]).map((v) => (
                      <button
                        key={v}
                        onClick={() => setVersion(v)}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${version === v
                            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 ring-2 ring-blue-500/20"
                            : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        aria-label={`Select ${versionInfo[v].name}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${version === v
                            ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 scale-110"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          }`}>
                          {v === 'v1' ? <Layers className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-800 dark:text-white">Version {v}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {versionInfo[v].name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['standard', 'compact', 'urn', 'base64'] as UUIDFormat[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`p-3 rounded-lg border transition-all ${format === f
                            ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 ring-2 ring-green-500/20"
                            : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        aria-label={`Select ${formatInfo[f].name} format`}
                      >
                        <div className="font-medium text-gray-800 dark:text-white text-sm mb-1">
                          {formatInfo[f].name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate" title={formatInfo[f].example}>
                          {formatInfo[f].example}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hyphens Option */}
                {format === 'standard' && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${includeHyphens
                          ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}>
                        <Hash className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Include Hyphens</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Standard format with/without hyphens
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIncludeHyphens(!includeHyphens)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeHyphens
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      aria-label={includeHyphens ? "Remove hyphens" : "Add hyphens"}
                      aria-checked={includeHyphens}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeHyphens
                          ? "translate-x-6"
                          : "translate-x-1"
                        }`} />
                    </button>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateUUIDs}
                  disabled={isGenerating}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${isGenerating
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  aria-label={isGenerating ? "Generating UUIDs..." : "Generate UUIDs"}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="w-6 h-6" />
                      Generate UUIDs
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Version Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                About UUID Version {version.toUpperCase()}
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="font-medium text-gray-800 dark:text-white mb-1">
                    {versionInfo[version].name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {versionInfo[version].description}
                  </div>
                  {versionInfo[version].note && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      {versionInfo[version].note}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-medium text-gray-800 dark:text-white mb-1">
                    Common Use Cases
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {versionInfo[version].useCase}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results & History */}
          <div className="space-y-6">
            {/* Results Card */}
            <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-emerald-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                    <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Generated UUIDs
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {generatedUUIDs.length} RFC 4122 identifier{generatedUUIDs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy()}
                    disabled={generatedUUIDs.length === 0}
                    className={`p-2 rounded-lg transition-all ${generatedUUIDs.length === 0
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : copied
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 scale-110"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 hover:scale-110"
                      }`}
                    title={copied ? "Copied!" : "Copy all UUIDs"}
                    aria-label={copied ? "UUIDs copied to clipboard" : "Copy all UUIDs to clipboard"}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={generatedUUIDs.length === 0}
                    className={`p-2 rounded-lg transition-all ${generatedUUIDs.length === 0
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800 hover:scale-110"
                      }`}
                    title="Download as text file"
                    aria-label="Download UUIDs as text file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleClearGenerated}
                    disabled={generatedUUIDs.length === 0}
                    className={`p-2 rounded-lg transition-all ${generatedUUIDs.length === 0
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 hover:scale-110"
                      }`}
                    title="Clear generated UUIDs"
                    aria-label="Clear generated UUIDs"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* UUIDs Display */}
              <div className="mb-6">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-xl min-h-37.5 max-h-62.5 overflow-y-auto">
                  {generatedUUIDs.length > 0 ? (
                    <div className="space-y-3">
                      {generatedUUIDs.map((uuid, index) => {
                        const isValid = validateUUID(uuid.replace(/-/g, '').length === 32 ? 
                          `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}` : 
                          uuid, version);
                        
                        return (
                          <div
                            key={`uuid-${index}-${uuid.substring(0, 8)}`} // Unique key
                            className={`p-3 bg-white dark:bg-gray-800 border rounded-lg group transition-colors ${isValid
                                ? "border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-700"
                                : "border-red-300 dark:border-red-700 hover:border-red-400 dark:hover:border-red-600"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded">
                                  #{index + 1}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {version.toUpperCase()} • {formatInfo[format].name}
                                </span>
                                {!isValid && (
                                  <span className="text-xs font-medium px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                                    Invalid
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleCopy(uuid)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500 transition-all"
                                title="Copy this UUID"
                                aria-label={`Copy UUID ${index + 1}`}
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                              {uuid}
                            </code>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Click generate to create UUIDs</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg text-center hover:scale-105 transition-transform">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Version</div>
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {version.toUpperCase()}
                  </div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg text-center hover:scale-105 transition-transform">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Format</div>
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {formatInfo[format].name}
                  </div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg text-center hover:scale-105 transition-transform">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valid</div>
                  <div className={`text-lg font-bold ${generatedUUIDs.length > 0 && validationErrors.length === 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    }`}>
                    {generatedUUIDs.length - validationErrors.length}/{generatedUUIDs.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Generation History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Generation History
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-lg"
                    title="Clear history"
                    aria-label="Clear generation history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="space-y-3 max-h-75 overflow-y-auto pr-2">
                  {history.slice(0, 10).map((item) => (
                    <div
                      key={item.id} // ← FIXED: Unique key from generateUniqueId()
                      className={`p-3 rounded-lg border ${item.isValid
                          ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${item.isValid
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                            }`}>
                            {item.version.toUpperCase()}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                            {item.format}
                          </span>
                          {!item.isValid && (
                            <span className="text-xs font-medium px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                              Invalid
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <code className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                        {item.uuid}
                      </code>
                    </div>
                  ))}
                  {history.length > 10 && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                      +{history.length - 10} more UUIDs in history
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your generation history will appear here</p>
                </div>
              )}
            </div>

            {/* Security & Usage */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Security & Compliance
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span><strong>RFC 4122 Compliant:</strong> Follows UUID standards for interoperability</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span><strong>Crypto-Secure:</strong> v4 UUIDs use <code>crypto.getRandomValues()</code> when available</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span><strong>Local Generation:</strong> All UUIDs generated in your browser - no data sent to servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span><strong>2^128 Possibilities:</strong> Virtually zero chance of collision</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            UUID Generator Features
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                RFC 4122 Compliant
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Proper v1 and v4 UUIDs with correct version/variant bits
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                4 Output Formats
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Standard, Compact, URN, and Base64 with validation
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Batch Generation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate up to 1000 UUIDs at once with error tracking
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Cryptographic Security
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uses crypto.getRandomValues() for secure random generation
              </p>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="uuid-generator" />
    </ToolLayout>
  );
}