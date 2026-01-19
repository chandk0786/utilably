"use client";

import RelatedTools from "@/components/RelatedTools";
import { Lock, Copy, RefreshCw, Check, Shield, Zap, Key, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState("");

  const characters = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    similar: "il1Lo0O",
    ambiguous: "{}[]()/\\'\"`~,;:.<>"
  };

  const generatePassword = () => {
    let charPool = "";
    
    if (includeUppercase) charPool += characters.uppercase;
    if (includeLowercase) charPool += characters.lowercase;
    if (includeNumbers) charPool += characters.numbers;
    if (includeSymbols) charPool += characters.symbols;
    
    // Remove similar characters if enabled
    if (excludeSimilar) {
      charPool = charPool.split('').filter(char => 
        !characters.similar.includes(char)
      ).join('');
    }
    
    // Remove ambiguous characters if enabled
    if (excludeAmbiguous) {
      charPool = charPool.split('').filter(char => 
        !characters.ambiguous.includes(char)
      ).join('');
    }
    
    if (charPool.length === 0) {
      setPassword("Select at least one character type");
      return;
    }
    
    let newPassword = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      newPassword += charPool[array[i] % charPool.length];
    }
    
    setPassword(newPassword);
    calculateStrength(newPassword);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    
    // Length score
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (pwd.length >= 20) score++;
    
    // Character variety score
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    // Determine strength level
    if (score >= 7) setStrength("Very Strong");
    else if (score >= 5) setStrength("Strong");
    else if (score >= 3) setStrength("Medium");
    else setStrength("Weak");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickLength = (len: number) => {
    setLength(len);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous]);

  const presetLengths = [8, 12, 16, 20, 24];

  return (
    <ToolLayout
      title="Password Generator - Create Strong Secure Passwords"
      description="Free online password generator. Create strong, secure passwords with customizable options. No data stored, completely private."
      keywords="password generator, strong password, secure password, random password, password creator"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br from-gray-700 to-gray-900 mb-6">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Secure <span className="text-primary">Password Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate strong, random passwords with customizable options. All processing happens in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Password Display & Controls */}
          <div className="lg:col-span-2">
            <div className="border rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Generated Password</h2>
              
              {/* Password Display */}
              <div className="mb-6">
                <div className="relative">
                  <div className="p-4 bg-gray-50 border rounded-lg text-xl font-mono break-all min-h-15 flex items-center">
                    {password || "Generating..."}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Copy password"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Strength Meter */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Password Strength:</span>
                    <span className={`font-bold ${
                      strength === "Very Strong" ? "text-green-600" :
                      strength === "Strong" ? "text-blue-600" :
                      strength === "Medium" ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {strength}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        strength === "Very Strong" ? "bg-green-500 w-full" :
                        strength === "Strong" ? "bg-blue-500 w-3/4" :
                        strength === "Medium" ? "bg-yellow-500 w-1/2" :
                        "bg-red-500 w-1/4"
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={generatePassword}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex-1"
                >
                  <RefreshCw className="h-5 w-5" />
                  Generate New Password
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-accent transition-colors flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copy Password
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Length Settings */}
            <div className="border rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Password Length</h3>
              
              {/* Quick Length Buttons */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {presetLengths.map((len) => (
                    <button
                      key={len}
                      onClick={() => handleQuickLength(len)}
                      className={`px-4 py-2 rounded-lg border font-medium ${
                        length === len 
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      {len} characters
                    </button>
                  ))}
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">Length: {length} characters</label>
                    <span className="text-sm text-muted-foreground">4-64 characters</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>4 (Weak)</span>
                    <span>16 (Recommended)</span>
                    <span>64 (Maximum)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Character Options */}
          <div className="space-y-6">
            {/* Character Types */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Character Types</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <span className="font-bold">A</span>
                    </div>
                    <div>
                      <div className="font-medium">Uppercase Letters</div>
                      <div className="text-sm text-muted-foreground">A-Z</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="h-5 w-5 rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                      <span className="font-bold">a</span>
                    </div>
                    <div>
                      <div className="font-medium">Lowercase Letters</div>
                      <div className="text-sm text-muted-foreground">a-z</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="h-5 w-5 rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <span className="font-bold">123</span>
                    </div>
                    <div>
                      <div className="font-medium">Numbers</div>
                      <div className="text-sm text-muted-foreground">0-9</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="h-5 w-5 rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                      <span className="font-bold">@#$</span>
                    </div>
                    <div>
                      <div className="font-medium">Symbols</div>
                      <div className="text-sm text-muted-foreground">!@#$%^&*</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="h-5 w-5 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Exclude Similar Characters</div>
                      <div className="text-sm text-muted-foreground">Avoid i, l, 1, L, o, 0, O</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="h-5 w-5 rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Exclude Ambiguous Characters</div>
                      <div className="text-sm text-muted-foreground">Avoid {}[]()/\'"`~</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                    className="h-5 w-5 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Security Info */}
            <div className="border rounded-xl p-6 bg-linear-to-br from-gray-50 to-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Features
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Browser-Based</strong> - No data sent to servers</li>
                <li>• <strong>Cryptographically Secure</strong> - Uses window.crypto</li>
                <li>• <strong>No Storage</strong> - Passwords never saved</li>
                <li>• <strong>Real-time Strength Check</strong> - Instant feedback</li>
                <li>• <strong>Customizable</strong> - Full control over characters</li>
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Password Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use at least 12 characters for strong security</li>
                <li>• Include multiple character types</li>
                <li>• Avoid dictionary words</li>
                <li>• Use a password manager</li>
                <li>• Enable two-factor authentication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Why Use Our Password Generator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Secure</h3>
              <p className="text-muted-foreground">
                All password generation happens in your browser. No data is sent to our servers or stored anywhere.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-600 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cryptographic Randomness</h3>
              <p className="text-muted-foreground">
                Uses cryptographically secure random number generation for truly unpredictable passwords.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-600 mb-4">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customizable Options</h3>
              <p className="text-muted-foreground">
                Full control over length, character types, and exclusion options for your specific needs.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-linear-to-r from-primary/10 to-primary/5 border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Browser-Based</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <div className="text-muted-foreground">Data Stored</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4-64</div>
                <div className="text-muted-foreground">Character Length</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Unlimited</div>
                <div className="text-muted-foreground">Generations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="password-generator" />
    </ToolLayout>
  );
}