"use client";

import RelatedTools from "@/components/RelatedTools";
import { useState, useEffect } from "react";
import { 
  Hash, 
  Copy, 
  Check, 
  RefreshCw, 
  Shuffle,
  Dice5,
  List,
  Save,
  Trash2,
  Zap,
  BarChart3,
  Lock,
  Timer,
  Settings
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type HistoryItem = {
  id: string;
  numbers: number[];
  min: number;
  max: number;
  count: number;
  timestamp: Date;
  duplicates: boolean;
  sorted: boolean;
};

export default function RandomNumberGenerator() {
  const [minValue, setMinValue] = useState<number>(1);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortNumbers, setSortNumbers] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Quick presets
  const presets = [
    { label: "Dice (1-6)", min: 1, max: 6, count: 1 },
    { label: "Lottery (1-49)", min: 1, max: 49, count: 6 },
    { label: "Coin Flip (0-1)", min: 0, max: 1, count: 1 },
    { label: "Percentage (0-100)", min: 0, max: 100, count: 1 },
    { label: "Custom Range", min: 1, max: 1000, count: 10 },
  ];

  // Generate unique ID - FIXED: Uses crypto.randomUUID() with fallback
  const generateUniqueId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers: timestamp + random string
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Generate random numbers - FIXED: Better validation and unique IDs
  const generateNumbers = () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    // Validate inputs
    if (minValue > maxValue) {
      alert("Minimum value must be less than or equal to maximum value");
      setIsGenerating(false);
      return;
    }
    
    if (count < 1) {
      alert("Count must be at least 1");
      setIsGenerating(false);
      return;
    }
    
    if (count > 10000) {
      alert("Count cannot exceed 10,000 numbers");
      setIsGenerating(false);
      return;
    }
    
    if (!allowDuplicates && (maxValue - minValue + 1) < count) {
      alert(`Cannot generate ${count} unique numbers from range ${minValue}-${maxValue}`);
      setIsGenerating(false);
      return;
    }

    setTimeout(() => {
      try {
        const numbers: number[] = [];
        const range = maxValue - minValue + 1;
        
        if (allowDuplicates) {
          // Allow duplicates - using better random distribution
          for (let i = 0; i < count; i++) {
            // Use improved random function that handles large ranges better
            const randomNum = Math.floor(Math.random() * range) + minValue;
            numbers.push(randomNum);
          }
        } else {
          // No duplicates - generate unique numbers using optimized algorithm
          if (range <= 10000) {
            // For smaller ranges, use shuffle algorithm
            const allNumbers = Array.from({ length: range }, (_, i) => minValue + i);
            
            // Fisher-Yates shuffle
            for (let i = allNumbers.length - 1; i > 0 && numbers.length < count; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
            }
            
            // Take first 'count' numbers
            numbers.push(...allNumbers.slice(0, count));
          } else {
            // For very large ranges, use Set to track duplicates
            const usedNumbers = new Set<number>();
            while (numbers.length < count) {
              const randomNum = Math.floor(Math.random() * range) + minValue;
              if (!usedNumbers.has(randomNum)) {
                usedNumbers.add(randomNum);
                numbers.push(randomNum);
              }
            }
          }
        }
        
        // Sort if requested
        let finalNumbers = sortNumbers ? [...numbers].sort((a, b) => a - b) : numbers;
        
        setGeneratedNumbers(finalNumbers);
        
        // Add to history - FIXED: Using unique ID generator
        const historyItem: HistoryItem = {
          id: generateUniqueId(), // ← FIXED: Always unique
          numbers: finalNumbers,
          min: minValue,
          max: maxValue,
          count,
          timestamp: new Date(),
          duplicates: allowDuplicates,
          sorted: sortNumbers,
        };
        
        setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20
      } catch (error) {
        console.error("Error generating numbers:", error);
        alert("Error generating numbers. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }, 150); // Reduced delay for better UX
  };

  // Generate on mount
  useEffect(() => {
    generateNumbers();
  }, []);

  // Handle copy
  const handleCopy = () => {
    if (generatedNumbers.length === 0) return;
    
    const text = generatedNumbers.join(", ");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  };

  // Handle save
  const handleSave = () => {
    if (generatedNumbers.length === 0) return;
    
    try {
      const text = generatedNumbers.join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `random-numbers-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to save file:", error);
      alert("Failed to save file. Please try again.");
    }
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Use preset
  const usePreset = (preset: typeof presets[0]) => {
    setMinValue(preset.min);
    setMaxValue(preset.max);
    setCount(preset.count);
  };

  // Quick generate single number
  const quickGenerate = () => {
    if (isGenerating) return;
    setCount(1);
    // Use setTimeout to ensure state updates before generating
    setTimeout(() => generateNumbers(), 10);
  };

  // Handle min/max input with validation
  const handleMinChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setMinValue(num);
    }
  };

  const handleMaxChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setMaxValue(num);
    }
  };

  const handleCountChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setCount(Math.max(1, Math.min(10000, num)));
    }
  };

  // Calculate statistics
  const stats = {
    total: generatedNumbers.length,
    sum: generatedNumbers.reduce((a, b) => a + b, 0),
    average: generatedNumbers.length > 0 
      ? (generatedNumbers.reduce((a, b) => a + b, 0) / generatedNumbers.length).toFixed(2) 
      : "0.00",
    min: generatedNumbers.length > 0 ? Math.min(...generatedNumbers) : 0,
    max: generatedNumbers.length > 0 ? Math.max(...generatedNumbers) : 0,
    duplicates: generatedNumbers.length > 0 
      ? generatedNumbers.length - new Set(generatedNumbers).size 
      : 0,
  };

  return (
    <ToolLayout
      title="Random Number Generator"
      description="Generate random numbers within custom ranges. Supports unique numbers, sorting, and multiple generation options."
      keywords="random number generator, random numbers, number generator, lottery numbers, dice roller"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Generator Settings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure your random number generation
                    </p>
                  </div>
                </div>
                <button
                  onClick={quickGenerate}
                  disabled={isGenerating}
                  className={`p-2 rounded-lg ${isGenerating 
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed" 
                    : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 hover:scale-105"
                  } transition-all duration-200`}
                  title="Quick Generate Single Number"
                  aria-label="Quick generate single random number"
                >
                  <Zap className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Range Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Value
                    </label>
                    <input
                      type="number"
                      value={minValue}
                      onChange={(e) => handleMinChange(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      min="-9999999"
                      max="9999999"
                      step="1"
                      aria-label="Minimum value for random number range"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Value
                    </label>
                    <input
                      type="number"
                      value={maxValue}
                      onChange={(e) => handleMaxChange(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      min="-9999999"
                      max="9999999"
                      step="1"
                      aria-label="Maximum value for random number range"
                    />
                  </div>
                </div>

                {/* Count Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Number of Values
                    </label>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {count} number{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500 hover:[&::-webkit-slider-thumb]:scale-110 transition-transform"
                      aria-label="Number of random values to generate"
                    />
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => handleCountChange(e.target.value)}
                      className="w-24 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center transition-all"
                      min="1"
                      max="10000"
                      step="1"
                      aria-label="Exact number of random values"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>1</span>
                    <span className="text-xs">Drag or type to adjust</span>
                    <span>1000</span>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setAllowDuplicates(!allowDuplicates)}
                    className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${allowDuplicates
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 ring-2 ring-blue-500/20"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    aria-label={allowDuplicates ? "Allow duplicates enabled" : "Allow duplicates disabled"}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${allowDuplicates
                        ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 scale-110"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}>
                      <Hash className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-white">Allow Duplicates</div>
                      <div className={`text-xs ${allowDuplicates 
                        ? "text-blue-600 dark:text-blue-400 font-medium" 
                        : "text-gray-600 dark:text-gray-400"
                      }`}>
                        {allowDuplicates ? "Numbers can repeat" : "All numbers unique"}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSortNumbers(!sortNumbers)}
                    className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${sortNumbers
                        ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 ring-2 ring-green-500/20"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    aria-label={sortNumbers ? "Sort numbers enabled" : "Sort numbers disabled"}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${sortNumbers
                        ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 scale-110"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}>
                      <List className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-white">Sort Numbers</div>
                      <div className={`text-xs ${sortNumbers 
                        ? "text-green-600 dark:text-green-400 font-medium" 
                        : "text-gray-600 dark:text-gray-400"
                      }`}>
                        {sortNumbers ? "Ascending order" : "Original order"}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateNumbers}
                  disabled={isGenerating}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${isGenerating
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  aria-label={isGenerating ? "Generating random numbers..." : "Generate random numbers"}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Dice5 className="w-6 h-6" />
                      Generate Random Numbers
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Shuffle className="w-5 h-5" />
                Quick Presets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => usePreset(preset)}
                    className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    aria-label={`Use preset: ${preset.label}`}
                  >
                    <div className="font-medium text-gray-800 dark:text-white text-sm text-left">
                      {preset.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 text-left">
                      {preset.min}-{preset.max} × {preset.count}
                    </div>
                  </button>
                ))}
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
                    <Dice5 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Generated Numbers
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {generatedNumbers.length} random number{generatedNumbers.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={generatedNumbers.length === 0}
                    className={`p-2 rounded-lg transition-all ${generatedNumbers.length === 0
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : copied
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 scale-110"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 hover:scale-110"
                      }`}
                    title={copied ? "Copied!" : "Copy numbers"}
                    aria-label={copied ? "Numbers copied to clipboard" : "Copy numbers to clipboard"}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={generatedNumbers.length === 0}
                    className={`p-2 rounded-lg transition-all ${generatedNumbers.length === 0
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800 hover:scale-110"
                      }`}
                    title="Save to file"
                    aria-label="Save generated numbers to text file"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Numbers Display */}
              <div className="mb-6">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-xl min-h-30 max-h-50 overflow-y-auto">
                  {generatedNumbers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {generatedNumbers.map((num, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-semibold text-gray-900 dark:text-white hover:scale-105 transition-transform shadow-sm"
                          aria-label={`Random number ${index + 1}: ${num}`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Dice5 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Click generate to create random numbers</p>
                    </div>
                  )}
                </div>
                {generatedNumbers.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Range: {minValue} to {maxValue} • {allowDuplicates ? "Duplicates allowed" : "Unique numbers only"} • {sortNumbers ? "Sorted" : "Unsorted"}
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sum</div>
                  </div>
                  <div className="text-lg font-bold text-gray-800 dark:text-white" aria-label={`Sum of all numbers: ${stats.sum}`}>
                    {stats.sum.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-green-500" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average</div>
                  </div>
                  <div className="text-lg font-bold text-gray-800 dark:text-white" aria-label={`Average of numbers: ${stats.average}`}>
                    {stats.average}
                  </div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-4 h-4 text-purple-500" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Duplicates</div>
                  </div>
                  <div className="text-lg font-bold text-gray-800 dark:text-white" aria-label={`Number of duplicates: ${stats.duplicates}`}>
                    {stats.duplicates}
                  </div>
                </div>
              </div>
            </div>

            {/* Generation History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Timer className="w-5 h-5" />
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
                  {history.map((item) => (
                    <div
                      key={item.id} // ← FIXED: Unique key from generateUniqueId()
                      className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {item.min}-{item.max}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({item.count} numbers)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.numbers.slice(0, 5).map((num, idx) => (
                          <span
                            key={`${item.id}-num-${idx}`} // Unique key for numbers within history item
                            className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-medium border border-gray-200 dark:border-gray-700"
                          >
                            {num}
                          </span>
                        ))}
                        {item.numbers.length > 5 && (
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600">
                            +{item.numbers.length - 5} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {item.duplicates && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            Duplicates
                          </span>
                        )}
                        {item.sorted && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                            Sorted
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Timer className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your generation history will appear here</p>
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                    Random Number Generation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Numbers are generated using pseudo-random algorithms suitable for games,
                    simulations, and non-security-critical applications. All processing
                    happens locally in your browser for maximum privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Random Number Generator Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shuffle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Custom Range
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate numbers between any minimum and maximum values
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <List className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Advanced Options
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose duplicates, sorting, and generate up to 10,000 numbers
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Timer className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                History Tracking
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep track of your recent generations with timestamps
              </p>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="random-number-generator" />
    </ToolLayout>
  );
}