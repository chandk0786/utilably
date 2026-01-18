"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Ruler, 
  Weight, 
  Thermometer, 
  Droplets, 
  Clock,
  Zap,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  ArrowRightLeft,
  Calculator
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

// Define unit types properly
interface StandardUnit {
  id: string;
  name: string;
  symbol: string;
  factor: number;
  isTemperature?: false;
}

interface TemperatureUnit {
  id: string;
  name: string;
  symbol: string;
  factor?: never;
  isTemperature: true;
}

type Unit = StandardUnit | TemperatureUnit;

// Type guard functions
const isTemperatureUnit = (unit: Unit): unit is TemperatureUnit => {
  return 'isTemperature' in unit && unit.isTemperature === true;
};

const isStandardUnit = (unit: Unit): unit is StandardUnit => {
  return !isTemperatureUnit(unit);
};

// Unit categories and their units
const UNIT_CATEGORIES = {
  length: {
    name: "Length",
    icon: Ruler,
    units: [
      { id: "millimeter", name: "Millimeter", symbol: "mm", factor: 0.001 },
      { id: "centimeter", name: "Centimeter", symbol: "cm", factor: 0.01 },
      { id: "meter", name: "Meter", symbol: "m", factor: 1 },
      { id: "kilometer", name: "Kilometer", symbol: "km", factor: 1000 },
      { id: "inch", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "foot", name: "Foot", symbol: "ft", factor: 0.3048 },
      { id: "yard", name: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "mile", name: "Mile", symbol: "mi", factor: 1609.34 }
    ] as StandardUnit[]
  },
  weight: {
    name: "Weight",
    icon: Weight,
    units: [
      { id: "milligram", name: "Milligram", symbol: "mg", factor: 0.000001 },
      { id: "gram", name: "Gram", symbol: "g", factor: 0.001 },
      { id: "kilogram", name: "Kilogram", symbol: "kg", factor: 1 },
      { id: "tonne", name: "Tonne", symbol: "t", factor: 1000 },
      { id: "ounce", name: "Ounce", symbol: "oz", factor: 0.0283495 },
      { id: "pound", name: "Pound", symbol: "lb", factor: 0.453592 },
      { id: "stone", name: "Stone", symbol: "st", factor: 6.35029 }
    ] as StandardUnit[]
  },
  temperature: {
    name: "Temperature",
    icon: Thermometer,
    units: [
      { id: "celsius", name: "Celsius", symbol: "°C", isTemperature: true },
      { id: "fahrenheit", name: "Fahrenheit", symbol: "°F", isTemperature: true },
      { id: "kelvin", name: "Kelvin", symbol: "K", isTemperature: true }
    ] as TemperatureUnit[]
  },
  volume: {
    name: "Volume",
    icon: Droplets,
    units: [
      { id: "milliliter", name: "Milliliter", symbol: "mL", factor: 0.001 },
      { id: "liter", name: "Liter", symbol: "L", factor: 1 },
      { id: "cubic-meter", name: "Cubic Meter", symbol: "m³", factor: 1000 },
      { id: "teaspoon", name: "Teaspoon", symbol: "tsp", factor: 0.00492892 },
      { id: "tablespoon", name: "Tablespoon", symbol: "tbsp", factor: 0.0147868 },
      { id: "cup", name: "Cup", symbol: "cup", factor: 0.236588 },
      { id: "pint", name: "Pint", symbol: "pt", factor: 0.473176 },
      { id: "gallon", name: "Gallon", symbol: "gal", factor: 3.78541 }
    ] as StandardUnit[]
  },
  time: {
    name: "Time",
    icon: Clock,
    units: [
      { id: "second", name: "Second", symbol: "s", factor: 1 },
      { id: "minute", name: "Minute", symbol: "min", factor: 60 },
      { id: "hour", name: "Hour", symbol: "hr", factor: 3600 },
      { id: "day", name: "Day", symbol: "day", factor: 86400 },
      { id: "week", name: "Week", symbol: "wk", factor: 604800 },
      { id: "month", name: "Month", symbol: "mo", factor: 2592000 }, // 30 days
      { id: "year", name: "Year", symbol: "yr", factor: 31536000 } // 365 days
    ] as StandardUnit[]
  },
  digital: {
    name: "Digital Storage",
    icon: Cpu,
    units: [
      { id: "bit", name: "Bit", symbol: "b", factor: 1 },
      { id: "byte", name: "Byte", symbol: "B", factor: 8 },
      { id: "kilobyte", name: "Kilobyte", symbol: "KB", factor: 8192 },
      { id: "megabyte", name: "Megabyte", symbol: "MB", factor: 8388608 },
      { id: "gigabyte", name: "Gigabyte", symbol: "GB", factor: 8589934592 },
      { id: "terabyte", name: "Terabyte", symbol: "TB", factor: 8796093022208 }
    ] as StandardUnit[]
  }
} as const;

