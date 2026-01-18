"use client";

import { Calculator, DollarSign, Percent, Calendar, TrendingUp, Globe, Download, Eye, Copy, Share2, Car, Home, GraduationCap, Briefcase } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const currencies = [
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
];

// Loan type configurations
const loanTypes = [
  { 
    id: "personal", 
    name: "Personal Loan", 
    icon: "👤", 
    iconComponent: <span className="text-xl">👤</span>,
    presets: { amount: 50000, rate: 12, term: 12, type: "months" }
  },
  { 
    id: "mortgage", 
    name: "Mortgage Loan", 
    icon: "🏠", 
    iconComponent: <Home className="h-5 w-5" />,
    presets: { amount: 300000, rate: 7.5, term: 30, type: "years" }
  },
  { 
    id: "auto", 
    name: "Auto Loan", 
    icon: "🚗", 
    iconComponent: <Car className="h-5 w-5" />,
    presets: { amount: 25000, rate: 6.5, term: 5, type: "years" }
  },
  { 
    id: "student", 
    name: "Student Loan", 
    icon: "🎓", 
    iconComponent: <GraduationCap className="h-5 w-5" />,
    presets: { amount: 40000, rate: 5.5, term: 10, type: "years" }
  },
  { 
    id: "business", 
    name: "Business Loan", 
    icon: "💼", 
    iconComponent: <Briefcase className="h-5 w-5" />,
    presets: { amount: 100000, rate: 9, term: 5, type: "years" }
  }
];

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(12);
  const [loanType, setLoanType] = useState("months");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState(loanTypes[0]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [amortizationData, setAmortizationData] = useState<any[]>([]);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = loanType === "months" ? loanTerm : loanTerm * 12;
    
    if (monthlyRate === 0) {
      return principal / totalMonths;
    }
    
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    return payment;
  };

  const calculateTotalPayment = () => {
    const monthly = calculateMonthlyPayment();
    const totalMonths = loanType === "months" ? loanTerm : loanTerm * 12;
    return monthly * totalMonths;
  };

  const calculateTotalInterest = () => {
    return calculateTotalPayment() - loanAmount;
  };

  // Generate amortization schedule
  const generateAmortizationSchedule = () => {
    const principal = loanAmount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = loanType === "months" ? loanTerm : loanTerm * 12;
    const monthlyPayment = calculateMonthlyPayment();
    
    let balance = principal;
    const schedule = [];
    
    for (let month = 1; month <= totalMonths; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      balance -= principalPaid;
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance)
      });
      
      if (balance <= 0) break;
    }
    
    return schedule;
  };

  // Update amortization data when inputs change
  useEffect(() => {
    const schedule = generateAmortizationSchedule();
    setAmortizationData(schedule);
  }, [loanAmount, interestRate, loanTerm, loanType]);

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = calculateTotalPayment();
  const totalInterest = calculateTotalInterest();

  const formatCurrency = (amount: number) => {
    return `${selectedCurrency.symbol}${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // FIX 1: View Full Schedule Functionality
  const handleViewFullSchedule = () => {
    setShowFullSchedule(true);
  };

  // FIX 2: Loan Type Selection
  const handleLoanTypeSelect = (type: any) => {
    setSelectedLoanType(type);
    setLoanAmount(type.presets.amount);
    setInterestRate(type.presets.rate);
    setLoanTerm(type.presets.term);
    setLoanType(type.presets.type);
  };

  // FIX 3: Save & Share Calculation
  const handleSaveCalculation = async () => {
    // Generate shareable URL
    const params = new URLSearchParams({
      amount: loanAmount.toString(),
      rate: interestRate.toString(),
      term: loanTerm.toString(),
      type: loanType,
      currency: selectedCurrency.code,
      loanTypeId: selectedLoanType.id
    });
    
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    setShareUrl(url);
    setShowShareModal(true);
    
    // Save to localStorage
    const savedCalculations = JSON.parse(localStorage.getItem('loanCalculations') || '[]');
    const newCalculation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      amount: loanAmount,
      rate: interestRate,
      term: loanTerm,
      loanType: selectedLoanType.name,
      currency: selectedCurrency.code,
      monthlyPayment,
      totalPayment,
      totalInterest
    };
    
    const updatedCalculations = [newCalculation, ...savedCalculations.slice(0, 9)];
    localStorage.setItem('loanCalculations', JSON.stringify(updatedCalculations));
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (resultsRef.current) {
      try {
        const canvas = await html2canvas(resultsRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`loan-calculation-${Date.now()}.pdf`);
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  // Load from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const amount = params.get('amount');
      const rate = params.get('rate');
      const term = params.get('term');
      const type = params.get('type');
      const currency = params.get('currency');
      const loanTypeId = params.get('loanTypeId');
      
      if (amount) setLoanAmount(Number(amount));
      if (rate) setInterestRate(Number(rate));
      if (term) setLoanTerm(Number(term));
      if (type) setLoanType(type);
      if (currency) {
        const foundCurrency = currencies.find(c => c.code === currency);
        if (foundCurrency) setSelectedCurrency(foundCurrency);
      }
      if (loanTypeId) {
        const foundLoanType = loanTypes.find(t => t.id === loanTypeId);
        if (foundLoanType) setSelectedLoanType(foundLoanType);
      }
    }
  }, []);

  return (
    <ToolLayout
      title="Loan Calculator - Calculate Loan Payments & Interest"
      description="Free online loan calculator. Calculate monthly payments, total interest, and amortization schedule for any loan."
      keywords="loan calculator, mortgage calculator, EMI calculator, interest calculator, loan payment"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 mb-6">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free Online <span className="text-primary">Loan Calculator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Calculate loan payments, total interest, and amortization schedule instantly.
          </p>
        </div>

        {/* Currency Selector */}
        <div className="mb-8 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{selectedCurrency.symbol} {selectedCurrency.code}</span>
            </button>
            
            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-accent transition-colors ${
                      selectedCurrency.code === currency.code ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{currency.symbol} {currency.code}</span>
                      <span className="text-sm text-muted-foreground">{currency.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-2xl p-6" ref={resultsRef}>
              <h2 className="text-2xl font-bold mb-6">Loan Details</h2>
              
              {/* Loan Amount */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-lg font-medium mb-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Loan Amount
                </label>
                
                {/* Range Slider for quick selection */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="1000"
                    max="100000000"
                    step="1000"
                    value={Math.min(loanAmount, 100000000)}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{selectedCurrency.symbol}1,000</span>
                    <span>{selectedCurrency.symbol}10 Cr</span>
                  </div>
                </div>
                
                {/* Direct Input for exact amount */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="999999999"
                    value={loanAmount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= 1000000000) {
                        setLoanAmount(value);
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 text-2xl font-bold border rounded-lg text-right"
                    placeholder="Enter loan amount"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold">
                    {selectedCurrency.symbol}
                  </span>
                </div>
                
                {/* Quick amount buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[10000, 50000, 100000, 500000, 1000000, 5000000, 10000000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setLoanAmount(amount)}
                      className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                        loanAmount === amount 
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      {selectedCurrency.symbol}{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-lg font-medium mb-3">
                  <Percent className="h-5 w-5 text-primary" />
                  Annual Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full pl-4 pr-12 py-3 text-2xl font-bold border rounded-lg text-right"
                      step="0.1"
                      min="0.1"
                      max="50"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="flex items-center gap-2 text-lg font-medium mb-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  Loan Term
                </label>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setLoanType("months")}
                    className={`flex-1 py-3 rounded-lg border font-medium ${
                      loanType === "months" 
                        ? "bg-primary text-white border-primary" 
                        : "hover:bg-accent"
                    }`}
                  >
                    Months
                  </button>
                  <button
                    onClick={() => setLoanType("years")}
                    className={`flex-1 py-3 rounded-lg border font-medium ${
                      loanType === "years" 
                        ? "bg-primary text-white border-primary" 
                        : "hover:bg-accent"
                    }`}
                  >
                    Years
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max={loanType === "months" ? "360" : "30"}
                    step="1"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>1 {loanType === "months" ? "month" : "year"}</span>
                    <span>{loanType === "months" ? "30 years" : "30 years"}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full pl-4 pr-24 py-3 text-2xl font-bold border rounded-lg text-right"
                      min="1"
                      max={loanType === "months" ? "360" : "30"}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold">
                      {loanType === "months" ? "months" : "years"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 border rounded-xl text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {formatCurrency(monthlyPayment)}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Payment</div>
              </div>
              <div className="p-6 border rounded-xl text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {formatCurrency(totalPayment)}
                </div>
                <div className="text-sm text-muted-foreground">Total Payment</div>
              </div>
              <div className="p-6 border rounded-xl text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {formatCurrency(totalInterest)}
                </div>
                <div className="text-sm text-muted-foreground">Total Interest</div>
              </div>
            </div>
          </div>

          {/* Sidebar - Amortization Preview */}
          <div className="space-y-6">
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Amortization Schedule
              </h3>
              <div className="space-y-3">
                {amortizationData.slice(0, 5).map((item) => (
                  <div key={item.month} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Month {item.month}</div>
                      <div className="text-sm text-muted-foreground">
                        Principal: {formatCurrency(item.principal)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(item.payment)}</div>
                      <div className="text-sm text-green-600">On schedule</div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleViewFullSchedule}
                className="w-full mt-4 py-3 border rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Full Schedule
              </button>
            </div>

            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Loan Types</h3>
              <div className="space-y-3">
                {loanTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleLoanTypeSelect(type)}
                    className={`w-full text-left p-3 border rounded-lg transition-colors flex items-center gap-3 ${
                      selectedLoanType.id === type.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {type.iconComponent}
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border rounded-xl p-6 bg-linear-to-br from-blue-50 to-cyan-50">
              <h3 className="text-lg font-semibold mb-3">Save Calculation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save this calculation for future reference or share it with others.
              </p>
              <div className="space-y-2">
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Save as PDF
                </button>
                <button 
                  onClick={handleSaveCalculation}
                  className="w-full py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">About Loan Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">How It Works</h3>
              <p className="text-muted-foreground">
                Our loan calculator uses the standard amortization formula to calculate your monthly payments, 
                total interest, and payment schedule. Simply enter the loan amount, interest rate, and term to 
                get instant results.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Common Uses</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Calculate mortgage payments for home loans</li>
                <li>• Determine auto loan monthly payments</li>
                <li>• Plan personal loan repayment schedules</li>
                <li>• Compare different loan offers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Full Schedule Modal */}
      {showFullSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Full Amortization Schedule</h3>
                <button
                  onClick={() => setShowFullSchedule(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Month</th>
                      <th className="px-4 py-3 text-left font-semibold">Payment</th>
                      <th className="px-4 py-3 text-left font-semibold">Principal</th>
                      <th className="px-4 py-3 text-left font-semibold">Interest</th>
                      <th className="px-4 py-3 text-left font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationData.map((row) => (
                      <tr key={row.month} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{row.month}</td>
                        <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                        <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                        <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                        <td className="px-4 py-3">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    const csv = [
                      'Month,Payment,Principal,Interest,Balance',
                      ...amortizationData.map(row => 
                        `${row.month},${row.payment},${row.principal},${row.interest},${row.balance}`
                      )
                    ].join('\n');
                    
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `loan-schedule-${Date.now()}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => setShowFullSchedule(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Share Calculation</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shareable Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopyShareLink}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Share via:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=Check out my loan calculation: ${encodeURIComponent(shareUrl)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 text-sm"
                >
                  Twitter
                </button>
                <button
                  onClick={() => {
                    window.open(`mailto:?subject=Loan Calculation&body=Check out this loan calculation: ${encodeURIComponent(shareUrl)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90 text-sm"
                >
                  Email
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>This link will save your current calculation settings.</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}