"use client";

import RelatedTools from "@/components/RelatedTools";
import { QrCode, Download, Copy, RefreshCw, Link, MessageSquare, Wifi, Phone, Image } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

// Simple QR code generator without external library for now
export default function QRGeneratorPage() {
  const [text, setText] = useState("https://utilitytoolshub.com");
  const [qrSize, setQrSize] = useState(320); // Changed from 256 to 320
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrType, setQrType] = useState("url");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR code using a free API (simpler approach)
  const generateQRCode = () => {
    if (!text.trim()) {
      setQrImageUrl("");
      return;
    }

    setIsGenerating(true);
    
    // Use a free QR code API - fixed size of 320x320
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(text)}&color=${qrColor.slice(1)}&bgcolor=${bgColor.slice(1)}&format=png&qzone=1`;
    
    setQrImageUrl(qrUrl);
    setIsGenerating(false);
  };

  // Generate QR when settings change
  useEffect(() => {
    const timer = setTimeout(() => {
      generateQRCode();
    }, 500); // Debounce to avoid too many API calls
    
    return () => clearTimeout(timer);
  }, [text, qrColor, bgColor]); // Removed qrSize from dependencies since it's fixed

  const handleDownload = () => {
    if (!text.trim()) {
      alert("Please enter some text or URL for the QR code");
      return;
    }

    if (!qrImageUrl) {
      alert("Please wait for QR code to generate");
      return;
    }

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard!");
  };

  const handleReset = () => {
    setText("https://utilitytoolshub.com");
    setQrSize(320); // Changed from 256 to 320
    setQrColor("#000000");
    setBgColor("#ffffff");
    setQrType("url");
    setErrorCorrection("M");
  };

  const presetColors = [
    { name: "Black", value: "#000000" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#10b981" },
    { name: "Purple", value: "#8b5cf6" },
  ];

  const presetTexts = [
    { type: "url", icon: Link, label: "Website URL", value: "https://utilitytoolshub.com" },
    { type: "wifi", icon: Wifi, label: "WiFi Network", value: "WIFI:S:MyNetwork;T:WPA;P:Password123;;" },
    { type: "text", icon: MessageSquare, label: "Plain Text", value: "Hello, scan this QR code!" },
    { type: "phone", icon: Phone, label: "Phone Number", value: "TEL:+1234567890" },
  ];

  return (
    <ToolLayout
      title="QR Code Generator - Create Custom QR Codes Online"
      description="Free online QR code generator. Create custom QR codes for URLs, text, WiFi, contact info, and more. No registration required."
      keywords="QR code generator, create QR code, free QR code, custom QR code, QR code maker"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 mb-6">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free <span className="text-primary">QR Code Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create custom QR codes for websites, text, WiFi networks, contact information, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Code Preview & Controls */}
          <div className="lg:col-span-2">
            <div className="border rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">QR Code Preview</h2>
              
              {/* QR Code Display - FIXED VERSION */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* QR Code Image Container */}
                <div className="shrink-0">
                  <div className="border-4 border-white rounded-lg shadow-lg p-4 bg-white max-w-full overflow-auto">
                    {isGenerating ? (
                      <div className="flex items-center justify-center" style={{ width: 320, height: 320, minWidth: 100, minHeight: 100 }}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : qrImageUrl ? (
                      <div className="overflow-auto max-w-full">
                        <img
                          src={qrImageUrl}
                          alt="Generated QR Code"
                          style={{ width: 320, height: 320, maxWidth: "100%" }}
                          className="rounded max-w-full h-auto"
                          onLoad={() => setIsGenerating(false)}
                        />
                      </div>
                    ) : (
                      <div 
                        className="flex items-center justify-center border-2 border-dashed rounded" 
                        style={{ 
                          width: 320, 
                          height: 320,
                          minWidth: 100,
                          minHeight: 100 
                        }}
                      >
                        <div className="text-center p-4">
                          <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Enter text to generate QR code</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Size display under QR code for mobile */}
                  <div className="md:hidden mt-4 text-center">
                    <div className="font-semibold">Size:</div>
                    <div className="text-2xl font-bold text-primary">320 × 320 px</div>
                  </div>
                </div>
                
                {/* Content Preview & Controls - Stays aligned to top */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="font-semibold mb-1">Content Preview:</div>
                    <div className="p-3 bg-gray-50 rounded-lg border text-sm break-all max-h-40 overflow-y-auto">
                      {text}
                    </div>
                  </div>
                  
                  {/* Size display for desktop - hidden on mobile */}
                  <div className="hidden md:block">
                    <div className="font-semibold mb-1">Size:</div>
                    <div className="text-2xl font-bold text-primary">320 × 320 px</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleDownload}
                      disabled={!qrImageUrl || isGenerating}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex-1 disabled:opacity-50"
                    >
                      <Download className="h-5 w-5" />
                      {isGenerating ? "Generating..." : "Download QR Code"}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-accent transition-colors flex-1 sm:flex-none"
                    >
                      <Copy className="h-5 w-5" />
                      Copy Text
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div className="border rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">QR Code Content</h3>
              
              {/* Quick Presets */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {presetTexts.map((preset) => (
                    <button
                      key={preset.type}
                      onClick={() => {
                        setText(preset.value);
                        setQrType(preset.type);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        qrType === preset.type 
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <preset.icon className="h-4 w-4" />
                      {preset.label}
                    </button>
                  ))}
                </div>
                
                <label className="block text-lg font-medium mb-3">Enter Text or URL</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-30"
                  placeholder="Enter text, URL, or any content for QR code..."
                  rows={3}
                  maxLength={1000}
                />
                <div className="text-sm text-muted-foreground mt-2">
                  Characters: {text.length} / 1000
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Size Settings - REMOVED SLIDER SECTION */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Size & Quality</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">QR Code Size</span>
                    <span className="text-lg font-bold text-primary">320 × 320 px</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Fixed size for optimal scanning</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Error Correction</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["L", "M", "Q", "H"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setErrorCorrection(level)}
                        className={`py-2 rounded-lg border text-center ${
                          errorCorrection === level 
                            ? 'bg-primary text-white border-primary' 
                            : 'hover:bg-accent'
                        }`}
                      >
                        {level} {level === "L" ? "(Low)" : level === "M" ? "(Medium)" : level === "Q" ? "(Quality)" : "(High)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Settings */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Colors</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">QR Code Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-12 cursor-pointer rounded border"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        {presetColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setQrColor(color.value)}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 cursor-pointer rounded border"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBgColor("#ffffff")}
                        className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent"
                      >
                        White
                      </button>
                      <button
                        onClick={() => setBgColor("#f3f4f6")}
                        className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent"
                      >
                        Light Gray
                      </button>
                      <button
                        onClick={() => setBgColor("#000000")}
                        className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent text-white"
                        style={{ backgroundColor: "#000000" }}
                      >
                        Black
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  disabled={!qrImageUrl || isGenerating}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Download className="h-5 w-5" />
                  Download PNG
                </button>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Features Info - Updated to remove size reference */}
            <div className="border rounded-xl p-6 bg-linear-to-br from-indigo-50 to-purple-50">
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Free API</strong> - QRServer.com</li>
                <li>• <strong>Optimal Size</strong> - 320×320px for best scanning</li>
                <li>• <strong>Custom Colors</strong> - Full color control</li>
                <li>• <strong>Instant Generation</strong> - Real-time preview</li>
                <li>• <strong>No Watermarks</strong> - Clean output</li>
                <li>• <strong>No Registration</strong> - Use immediately</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">What Can You Create?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
                <Link className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Website URLs</h3>
              <p className="text-muted-foreground">
                Create QR codes that link to your website, landing pages, or specific content.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-600 mb-4">
                <Wifi className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">WiFi Networks</h3>
              <p className="text-muted-foreground">
                Generate QR codes that automatically connect devices to WiFi networks.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-600 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contact Info</h3>
              <p className="text-muted-foreground">
                Create vCard QR codes with contact information for easy sharing.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Plain Text</h3>
              <p className="text-muted-foreground">
                Generate QR codes for any text content, messages, or information.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-linear-to-r from-primary/10 to-primary/5 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">320×320</div>
                <div className="text-muted-foreground">Optimal QR Code Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Instant</div>
                <div className="text-muted-foreground">Real-time Generation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="TOOL_ID_HERE" />
    </ToolLayout>
  );
}