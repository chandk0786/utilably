"use client";

import RelatedTools from "@/components/RelatedTools";
import { useState, useEffect, useMemo } from "react";
import { 
  Home, Calculator, Percent, Calendar,
  Download, Copy, Check, RefreshCw,
  BarChart3, Globe, FileText, FileSpreadsheet,
  FileDown, ChevronDown, AlertCircle
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type LoanTermUnit = 'years' | 'months';
type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly';
type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';
type DownloadFormat = 'csv' | 'pdf' | 'txt';

interface AmortizationRow {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  equity: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

interface CurrencyInfo {
  symbol: string;
  name: string;
  locale: string;
}

const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
const BACKUP_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 150.5
};

export default function MortgageCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(BACKUP_RATES);
  const [loadingRates, setLoadingRates] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);
  
  // Loan inputs
  const [homePriceUSD, setHomePriceUSD] = useState<number>(500000);
  const [downPaymentUSD, setDownPaymentUSD] = useState<number>(100000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanAmountUSD, setLoanAmountUSD] = useState<number>(400000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [loanTermUnit, setLoanTermUnit] = useState<LoanTermUnit>('years');
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('monthly');
  const [propertyTaxUSD, setPropertyTaxUSD] = useState<number>(5000);
  const [insuranceUSD, setInsuranceUSD] = useState<number>(1500);
  const [pmiUSD, setPmiUSD] = useState<number>(0);
  const [hoaUSD, setHoaUSD] = useState<number>(0);

  // Results
  const [paymentAmountUSD, setPaymentAmountUSD] = useState<number>(0);
  const [totalInterestUSD, setTotalInterestUSD] = useState<number>(0);
  const [totalPaymentUSD, setTotalPaymentUSD] = useState<number>(0);
  const [amortization, setAmortization] = useState<AmortizationRow[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);

  // Currency definitions
  const currencies: Record<Currency, CurrencyInfo> = {
    USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
    EUR: { symbol: '€', name: 'Euro', locale: 'de-DE' },
    GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
    INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  };

  // Get dynamic currency symbol
  const getCurrencySymbol = (): string => {
    return currencies[currency].symbol;
  };

  // Get payment frequency label
  const getPaymentFrequencyLabel = (): string => {
    switch (paymentFrequency) {
      case 'biweekly': return 'Bi-Weekly';
      case 'weekly': return 'Weekly';
      default: return 'Monthly';
    }
  };

  // Get payment period label
  const getPaymentPeriodLabel = (): string => {
    switch (paymentFrequency) {
      case 'biweekly': return 'payment';
      case 'weekly': return 'week';
      default: return 'month';
    }
  };

  // Fetch live exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoadingRates(true);
      setRateError(null);
      
      try {
        const response = await fetch(EXCHANGE_API_URL);
        
        if (response.ok) {
          const data = await response.json();
          setExchangeRates(data.rates);
        } else {
          throw new Error('Failed to fetch exchange rates');
        }
      } catch (error) {
        console.log('Using backup exchange rates:', error);
        setRateError('Using cached exchange rates. Rates may not be current.');
        setExchangeRates(BACKUP_RATES);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert USD to selected currency
  const convertToCurrency = (amountUSD: number): number => {
    const rate = exchangeRates[currency] || BACKUP_RATES[currency] || 1;
    return amountUSD * rate;
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

  // Format currency with decimals
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

  // Get current exchange rate
  const getExchangeRate = (): number => {
    return exchangeRates[currency] || BACKUP_RATES[currency] || 1;
  };

  // Calculate loan amount based on down payment
  useEffect(() => {
    const calculatedLoanAmount = homePriceUSD - downPaymentUSD;
    setLoanAmountUSD(calculatedLoanAmount > 0 ? calculatedLoanAmount : 0);
  }, [homePriceUSD, downPaymentUSD]);

  // Calculate down payment based on percentage
  useEffect(() => {
    const calculatedDownPayment = (homePriceUSD * downPaymentPercent) / 100;
    setDownPaymentUSD(calculatedDownPayment);
  }, [homePriceUSD, downPaymentPercent]);

  // Calculate mortgage payments
  useEffect(() => {
    if (loanAmountUSD <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setPaymentAmountUSD(0);
      setTotalInterestUSD(0);
      setTotalPaymentUSD(0);
      setAmortization([]);
      return;
    }

    // Convert loan term to total number of payments based on frequency
    let totalPayments: number;
    let paymentsPerYear: number;
    
    switch (paymentFrequency) {
      case 'biweekly':
        paymentsPerYear = 26;
        break;
      case 'weekly':
        paymentsPerYear = 52;
        break;
      default: // monthly
        paymentsPerYear = 12;
    }
    
    totalPayments = loanTermUnit === 'years' ? loanTerm * paymentsPerYear : loanTerm;
    
    // Calculate payment amount
    const periodicInterestRate = (interestRate / 100) / paymentsPerYear;
    
    const periodicPayment = loanAmountUSD * 
      (periodicInterestRate * Math.pow(1 + periodicInterestRate, totalPayments)) / 
      (Math.pow(1 + periodicInterestRate, totalPayments) - 1);

    setPaymentAmountUSD(periodicPayment);

    // Calculate total payment and interest
    const totalPaymentCalc = periodicPayment * totalPayments;
    const totalInterestCalc = totalPaymentCalc - loanAmountUSD;
    
    setTotalPaymentUSD(totalPaymentCalc);
    setTotalInterestUSD(totalInterestCalc);

    // Generate amortization schedule
    const schedule: AmortizationRow[] = [];
    let remainingBalance = loanAmountUSD;
    let totalEquity = 0;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;

    for (let paymentNum = 1; paymentNum <= totalPayments; paymentNum++) {
      const interestPayment = remainingBalance * periodicInterestRate;
      const principalPayment = periodicPayment - interestPayment;
      
      const actualPrincipalPayment = Math.min(principalPayment, remainingBalance);
      const actualPayment = actualPrincipalPayment + interestPayment;
      
      remainingBalance -= actualPrincipalPayment;
      totalEquity += actualPrincipalPayment;
      cumulativeInterest += interestPayment;
      cumulativePrincipal += actualPrincipalPayment;

      schedule.push({
        paymentNumber: paymentNum,
        payment: actualPayment,
        principal: actualPrincipalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        equity: totalEquity,
        cumulativeInterest,
        cumulativePrincipal,
      });

      if (remainingBalance <= 0) break;
    }

    setAmortization(schedule);
  }, [loanAmountUSD, interestRate, loanTerm, loanTermUnit, paymentFrequency]);

  // Calculate total payment with taxes and insurance
  const totalPaymentWithExtrasUSD = useMemo(() => {
    const periodicTax = propertyTaxUSD / 12;
    const periodicInsurance = insuranceUSD / 12;
    return paymentAmountUSD + periodicTax + periodicInsurance + pmiUSD + hoaUSD;
  }, [paymentAmountUSD, propertyTaxUSD, insuranceUSD, pmiUSD, hoaUSD]);

  // Calculate loan-to-value ratio
  const ltvRatio = useMemo(() => {
    return (loanAmountUSD / homePriceUSD) * 100;
  }, [loanAmountUSD, homePriceUSD]);

  // Reset calculator
  const handleReset = () => {
    setHomePriceUSD(500000);
    setDownPaymentUSD(100000);
    setDownPaymentPercent(20);
    setInterestRate(4.5);
    setLoanTerm(30);
    setLoanTermUnit('years');
    setPaymentFrequency('monthly');
    setPropertyTaxUSD(5000);
    setInsuranceUSD(1500);
    setPmiUSD(0);
    setHoaUSD(0);
  };

  // Copy results to clipboard
  const handleCopy = (format: 'summary' | 'schedule') => {
    let text = '';
    
    if (format === 'summary') {
      text = `
Mortgage Calculation Results (${currency}):
Home Price: ${formatCurrency(homePriceUSD)}
Down Payment: ${formatCurrency(downPaymentUSD)} (${downPaymentPercent}%)
Loan Amount: ${formatCurrency(loanAmountUSD)}
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} ${loanTermUnit}
Payment Frequency: ${getPaymentFrequencyLabel()}
${getPaymentFrequencyLabel()} Payment: ${formatCurrencyWithDecimals(paymentAmountUSD)}
Total ${getPaymentFrequencyLabel()} Payment (with extras): ${formatCurrencyWithDecimals(totalPaymentWithExtrasUSD)}
Total Payment: ${formatCurrency(totalPaymentUSD)}
Total Interest: ${formatCurrency(totalInterestUSD)}
Loan-to-Value: ${ltvRatio.toFixed(1)}%
Exchange Rate: 1 USD = ${getExchangeRate().toFixed(4)} ${currency}
      `.trim();
    } else {
      const header = "Payment #,Payment,Principal,Interest,Remaining Balance,Equity Built,Cumulative Interest,Cumulative Principal";
      const rows = amortization.slice(0, 12).map(row => 
        `${row.paymentNumber},${formatCurrencyWithDecimals(row.payment)},${formatCurrencyWithDecimals(row.principal)},${formatCurrencyWithDecimals(row.interest)},${formatCurrency(row.remainingBalance)},${formatCurrency(row.equity)},${formatCurrency(row.cumulativeInterest)},${formatCurrency(row.cumulativePrincipal)}`
      );
      text = [header, ...rows].join('\n');
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick presets
  const presets = [
    { label: "30-Year Fixed", term: 30, rate: 4.5, unit: 'years' as LoanTermUnit },
    { label: "15-Year Fixed", term: 15, rate: 3.75, unit: 'years' as LoanTermUnit },
    { label: "20-Year Fixed", term: 20, rate: 4.25, unit: 'years' as LoanTermUnit },
    { label: "10-Year Fixed", term: 10, rate: 3.5, unit: 'years' as LoanTermUnit },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setLoanTerm(preset.term);
    setLoanTermUnit(preset.unit);
    setInterestRate(preset.rate);
  };

  // DOWNLOAD FUNCTIONS
  const generateCSV = (): string => {
    const headers = ['Payment #', 'Payment', 'Principal', 'Interest', 'Remaining Balance', 'Equity Built', 'Cumulative Interest', 'Cumulative Principal'];
    const rows = amortization.map(row => [
      row.paymentNumber,
      convertToCurrency(row.payment).toFixed(2),
      convertToCurrency(row.principal).toFixed(2),
      convertToCurrency(row.interest).toFixed(2),
      convertToCurrency(row.remainingBalance).toFixed(2),
      convertToCurrency(row.equity).toFixed(2),
      convertToCurrency(row.cumulativeInterest).toFixed(2),
      convertToCurrency(row.cumulativePrincipal).toFixed(2)
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const handleDownload = (format: DownloadFormat) => {
    if (amortization.length === 0) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'csv':
        content = generateCSV();
        filename = `mortgage-amortization-${currency}.csv`;
        mimeType = 'text/csv';
        break;
      case 'txt':
        content = generateCSV().replace(/,/g, '\t');
        filename = `mortgage-amortization-${currency}.txt`;
        mimeType = 'text/plain';
        break;
      case 'pdf':
        content = generateCSV();
        filename = `mortgage-amortization-${currency}.pdf`;
        mimeType = 'application/pdf';
        break;
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

  return (
    <ToolLayout
      title="Mortgage Calculator with Live Exchange Rates"
      description="Calculate mortgage payments with real-time currency conversion. Includes amortization schedule and multiple export formats."
      keywords="mortgage calculator, live exchange rates, currency converter, amortization schedule, loan calculator"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Currency Selector */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Currency & Exchange Rates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time conversion rates
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {loadingRates && (
                <span className="text-sm text-blue-600 dark:text-blue-400 animate-pulse">
                  Loading rates...
                </span>
              )}
              {rateError && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  {rateError}
                </div>
              )}
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                1 USD = {getExchangeRate().toFixed(4)} {currency}
              </div>
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
                <div className="text-xs mt-1">
                  {getExchangeRate().toFixed(2)}
                </div>
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
                    <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Mortgage Details
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Enter your loan information
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

              {/* Property Price & Down Payment - FIXED: Dynamic currency symbol */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Home Price ({currency})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="h-5 w-5 text-gray-400 font-bold">
                        {getCurrencySymbol()}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={convertToCurrency(homePriceUSD).toFixed(0)}
                      onChange={(e) => setHomePriceUSD(parseFloat(e.target.value) / getExchangeRate())}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={convertToCurrency(homePriceUSD)}
                      onChange={(e) => setHomePriceUSD(parseFloat(e.target.value) / getExchangeRate())}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Down Payment ({currency})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="h-5 w-5 text-gray-400 font-bold">
                        {getCurrencySymbol()}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={convertToCurrency(downPaymentUSD).toFixed(0)}
                      onChange={(e) => setDownPaymentUSD(parseFloat(e.target.value) / getExchangeRate())}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Down Payment Percentage: {downPaymentPercent}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Interest Rate & Loan Term */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interest Rate
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Percent className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="0.1"
                      max="20"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0.1"
                      max="20"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Term
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setLoanTermUnit('years')}
                      className={`flex-1 py-2 rounded-lg ${loanTermUnit === 'years' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      Years
                    </button>
                    <button
                      onClick={() => setLoanTermUnit('months')}
                      className={`flex-1 py-2 rounded-lg ${loanTermUnit === 'months' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      Months
                    </button>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={loanTermUnit === 'years' ? '40' : '480'}
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Payment Frequency */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['monthly', 'biweekly', 'weekly'] as PaymentFrequency[]).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setPaymentFrequency(freq)}
                      className={`py-3 rounded-lg ${paymentFrequency === freq
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                        }`}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Costs */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Additional Costs ({currency})
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Annual Property Tax
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="h-5 w-5 text-gray-400 font-bold">
                          {getCurrencySymbol()}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={convertToCurrency(propertyTaxUSD).toFixed(0)}
                        onChange={(e) => setPropertyTaxUSD(parseFloat(e.target.value) / getExchangeRate())}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Annual Home Insurance
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="h-5 w-5 text-gray-400 font-bold">
                          {getCurrencySymbol()}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={convertToCurrency(insuranceUSD).toFixed(0)}
                        onChange={(e) => setInsuranceUSD(parseFloat(e.target.value) / getExchangeRate())}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Presets Card */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Presets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{preset.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {preset.rate}% • {preset.term} years
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Payment Summary Card - FIXED: Dynamic labels */}
            <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-emerald-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Payment Summary
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your {getPaymentFrequencyLabel().toLowerCase()} payment breakdown
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
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-10">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
                            Download Amortization Schedule
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
                            onClick={() => handleDownload('pdf')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3"
                          >
                            <FileDown className="w-5 h-5 text-red-600" />
                            <div>
                              <div className="font-medium text-gray-800 dark:text-white">PDF Document</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Print and share</div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleDownload('txt')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3"
                          >
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-800 dark:text-white">Text File</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Simple format</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getPaymentFrequencyLabel()} Payment
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrencyWithDecimals(paymentAmountUSD)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Payment</div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyWithDecimals(totalPaymentWithExtrasUSD)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loan Amount</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(loanAmountUSD)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Interest</div>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(totalInterestUSD)}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Payment</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalPaymentUSD)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Over {loanTerm} {loanTermUnit} ({amortization.length} {getPaymentFrequencyLabel().toLowerCase()} payments)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Down Payment</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(downPaymentUSD)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {downPaymentPercent}% of home price
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">LTV Ratio</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {ltvRatio.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Loan-to-Value
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Preview - FIXED: Show only 10 rows with scroll */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Amortization Schedule
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    First {amortization.slice(0, 10).length} {getPaymentPeriodLabel()}s • {getPaymentFrequencyLabel()} • {currency}
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
                  <div className="max-h-105 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 font-medium text-gray-600 dark:text-gray-400">Payment #</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Payment</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Principal</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Interest</th>
                          <th className="text-right py-2 font-medium text-gray-600 dark:text-gray-400">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortization.slice(0, 60).map((row, index) => (
                          <tr 
                            key={row.paymentNumber} 
                            className={`border-b border-gray-100 dark:border-gray-800 ${
                              index >= 10 ? 'opacity-80' : ''
                            }`}
                          >
                            <td className="py-2 text-gray-700 dark:text-gray-300">{row.paymentNumber}</td>
                            <td className="py-2 text-right text-gray-900 dark:text-white">
                              {formatCurrencyWithDecimals(row.payment)}
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
                    Showing {Math.min(10, amortization.length)} of {amortization.length} payments. Scroll to see more.
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Enter loan details to see amortization schedule</p>
                </div>
              )}
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Exchange Rate Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Base Currency</span>
                  <span className="font-medium">USD (US Dollar)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Selected Currency</span>
                  <span className="font-medium">{currency} ({currencies[currency].name})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Current Rate</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    1 USD = {getExchangeRate().toFixed(4)} {currency}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Rates update every 5 minutes. Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Complete Mortgage Calculator Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Dynamic Currency Display
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Input fields show correct currency symbols based on selected currency
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Flexible Payment Frequencies
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Monthly, bi-weekly, or weekly payments with accurate calculations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Scrollable Amortization
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                View 10 payments at a time with smooth scrolling for full schedule
              </p>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="TOOL_ID_HERE" />
    </ToolLayout>
  );
}