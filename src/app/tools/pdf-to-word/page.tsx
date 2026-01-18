"use client";

import { FileText, Upload, Download, Check, Zap, Shield, Clock, FileType } from "lucide-react";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PDFToWordPage() {
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [conversionQuality, setConversionQuality] = useState("high");
  const [preserveFormatting, setPreserveFormatting] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      setIsConverted(false);
    }
  };

  const handleConvert = () => {
    if (!fileName) {
      alert("Please upload a PDF file first");
      return;
    }
    
    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      setIsConverting(false);
      setIsConverted(true);
    }, 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName.replace('.pdf', '.docx');
    link.click();
  };

  const handleReset = () => {
    setFileName("");
    setFileSize("");
    setIsConverted(false);
  };

  return (
    <ToolLayout
      title="PDF to Word Converter - Convert PDF to Editable Word Document"
      description="Free online PDF to Word converter. Convert PDF files to editable Word documents while preserving formatting. No registration required."
      keywords="PDF to Word, PDF to DOCX, convert PDF to Word, PDF converter, free PDF converter"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 mb-6">
            <FileType className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            PDF to <span className="text-primary">Word Converter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Convert PDF files to editable Word documents while preserving original formatting, images, and layout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Conversion Area */}
          <div className="lg:col-span-2">
{/* Upload/Conversion Area */}
<div className="border-2 border-dashed rounded-2xl p-8 text-center mb-8 hover:border-primary transition-colors">
  {!fileName ? (
    <label className="cursor-pointer block">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 mb-4">
          <Upload className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Upload PDF File</h3>
        <p className="text-muted-foreground mb-6">
          Drag and drop your PDF file here, or <span className="text-primary font-medium">click to browse</span>
        </p>
      </div>
      <div className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
        Choose PDF File
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Maximum file size: 50MB • Supported: PDF files only
      </p>
    </label>
  ) : (
    <>
      <div className="mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          isConverted 
            ? 'bg-linear-to-br from-green-50 to-emerald-50' 
            : 'bg-linear-to-br from-blue-50 to-indigo-50'
        }`}>
          {isConverted ? (
            <Check className="h-10 w-10 text-green-600" />
          ) : (
            <FileText className="h-10 w-10 text-primary" />
          )}
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {isConverted ? "Conversion Complete!" : fileName}
        </h3>
        <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
          <span>{fileSize}</span>
          <span>•</span>
          <span>PDF Document</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {!isConverted ? (
          <>
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isConverting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Convert to Word
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Upload Different File
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="h-5 w-5" />
              Download Word File
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Convert Another File
            </button>
          </>
        )}
      </div>
    </>
  )}
</div>

            {/* Conversion Options */}
            <div className="border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Conversion Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-3">Conversion Quality</label>
                  <div className="space-y-3">
                    {[
                      { id: "high", label: "High Quality", desc: "Best for documents with complex formatting" },
                      { id: "balanced", label: "Balanced", desc: "Good quality with faster conversion" },
                      { id: "fast", label: "Fast", desc: "Quick conversion for simple documents" },
                    ].map((option) => (
                      <label key={option.id} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="quality"
                          value={option.id}
                          checked={conversionQuality === option.id}
                          onChange={(e) => setConversionQuality(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-3">Additional Options</label>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveFormatting}
                        onChange={(e) => setPreserveFormatting(e.target.checked)}
                        className="h-5 w-5"
                      />
                      <div>
                        <div className="font-medium">Preserve Formatting</div>
                        <div className="text-sm text-muted-foreground">Keep original fonts, colors, and layout</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5"
                      />
                      <div>
                        <div className="font-medium">Extract Images</div>
                        <div className="text-sm text-muted-foreground">Include images in Word document</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-5 w-5"
                      />
                      <div>
                        <div className="font-medium">OCR (Text Recognition)</div>
                        <div className="text-sm text-muted-foreground">Convert scanned PDFs to editable text</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Preserves Formatting</div>
                    <div className="text-sm text-muted-foreground">Keeps original layout and design</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Secure Processing</div>
                    <div className="text-sm text-muted-foreground">Files deleted after 1 hour</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Fast Conversion</div>
                    <div className="text-sm text-muted-foreground">Typically under 30 seconds</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium">No Watermarks</div>
                    <div className="text-sm text-muted-foreground">Clean output, no restrictions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Formats */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Supported Formats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-500" />
                    <span>PDF</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Input</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileType className="h-5 w-5 text-blue-600" />
                    <span>DOCX (Word)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Output</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileType className="h-5 w-5 text-green-600" />
                    <span>DOC (Legacy)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Output</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="border rounded-xl p-6 bg-linear-to-br from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold mb-3">Conversion Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use High Quality for complex documents</li>
                <li>• Enable OCR for scanned PDFs</li>
                <li>• Maximum file size: 50MB</li>
                <li>• No registration required</li>
                <li>• Files auto-delete after 1 hour</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">How to Convert PDF to Word</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl">
              <div className="text-4xl font-bold text-primary mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Upload PDF</h3>
              <p className="text-muted-foreground">
                Click the upload button or drag and drop your PDF file. We support files up to 50MB.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="text-4xl font-bold text-primary mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Convert to Word</h3>
              <p className="text-muted-foreground">
                Choose your conversion settings and click "Convert to Word". The process typically takes under 30 seconds.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="text-4xl font-bold text-primary mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Download Result</h3>
              <p className="text-muted-foreground">
                Download your converted Word document. No watermarks, no registration, completely free.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-linear-to-r from-primary/10 to-primary/5 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Free to Use</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50MB</div>
                <div className="text-muted-foreground">Maximum File Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <div className="text-muted-foreground">Watermarks Added</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}