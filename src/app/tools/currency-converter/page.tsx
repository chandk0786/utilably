"use client";
import RelatedTools from "@/components/RelatedTools";
import { Globe, RefreshCw, TrendingUp, Calculator, ArrowRightLeft, History, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

// Base currency data (will be enhanced with real rates)
const baseCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },

  // ✅ Add more (examples)
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب", flag: "🇧🇭" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", flag: "🇴🇲" },

  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },

  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },

  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
];


// Popular currency pairs for quick selection
const popularPairs = [
  { from: "USD", to: "EUR", label: "USD → EUR" },
  { from: "EUR", to: "GBP", label: "EUR → GBP" },
  { from: "USD", to: "JPY", label: "USD → JPY" },
  { from: "USD", to: "INR", label: "USD → INR" },
  { from: "GBP", to: "EUR", label: "GBP → EUR" },
  { from: "AUD", to: "USD", label: "AUD → USD" },
];

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

export default function CurrencyConverterPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversionHistory, setConversionHistory] = useState<Array<{
    from: string;
    to: string;
    amount: number;
    result: number;
    rate: number;
    timestamp: string;
  }>>([]);

  // Initialize currencies with base data
  useEffect(() => {
    const initializedCurrencies = baseCurrencies.map(currency => ({
      ...currency,
      rate: currency.code === "USD" ? 1 : 1 // Will be updated by API
    }));
    setCurrencies(initializedCurrencies);
    fetchExchangeRates();
  }, []);

  // Fetch real exchange rates from free API
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    setError(null);
    
    try {
      // Using ExchangeRate-API free tier (no API key needed for limited use)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      const rates = data.rates;
      const date = new Date(data.date);
      
      // Update currencies with real rates
      const updatedCurrencies = baseCurrencies.map(currency => ({
        ...currency,
        rate: rates[currency.code] || 1
      }));
      
      setCurrencies(updatedCurrencies);
      setLastUpdated(date.toLocaleString());
      
      // Calculate initial conversion
      calculateConversion(updatedCurrencies);
      
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError('Unable to fetch live rates. Using sample data.');
      
      // Fallback to sample rates
const sampleRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.5,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.18,
  INR: 83.2,
  SGD: 1.34,
  NZD: 1.64,
  AED: 3.67,

  // ✅ Add your new ones (approx placeholders)
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.38,
  OMR: 0.38,

  ZAR: 18.5,
  SEK: 10.6,
  NOK: 10.9,
  DKK: 6.9,

  HKD: 7.8,
  KRW: 1330,
  THB: 35.8,
  MYR: 4.7,
  IDR: 15600,
  PHP: 56.5,
  VND: 24500,

  BRL: 5.0,
  MXN: 17.2,
  TRY: 30.0,
  PLN: 4.0,
  CZK: 23.0,
  HUF: 360,
};
      
      const updatedCurrencies = baseCurrencies.map(currency => ({
        ...currency,
        rate: sampleRates[currency.code as keyof typeof sampleRates] || 1
      }));
      
      setCurrencies(updatedCurrencies);
      setLastUpdated(new Date().toLocaleString() + " (Sample Data)");
      calculateConversion(updatedCurrencies);
      
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Get currency object by code
  const getCurrency = (code: string) => {
    return currencies.find(c => c.code === code) || currencies[0];
  };

  // Calculate conversion
  const calculateConversion = (currencyList?: Currency[]) => {
    const currencyData = currencyList || currencies;
    if (currencyData.length === 0) return;
    
    const from = getCurrency(fromCurrency);
    const to = getCurrency(toCurrency);
    
    if (!from || !to) return;
    
    // Calculate rate: toRate / fromRate
    const rate = to.rate / from.rate;
    setExchangeRate(rate);
    
    const result = amount * rate;
    setConvertedAmount(result);
  };

  // Refresh rates
  const refreshRates = async () => {
    setIsLoading(true);
    await fetchExchangeRates();
    setIsLoading(false);
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Set popular pair
  const setPopularPair = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  // Format currency display
  const formatCurrency = (value: number, currencyCode: string) => {
    const currency = getCurrency(currencyCode);
    if (!currency) return `${currencyCode} ${value.toFixed(2)}`;
    
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      return formatter.format(value).replace(currencyCode, currency.symbol);
    } catch {
      return `${currency.symbol}${value.toFixed(2)}`;
    }
  };

  // Recalculate when inputs change
  useEffect(() => {
    if (currencies.length > 0) {
      calculateConversion();
      
      // Add to history if both currencies are valid
      const from = getCurrency(fromCurrency);
      const to = getCurrency(toCurrency);
      
      if (from && to && amount > 0) {
        const rate = to.rate / from.rate;
        const result = amount * rate;
        
        const historyEntry = {
          from: fromCurrency,
          to: toCurrency,
          amount,
          result,
          rate,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setConversionHistory(prev => [historyEntry, ...prev.slice(0, 4)]);
      }
    }
  }, [amount, fromCurrency, toCurrency, currencies]);

  const fromCurrencyObj = getCurrency(fromCurrency);
  const toCurrencyObj = getCurrency(toCurrency);

  return (
    <ToolLayout
      title="Currency Converter - Real-time Exchange Rates"
      description="Free online currency converter with real-time exchange rates from ExchangeRate-API. Convert between 150+ currencies instantly."
      keywords="currency converter, exchange rates, forex converter, money converter, currency conversion, live rates"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 mb-6">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Real-time <span className="text-primary">Currency Converter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Convert between currencies with live exchange rates from ExchangeRate-API.
          </p>
          
          {error && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {isLoadingRates ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading exchange rates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Converter Interface */}
            <div className="lg:col-span-2">
              <div className="border rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Currency Converter</h2>
                  <div className="text-sm text-muted-foreground">
                    Updated: {lastUpdated}
                  </div>
                </div>
                
                {/* Amount Input */}
                <div className="mb-8">
                  <label className="block text-lg font-medium mb-3">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 text-3xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold">
                      {fromCurrencyObj?.symbol || '$'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[50, 100, 500, 1000, 5000].map((value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value)}
                        className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                          amount === value 
                            ? 'bg-primary text-white border-primary' 
                            : 'hover:bg-accent'
                        }`}
                      >
                        {fromCurrencyObj?.symbol || '$'}{value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* From Currency */}
                  <div>
                    <label className="block text-lg font-medium mb-3">From Currency</label>
                    <div className="relative">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full p-4 pl-14 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                        disabled={isLoadingRates}
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
                        {fromCurrencyObj?.flag || '🇺🇸'}
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-lg font-bold">{fromCurrency}</span>
                      </div>
                    </div>
                  </div>

                  {/* To Currency */}
                  <div>
                    <label className="block text-lg font-medium mb-3">To Currency</label>
                    <div className="relative">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full p-4 pl-14 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                        disabled={isLoadingRates}
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
                        {toCurrencyObj?.flag || '🇪🇺'}
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-lg font-bold">{toCurrency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={swapCurrencies}
                    className="p-3 rounded-full border bg-white hover:bg-accent transition-colors disabled:opacity-50"
                    title="Swap currencies"
                    disabled={isLoadingRates}
                  >
                    <ArrowRightLeft className="h-6 w-6" />
                  </button>
                </div>

                {/* Result Display */}
                <div className="p-6 border-2 border-dashed rounded-xl text-center mb-6">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {formatCurrency(convertedAmount, toCurrency)}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {formatCurrency(amount, fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    1 {toCurrency} = {(1 / exchangeRate).toFixed(6)} {fromCurrency}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={refreshRates}
                    disabled={isLoading || isLoadingRates}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating Rates...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-5 w-5" />
                        Refresh Live Rates
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const text = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
                      navigator.clipboard.writeText(text);
                      alert("Conversion copied to clipboard!");
                    }}
                    className="px-6 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
                  >
                    Copy Result
                  </button>
                </div>
              </div>

              {/* Popular Pairs */}
              <div className="border rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Popular Currency Pairs</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {popularPairs.map((pair, index) => {
                    const fromCurr = getCurrency(pair.from);
                    const toCurr = getCurrency(pair.to);
                    const rate = toCurr?.rate && fromCurr?.rate ? toCurr.rate / fromCurr.rate : 0;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setPopularPair(pair.from, pair.to)}
                        className="p-3 border rounded-lg text-center hover:bg-accent transition-colors disabled:opacity-50"
                        disabled={isLoadingRates}
                      >
                        <div className="flex justify-center gap-2 mb-1">
                          <span className="text-xl">{fromCurr?.flag || '🇺🇸'}</span>
                          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xl">{toCurr?.flag || '🇪🇺'}</span>
                        </div>
                        <div className="font-medium">{pair.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {rate ? rate.toFixed(4) : '...'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Exchange Rate Info */}
              <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Exchange Rate Info
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Rate</div>
                    <div className="text-2xl font-bold text-primary">
                      1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Inverse Rate</div>
                    <div className="text-xl font-semibold">
                      1 {toCurrency} = {(1 / exchangeRate).toFixed(6)} {fromCurrency}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                    <div className="font-medium">{lastUpdated}</div>
                    <button
                      onClick={refreshRates}
                      disabled={isLoading || isLoadingRates}
                      className="mt-2 text-sm text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh now
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Conversions */}
              <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Conversions
                </h3>
                <div className="space-y-3">
                  {conversionHistory.length > 0 ? (
                    conversionHistory.map((history, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {history.amount} {history.from}
                          </span>
                          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {history.result.toFixed(2)} {history.to}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Rate: {history.rate.toFixed(4)}</span>
                          <span>{history.timestamp}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No conversions yet
                    </div>
                  )}
                </div>
              </div>

              {/* Supported Currencies */}
              <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Supported Currencies</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currencies.map((currency) => (
                    <div 
                      key={currency.code}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                      onClick={() => {
                        if (fromCurrency === currency.code) {
                          setToCurrency(currency.code);
                        } else {
                          setFromCurrency(currency.code);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{currency.flag}</span>
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-xs text-muted-foreground">{currency.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{currency.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          {currency.rate.toFixed(4)} USD
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Info */}
              <div className="border rounded-xl p-6 bg-linear-to-br from-green-50 to-emerald-50">
                <h3 className="text-lg font-semibold mb-3">Live Rates Info</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Powered by ExchangeRate-API</li>
                  <li>• Rates update on refresh</li>
                  <li>• 150+ currencies available</li>
                  <li>• Free tier: 1,500 requests/month</li>
                  <li>• Fallback to sample data if API fails</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">About Currency Conversion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real API Integration</h3>
              <p className="text-muted-foreground">
                Uses ExchangeRate-API for real exchange rates with automatic fallback to sample data.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-600 mb-4">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Updates</h3>
              <p className="text-muted-foreground">
                Refresh button fetches latest rates from the API. Rates are cached for performance.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-600 mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accurate Calculations</h3>
              <p className="text-muted-foreground">
                Precise currency conversion with up to 6 decimal places for exchange rates.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-linear-to-r from-primary/10 to-primary/5 border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">150+</div>
                <div className="text-muted-foreground">Currencies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Live API</div>
                <div className="text-muted-foreground">Exchange Rates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1,500</div>
                <div className="text-muted-foreground">Free Requests/Month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <div className="text-muted-foreground">Registration Needed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="currency-converter" />

    </ToolLayout>
  );
}