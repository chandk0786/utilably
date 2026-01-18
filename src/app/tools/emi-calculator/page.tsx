"use client";

import { useState, useEffect, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { 
  Calculator, 
  Percent, 
  Calendar,
  TrendingUp,
  PieChart,
  Download,
  Copy,
  Check,
  RefreshCw,
  BarChart3,
  Banknote,
  Clock,
  FileText,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  Sparkles,
  Wallet,
  CreditCard,
  Car,
  Home as HomeIcon,
  GraduationCap,
  Globe,
  AlertCircle,
  Plus,
  Minus,
  Maximize2
} from "lucide-react";

type LoanType = 'personal' | 'car' | 'home' | 'education' | 'business' | 'credit-card';
type TenureUnit = 'months' | 'years';
type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';

interface LoanPreset {
  type: LoanType;
  label: string;
  icon: React.ReactNode;
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  minInterest: number;
  maxInterest: number;
  minTenure: number;
  maxTenure: number;
}

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  principalPaid: number;
  interestPaid: number;
}

interface CurrencyInfo {
  symbol: string;
  name: string;
  locale: string;
  conversionRate: number;
}

export default function EMICalculator() {
  // Currency state
  const [currency, setCurrency] = useState<Currency>('INR');
  
  // Loan details (stored in USD for consistency)
  const [loanAmountUSD, setLoanAmountUSD] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('years');
  const [loanType, setLoanType] = useState<LoanType>('personal');
  
  // UI states
  const [showCustomAmount, setShowCustomAmount] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [maxSliderAmount, setMaxSliderAmount] = useState<number>(5000000); // 50 Lakh initially
  const [copied, setCopied] = useState<boolean>(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  
  // Results
  const [emiUSD, setEmiUSD] = useState<number>(0);
  const [totalPaymentUSD, setTotalPaymentUSD] = useState<number>(0);
  const [totalInterestUSD, setTotalInterestUSD] = useState<number>(0);
  const [amortization, setAmortization] = useState<AmortizationRow[]>([]);
  
  // Currency definitions
  const currencies: Record<Currency, CurrencyInfo> = {
    USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', conversionRate: 1 },
    EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', conversionRate: 0.92 },
    GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', conversionRate: 0.79 },
    INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', conversionRate: 83.5 },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', conversionRate: 1.36 },
    AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', conversionRate: 1.52 },
    JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', conversionRate: 150.5 },
  };

  // Loan presets (in USD)
  const loanPresets: LoanPreset[] = [
    {
      type: 'personal',
      label: 'Personal Loan',
      icon: <Wallet className="w-5 h-5" />,
      minAmount: 1000,
      maxAmount: 500000,
      defaultAmount: 50000,
      minInterest: 10,
      maxInterest: 24,
      minTenure: 1,
      maxTenure: 7
    },
    {
      type: 'car',
      label: 'Car Loan',
      icon: <Car className="w-5 h-5" />,
      minAmount: 10000,
      maxAmount: 100000,
      defaultAmount: 20000,
      minInterest: 7.5,
      maxInterest: 15,
      minTenure: 1,
      maxTenure: 7
    },
    {
      type: 'home',
      label: 'Home Loan',
      icon: <HomeIcon className="w-5 h-5" />,
      minAmount: 50000,
      maxAmount: 1000000,
      defaultAmount: 200000,
      minInterest: 8.5,
      maxInterest: 12,
      minTenure: 5,
      maxTenure: 30
    },
    {
      type: 'education',
      label: 'Education Loan',
      icon: <GraduationCap className="w-5 h-5" />,
      minAmount: 5000,
      maxAmount: 200000,
      defaultAmount: 30000,
      minInterest: 8,
      maxInterest: 14,
      minTenure: 1,
      maxTenure: 15
    },
    {
      type: 'business',
      label: 'Business Loan',
      icon: <TrendingUp className="w-5 h-5" />,
      minAmount: 10000,
      maxAmount: 5000000,
      defaultAmount: 100000,
      minInterest: 12,
      maxInterest: 20,
      minTenure: 1,
      maxTenure: 10
    },
    {
      type: 'credit-card',
      label: 'Credit Card',
      icon: <CreditCard className="w-5 h-5" />,
      minAmount: 500,
      maxAmount: 50000,
      defaultAmount: 5000,
      minInterest: 18,
      maxInterest: 48,
      minTenure: 3,
      maxTenure: 5
    }
  ];

  // Convert USD to selected currency
  const convertToCurrency = (amountUSD: number): number => {
    return amountUSD * currencies[currency].conversionRate;
  };

  // Convert from selected currency to USD
  const convertToUSD = (amount: number): number => {
    return amount / currencies[currency].conversionRate;
  };

  // Format currency based on selected currency
  const formatCurrency = (amountUSD: number): string => {
    const amount = convertToCurrency(amountUSD);
    const currencyInfo = currencies[currency];
    
    if (currency === 'INR' || currency === 'JPY') {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyWithDecimals = (amountUSD: number): string => {
    const amount = convertToCurrency(amountUSD);
    const currencyInfo = currencies[currency];
    
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get current currency symbol
  const getCurrencySymbol = (): string => {
    return currencies[currency].symbol;
  };

  // Get current loan preset
  const currentPreset = useMemo(() => {
    return loanPresets.find(preset => preset.type === loanType) || loanPresets[0];
  }, [loanType]);

  // Initialize max slider amount based on preset
  useEffect(() => {
    setMaxSliderAmount(currentPreset.maxAmount);
  }, [currentPreset]);

  // Handle custom amount input
  const handleCustomAmountSubmit = () => {
    if (customAmount) {
      const amount = parseFloat(customAmount.replace(/[^\d.-]/g, ''));
      if (!isNaN(amount) && amount > 0) {
        const amountUSD = convertToUSD(amount);
        setLoanAmountUSD(amountUSD);
        
        // Update max slider if needed
        if (amountUSD > maxSliderAmount) {
          setMaxSliderAmount(amountUSD * 1.1); // 10% buffer
        }
        
        setShowCustomAmount(false);
        setCustomAmount('');
      }
    }
  };

  // Calculate EMI
  useEffect(() => {
    if (loanAmountUSD <= 0 || interestRate <= 0 || tenure <= 0) {
      setEmiUSD(0);
      setTotalPaymentUSD(0);
      setTotalInterestUSD(0);
      setAmortization([]);
      return;
    }

    // Convert tenure to months
    const tenureInMonths = tenureUnit === 'years' ? tenure * 12 : tenure;
    
    // Monthly interest rate
    const monthlyInterestRate = interestRate / 100 / 12;
    
    // EMI calculation formula
    const emiValue = loanAmountUSD * 
      monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, tenureInMonths) / 
      (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
    
    setEmiUSD(emiValue);
    
    // Total payment and interest
    const totalPaymentValue = emiValue * tenureInMonths;
    const totalInterestValue = totalPaymentValue - loanAmountUSD;
    
    setTotalPaymentUSD(totalPaymentValue);
    setTotalInterestUSD(totalInterestValue);
    
    // Generate amortization schedule
    const schedule: AmortizationRow[] = [];
    let remainingBalance = loanAmountUSD;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    
    for (let month = 1; month <= tenureInMonths; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = emiValue - interestPayment;
      
      // Handle final payment adjustment
      const actualPrincipalPayment = Math.min(principalPayment, remainingBalance);
      const actualEmi = actualPrincipalPayment + interestPayment;
      
      remainingBalance -= actualPrincipalPayment;
      totalPrincipalPaid += actualPrincipalPayment;
      totalInterestPaid += interestPayment;
      
      schedule.push({
        month,
        emi: actualEmi,
        principal: actualPrincipalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        principalPaid: totalPrincipalPaid,
        interestPaid: totalInterestPaid,
      });
      
      if (remainingBalance <= 0) break;
    }
    
    setAmortization(schedule);
  }, [loanAmountUSD, interestRate, tenure, tenureUnit]);

  // Apply loan preset
  const applyLoanPreset = (preset: LoanPreset) => {
    setLoanType(preset.type);
    setLoanAmountUSD(preset.defaultAmount);
    setInterestRate(preset.minInterest);
    setTenure(preset.minTenure);
    setTenureUnit('years');
    setMaxSliderAmount(preset.maxAmount);
  };

  // Reset calculator
  const handleReset = () => {
    setLoanAmountUSD(currentPreset.defaultAmount);
    setInterestRate(currentPreset.minInterest);
    setTenure(currentPreset.minTenure);
    setTenureUnit('years');
    setMaxSliderAmount(currentPreset.maxAmount);
    setShowCustomAmount(false);
    setCustomAmount('');
  };

  // Quick loan amount presets (in selected currency)
  const amountPresets = useMemo(() => {
    const presets = [
      50000,    // 50K
      100000,   // 1 Lakh
      500000,   // 5 Lakh
      1000000,  // 10 Lakh
      5000000,  // 50 Lakh
    ];
    
    // Convert to USD for internal use
    return presets.map(amount => convertToUSD(amount));
  }, [currency]);

  const interestPresets = [7.5, 10.5, 12.5, 15, 18];
  const tenurePresets = [1, 3, 5, 7, 10];

  // Copy results
  const handleCopy = (format: 'summary' | 'schedule') => {
    let text = '';
    
    if (format === 'summary') {
      text = `
EMI Calculation Results (${currency}):
Loan Type: ${currentPreset.label}
Loan Amount: ${formatCurrency(loanAmountUSD)}
Interest Rate: ${interestRate}%
Tenure: ${tenure} ${tenureUnit} (${tenureUnit === 'years' ? tenure * 12 : tenure} months)
EMI: ${formatCurrencyWithDecimals(emiUSD)}
Total Payment: ${formatCurrency(totalPaymentUSD)}
Total Interest: ${formatCurrency(totalInterestUSD)}
Interest to Principal Ratio: ${loanAmountUSD > 0 ? ((totalInterestUSD / loanAmountUSD) * 100).toFixed(1) : 0}%
      `.trim();
    } else {
      const header = "Month,EMI,Principal,Interest,Remaining Balance,Cumulative Principal,Cumulative Interest";
      const rows = amortization.slice(0, 12).map(row => 
        `${row.month},${formatCurrencyWithDecimals(row.emi)},${formatCurrencyWithDecimals(row.principal)},${formatCurrencyWithDecimals(row.interest)},${formatCurrency(row.remainingBalance)},${formatCurrency(row.principalPaid)},${formatCurrency(row.interestPaid)}`
      );
      text = [header, ...rows].join('\n');
    }
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download functions
  const generateCSV = (): string => {
    const headers = ['Month', 'EMI', 'Principal', 'Interest', 'Remaining Balance', 'Cumulative Principal', 'Cumulative Interest'];
    const rows = amortization.map(row => [
      row.month,
      convertToCurrency(row.emi).toFixed(2),
      convertToCurrency(row.principal).toFixed(2),
      convertToCurrency(row.interest).toFixed(2),
      convertToCurrency(row.remainingBalance).toFixed(2),
      convertToCurrency(row.principalPaid).toFixed(2),
      convertToCurrency(row.interestPaid).toFixed(2)
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const handleDownload = (format: 'csv' | 'txt') => {
    if (amortization.length === 0) return;
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    if (format === 'csv') {
      content = generateCSV();
      filename = `emi-calculator-${currency}.csv`;
      mimeType = 'text/csv';
    } else {
      content = generateCSV().replace(/,/g, '\t');
      filename = `emi-calculator-${currency}.txt`;
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  // Calculate payment breakdown for pie chart
  const paymentBreakdown = useMemo(() => {
    return {
      principal: loanAmountUSD,
      interest: totalInterestUSD,
      total: totalPaymentUSD
    };
  }, [loanAmountUSD, totalInterestUSD, totalPaymentUSD]);

  // Calculate interest to principal ratio
  const interestRatio = useMemo(() => {
    return loanAmountUSD > 0 ? (totalInterestUSD / loanAmountUSD) * 100 : 0;
  }, [totalInterestUSD, loanAmountUSD]);

  // Increase max amount
  const increaseMaxAmount = () => {
    const newMax = maxSliderAmount * 2; // Double the current max
    setMaxSliderAmount(newMax);
    
    // If current loan amount is already at max, increase it too
    if (loanAmountUSD >= maxSliderAmount * 0.9) {
      setLoanAmountUSD(newMax * 0.5); // Set to 50% of new max
    }
  };

  // Get amount in selected currency for display
  const getAmountInCurrency = (amountUSD: number): number => {
    return convertToCurrency(amountUSD);
  };

  return (
    <ToolLayout
      title="EMI Calculator"
      description="Calculate Equated Monthly Installments for personal loans, car loans, education loans, and other loans with detailed amortization schedule"
      keywords="emi calculator, loan calculator, monthly installment, personal loan emi, car loan emi, education loan, amortization schedule"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Currency Selector */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Currency Selection
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your preferred currency
              </p>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              1 USD = {currencies[currency].conversionRate.toFixed(2)} {currency}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(currencies).map(([code, info]) => (
              <button
                key={code}
                onClick={() => setCurrency(code as Currency)}
                className={`px-4 py-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${currency === code
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <span className="text-xl font-bold">{info.symbol}</span>
                <span className="text-sm font-medium">{code}</span>
                <span className="text-xs opacity-75">{info.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loan Type Selector */}
        <div className="mb-8 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Select Loan Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {loanPresets.map((preset) => (
              <button
                key={preset.type}
                onClick={() => applyLoanPreset(preset)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${loanType === preset.type
                    ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <div className={`p-2 rounded-lg ${loanType === preset.type ? 'bg-blue-200 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {preset.icon}
                </div>
                <span className="text-sm font-medium text-center">{preset.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {preset.minInterest}% - {preset.maxInterest}%
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Loan Details
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Configure your {currentPreset.label.toLowerCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Reset all values"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Loan Amount - UPDATED with 5Cr+ support */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Loan Amount ({currency})
                  </label>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(loanAmountUSD)}
                  </div>
                </div>
                
                {/* Amount controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Range: {formatCurrency(convertToUSD(1000))} to {formatCurrency(maxSliderAmount)}
                  </div>
                  <button
                    onClick={increaseMaxAmount}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Increase Max to {formatCurrency(maxSliderAmount * 2)}
                  </button>
                </div>
                
                <input
                  type="range"
                  min={currentPreset.minAmount}
                  max={maxSliderAmount}
                  step="1000"
                  value={loanAmountUSD}
                  onChange={(e) => setLoanAmountUSD(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(convertToUSD(currentPreset.minAmount))}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(maxSliderAmount)}
                  </span>
                </div>
                
                {/* Quick Presets & Custom Amount */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quick Amounts
                    </h4>
                    <button
                      onClick={() => setShowCustomAmount(!showCustomAmount)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      {showCustomAmount ? (
                        <>
                          <Minus className="w-4 h-4" />
                          Hide Custom Amount
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Enter Custom Amount
                        </>
                      )}
                    </button>
                  </div>
                  
                  {showCustomAmount && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 font-bold">{getCurrencySymbol()}</span>
                          </div>
                          <input
                            type="text"
                            placeholder={`Enter amount in ${currency} (e.g., 10000000)`}
                            value={customAmount}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d]/g, '');
                              setCustomAmount(value);
                            }}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          onClick={handleCustomAmountSubmit}
                          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Supports any amount up to 100 Crore ({currency})
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {amountPresets.map((amountUSD) => (
                      <button
                        key={amountUSD}
                        onClick={() => setLoanAmountUSD(amountUSD)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${loanAmountUSD === amountUSD
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        {formatCurrency(amountUSD)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Interest Rate
                  </label>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {interestRate}%
                  </div>
                </div>
                <input
                  type="range"
                  min={currentPreset.minInterest}
                  max={currentPreset.maxInterest}
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:dark:bg-green-500"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPreset.minInterest}%
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPreset.maxInterest}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {interestPresets.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setInterestRate(rate)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${interestRate === rate
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Loan Tenure
                  </label>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {tenure} {tenureUnit}
                    <span className="text-sm ml-2 text-gray-500 dark:text-gray-400">
                      ({tenureUnit === 'years' ? tenure * 12 : tenure} months)
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setTenureUnit('years')}
                    className={`flex-1 py-2.5 rounded-lg ${tenureUnit === 'years' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Years
                  </button>
                  <button
                    onClick={() => setTenureUnit('months')}
                    className={`flex-1 py-2.5 rounded-lg ${tenureUnit === 'months' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    Months
                  </button>
                </div>
                
                <input
                  type="range"
                  min={currentPreset.minTenure}
                  max={currentPreset.maxTenure}
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:dark:bg-purple-500"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPreset.minTenure} {tenureUnit}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPreset.maxTenure} {tenureUnit}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tenurePresets.map((years) => (
                    <button
                      key={years}
                      onClick={() => {
                        setTenure(years);
                        setTenureUnit('years');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm ${tenure === years && tenureUnit === 'years'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {years} years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interest Impact Comparison */}
            <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-amber-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Interest Impact Comparison
              </h3>
              <div className="space-y-4">
                {[interestRate - 2, interestRate, interestRate + 2].map((rate) => {
                  const tenureInMonths = tenureUnit === 'years' ? tenure * 12 : tenure;
                  const monthlyRate = rate / 100 / 12;
                  const calculatedEmi = loanAmountUSD * 
                    monthlyRate * 
                    Math.pow(1 + monthlyRate, tenureInMonths) / 
                    (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
                  
                  return (
                    <div key={rate} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rate === interestRate ? 'bg-amber-100 dark:bg-amber-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                          <Percent className={`w-5 h-5 ${rate === interestRate ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{rate}% Interest</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {tenureInMonths} payments
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrencyWithDecimals(calculatedEmi)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          per month
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* EMI Summary Card */}
            <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-emerald-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      EMI Summary
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your monthly payment breakdown
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy('summary')}
                    className={`p-2.5 rounded-lg transition-colors ${copied
                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                      }`}
                    title="Copy summary"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors flex items-center gap-1"
                      title="Download options"
                    >
                      <Download className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showDownloadMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-10">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                            Download Amortization
                          </div>
                          <button
                            onClick={() => handleDownload('csv')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3"
                          >
                            <FileSpreadsheet className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="font-medium text-gray-800 dark:text-white">CSV (Excel)</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Best for spreadsheets</div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleDownload('txt')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3"
                          >
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-800 dark:text-white">Text File</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Simple text format</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* EMI Amount */}
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatCurrencyWithDecimals(emiUSD)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  Monthly EMI
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {tenureUnit === 'years' ? tenure * 12 : tenure} payments
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Payment</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(totalPaymentUSD)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Interest</div>
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(totalInterestUSD)}
                    </div>
                  </div>
                </div>

                {/* Pie Chart Visualization */}
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Breakdown
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {interestRatio.toFixed(1)}% interest ratio
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full border-8 border-emerald-500"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-red-500"
                        style={{
                          clipPath: `inset(0 ${100 - (paymentBreakdown.principal / paymentBreakdown.total * 100)}% 0 0)`
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {((paymentBreakdown.principal / paymentBreakdown.total) * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Principal</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Principal</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(paymentBreakdown.principal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Interest</span>
                        </div>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {formatCurrency(paymentBreakdown.interest)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Amortization Schedule
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    First 12 months • {currentPreset.label}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy('schedule')}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => handleDownload('csv')}
                    className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {amortization.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="max-h-100 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-400">Month</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">EMI</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Principal</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Interest</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortization.slice(0, 60).map((row, index) => (
                          <tr 
                            key={row.month} 
                            className={`border-b border-gray-100 dark:border-gray-800 ${
                              index >= 12 ? 'opacity-80' : ''
                            }`}
                          >
                            <td className="py-2 text-gray-700 dark:text-gray-300">{row.month}</td>
                            <td className="py-2 text-right text-gray-900 dark:text-white">
                              {formatCurrencyWithDecimals(row.emi)}
                            </td>
                            <td className="py-2 text-right text-green-600 dark:text-green-400">
                              {formatCurrencyWithDecimals(row.principal)}
                            </td>
                            <td className="py-2 text-right text-red-600 dark:text-red-400">
                              {formatCurrencyWithDecimals(row.interest)}
                            </td>
                            <td className="py-2 text-right text-gray-700 dark:text-gray-400">
                              {formatCurrency(row.remainingBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Showing {Math.min(12, amortization.length)} of {amortization.length} payments
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Enter loan details to see amortization schedule</p>
                </div>
              )}
            </div>

            {/* Currency Info */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Currency Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Selected Currency</span>
                  <span className="font-medium">{currency} ({currencies[currency].name})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Currency Symbol</span>
                  <span className="font-bold text-xl">{getCurrencySymbol()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
                  <span className="font-medium">
                    1 USD = {currencies[currency].conversionRate.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Complete EMI Calculator Features
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                7 Currencies
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                USD, EUR, GBP, INR, CAD, AUD, JPY with conversion
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Maximize2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                5Cr+ Support
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Extendable limits with custom amount input
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PieChart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Visual Breakdown
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Pie chart showing principal vs interest ratio
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                6 Loan Types
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Personal, Car, Home, Education, Business & Credit Card
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}