type CategoryType = keyof typeof UNIT_CATEGORIES;

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("length");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("kilometer");
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{
    from: string;
    to: string;
    value: number;
    result: number;
    category: string;
  }>>([]);

  // Get current category data
  const currentCategory = UNIT_CATEGORIES[activeCategory];
  const Icon = currentCategory.icon;

  // Parse input value
  const numericValue = useMemo(() => {
    const num = parseFloat(inputValue);
    return isNaN(num) ? 0 : num;
  }, [inputValue]);

  // Type-safe helper to get unit by ID
  const getUnitById = (id: string): Unit | undefined => {
    return currentCategory.units.find(u => u.id === id);
  };

  // Conversion function
  const convertValue = useMemo(() => {
    const from = getUnitById(fromUnit);
    const to = getUnitById(toUnit);
    
    if (!from || !to) return 0;

    // Handle temperature conversions
    if (isTemperatureUnit(from) && isTemperatureUnit(to)) {
      const value = numericValue;
      
      // Convert to Celsius first
      let celsius;
      switch (from.id) {
        case "celsius":
          celsius = value;
          break;
        case "fahrenheit":
          celsius = (value - 32) * 5/9;
          break;
        case "kelvin":
          celsius = value - 273.15;
          break;
        default:
          celsius = value;
      }

      // Convert from Celsius to target
      switch (to.id) {
        case "celsius":
          return celsius;
        case "fahrenheit":
          return (celsius * 9/5) + 32;
        case "kelvin":
          return celsius + 273.15;
        default:
          return celsius;
      }
    }

    // Standard unit conversion (both must be standard units)
    if (isStandardUnit(from) && isStandardUnit(to)) {
      const baseValue = numericValue * from.factor;
      return baseValue / to.factor;
    }

    return 0; // Should not happen with proper typing
  }, [numericValue, fromUnit, toUnit, currentCategory]);

  // Format number with appropriate decimals
  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    if (Math.abs(num) < 0.000001) return num.toExponential(6);
    if (Math.abs(num) < 0.001) return num.toFixed(8);
    if (Math.abs(num) < 1) return num.toFixed(6);
    if (Math.abs(num) < 1000) return num.toFixed(4);
    if (Math.abs(num) < 1000000) return num.toFixed(2);
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Handle swap units
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Handle copy result
  const handleCopy = () => {
    const fromUnitData = getUnitById(fromUnit);
    const toUnitData = getUnitById(toUnit);
    const text = `${formatNumber(numericValue)} ${fromUnitData?.symbol} = ${formatNumber(convertValue)} ${toUnitData?.symbol}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Add to history
    setHistory(prev => [{
      from: `${formatNumber(numericValue)} ${fromUnitData?.symbol}`,
      to: `${formatNumber(convertValue)} ${toUnitData?.symbol}`,
      value: numericValue,
      result: convertValue,
      category: currentCategory.name
    }, ...prev.slice(0, 4)]);
  };

  // Handle reset
  const handleReset = () => {
    const units = currentCategory.units;
    if (units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
    setInputValue("1");
  };

  // Type-safe presets
  const presets: Record<CategoryType, Array<{from: string, to: string, value: string}>> = {
    length: [
      { from: "meter", to: "foot", value: "1" },
      { from: "kilometer", to: "mile", value: "5" },
      { from: "centimeter", to: "inch", value: "100" }
    ],
    weight: [
      { from: "kilogram", to: "pound", value: "1" },
      { from: "gram", to: "ounce", value: "500" },
      { from: "tonne", to: "pound", value: "1" }
    ],
    temperature: [
      { from: "celsius", to: "fahrenheit", value: "25" },
      { from: "fahrenheit", to: "celsius", value: "77" },
      { from: "celsius", to: "kelvin", value: "0" }
    ],
    volume: [
      { from: "liter", to: "gallon", value: "10" },
      { from: "milliliter", to: "teaspoon", value: "250" },
      { from: "cup", to: "milliliter", value: "2" }
    ],
    time: [
      { from: "hour", to: "minute", value: "2.5" },
      { from: "day", to: "hour", value: "7" },
      { from: "year", to: "day", value: "1" }
    ],
    digital: [
      { from: "megabyte", to: "kilobyte", value: "10" },
      { from: "gigabyte", to: "megabyte", value: "5" },
      { from: "terabyte", to: "gigabyte", value: "2" }
    ]
  };

  // Set default units when category changes
  useEffect(() => {
    const units = currentCategory.units;
    if (units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
    setInputValue("1");
  }, [activeCategory]);

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between length, weight, temperature, volume, time, and digital storage units with precision."
      keywords="unit converter, length converter, weight converter, temperature converter, measurement conversion"
    >
      <div className="max-w-6xl mx-auto">
        {/* Category Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Select Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(UNIT_CATEGORIES).map(([key, category]) => {
              const CategoryIcon = category.icon;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as CategoryType)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                    }`}
                >
                  <CategoryIcon className={`w-6 h-6 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                  <span className={`text-sm font-medium ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Converter Card */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentCategory.name} Converter
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Convert between {currentCategory.name.toLowerCase()} units
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                title="Reset"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter value"
                    step="any"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-48 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {currentCategory.units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwap}
                  className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                  title="Swap units"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Output Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(convertValue)}
                    </div>
                  </div>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-48 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {currentCategory.units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${copied
                      ? "bg-green-500 dark:bg-green-600 text-white"
                      : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                    }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copied!" : "Copy Result"}
                </button>
                <button
                  onClick={() => setInputValue("")}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Conversion Formula */}
            <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Formula:</span>{" "}
                {fromUnit === toUnit ? "Same unit" : (
                  activeCategory === "temperature" ? 
                  "Temperature conversion using specific formulas" :
                  (() => {
                    const from = getUnitById(fromUnit);
                    const to = getUnitById(toUnit);
                    if (from && to && isStandardUnit(from) && isStandardUnit(to)) {
                      return `1 ${from.symbol} = ${formatNumber(from.factor / to.factor)} ${to.symbol}`;
                    }
                    return "Conversion formula";
                  })()
                )}
              </div>
            </div>
          </div>

          {/* Presets & History */}
          <div className="space-y-6">
            {/* Quick Presets */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Conversions
              </h3>
              <div className="space-y-3">
                {presets[activeCategory]?.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(preset.value);
                      setFromUnit(preset.from);
                      setToUnit(preset.to);
                    }}
                    className="w-full p-3 text-left bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {preset.value} {getUnitById(preset.from)?.symbol} → ?
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Convert to {getUnitById(preset.to)?.name}
                        </div>
                      </div>
                      <Calculator className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Recent Conversions
              </h3>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {item.from} = {item.to}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.category} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const categoryKey = Object.keys(UNIT_CATEGORIES).find(key => 
                              UNIT_CATEGORIES[key as CategoryType].name === item.category
                            ) as CategoryType;
                            setActiveCategory(categoryKey);
                            setInputValue(item.value.toString());
                          }}
                          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          Use
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your conversion history will appear here</p>
                </div>
              )}
            </div>

            {/* Unit Info */}
            <div className="bg-linear-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                About {currentCategory.name}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {currentCategory.units.slice(0, 4).map(unit => (
                  <div key={unit.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{unit.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{unit.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-blue-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Comprehensive Unit Conversion
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                6 Categories
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Length, Weight, Temperature, Volume, Time & Digital
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Real-time Conversion
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instant results as you type or change units
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                History Tracking
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep track of your recent conversions
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Smart Formatting
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatic decimal places and scientific notation
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}