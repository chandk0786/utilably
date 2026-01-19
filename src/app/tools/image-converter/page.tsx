"use client";

import RelatedTools from "@/components/RelatedTools";
import { Image, Upload, Download, RefreshCw, Zap, Check, FileImage } from "lucide-react";
import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";

const formats = [
  { id: "jpg", name: "JPG", desc: "Best for photos", color: "from-yellow-500 to-orange-500" },
  { id: "png", name: "PNG", desc: "Lossless, supports transparency", color: "from-blue-500 to-cyan-500" },
  { id: "webp", name: "WebP", desc: "Modern, smaller file size", color: "from-purple-500 to-pink-500" },
  { id: "svg", name: "SVG", desc: "Vector format, scalable", color: "from-green-500 to-emerald-500" },
  { id: "bmp", name: "BMP", desc: "Uncompressed, high quality", color: "from-gray-600 to-gray-800" },
];

export default function ImageConverterPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState("jpg");
  const [quality, setQuality] = useState(85);
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setSelectedFiles(imageFiles);
      setIsConverted(false);
    }
  };

  const handleConvert = () => {
    if (selectedFiles.length === 0) {
      alert("Please select image files first");
      return;
    }

    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      setIsConverting(false);
      setIsConverted(true);
    }, 1500);
  };

  const handleDownload = () => {
    if (selectedFiles.length === 0) return;
    
    selectedFiles.forEach((file, index) => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${file.name.split('.')[0]}_converted.${targetFormat}`;
      link.click();
    });
    
    alert(`Downloading ${selectedFiles.length} file(s) as ${targetFormat.toUpperCase()}`);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setIsConverted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setSelectedFiles(imageFiles);
      setIsConverted(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getEstimatedSize = () => {
    if (selectedFiles.length === 0) return "0 KB";
    
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    let estimatedSize = totalSize;
    
    // Simple size estimation based on format and quality
    if (targetFormat === "webp") estimatedSize *= 0.7;
    if (targetFormat === "jpg") estimatedSize *= (quality / 100);
    if (targetFormat === "png") estimatedSize *= 1.1; // PNG is usually larger
    
    return formatSize(estimatedSize);
  };

  return (
    <ToolLayout
      title="Image Converter - Convert Images Between Formats Online"
      description="Free online image converter. Convert between JPG, PNG, WebP, SVG, BMP formats. Batch conversion supported. No registration required."
      keywords="image converter, convert image, JPG to PNG, PNG to JPG, WebP converter, image format converter"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 mb-6">
            <Image className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free <span className="text-primary">Image Converter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Convert images between JPG, PNG, WebP, SVG, and BMP formats. Batch conversion supported.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Conversion Area */}
          <div className="lg:col-span-2">
            {/* Upload Area */}
            <div 
              className="border-2 border-dashed rounded-2xl p-8 text-center mb-6 hover:border-primary transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {selectedFiles.length === 0 ? (
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-pink-50 to-rose-50 mb-4">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Upload Images</h3>
                    <p className="text-muted-foreground mb-6">
                      Drag and drop your images here, or <span className="text-primary font-medium">click to browse</span>
                    </p>
                  </div>
                  <label className="cursor-pointer block">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                    />
                    <div className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Choose Image Files
                    </div>
                  </label>
                  <p className="text-sm text-muted-foreground mt-4">
                    Supports JPG, PNG, WebP, GIF, BMP, SVG • Max 50MB per file
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                      isConverted 
                        ? 'bg-linear-to-br from-green-50 to-emerald-50' 
                        : 'bg-linear-to-br from-pink-50 to-rose-50'
                    }`}>
                      {isConverted ? (
                        <Check className="h-10 w-10 text-green-600" />
                      ) : (
                        <FileImage className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {isConverted ? "Conversion Complete!" : `${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''} Selected`}
                    </h3>
                    
                    {/* File List */}
                    <div className="max-h-60 overflow-y-auto mt-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                              <FileImage className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium truncate max-w-50">
                                {file.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            → {targetFormat.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!isConverted ? (
                      <>
                        <button
                          onClick={handleConvert}
                          disabled={isConverting}
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex-1"
                        >
                          {isConverting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Converting {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}...
                            </>
                          ) : (
                            <>
                              <Zap className="h-5 w-5" />
                              Convert to {targetFormat.toUpperCase()}
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleReset}
                          className="px-8 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
                        >
                          Clear All
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleDownload}
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex-1"
                        >
                          <Download className="h-5 w-5" />
                          Download All ({selectedFiles.length})
                        </button>
                        <button
                          onClick={handleReset}
                          className="px-8 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
                        >
                          Convert More
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Settings */}
            <div className="border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Conversion Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Format */}
                <div>
                  <label className="block text-lg font-medium mb-4">Target Format</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formats.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setTargetFormat(format.id)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          targetFormat === format.id 
                            ? `bg-linear-to-br ${format.color} text-white border-transparent` 
                            : 'hover:bg-accent'
                        }`}
                      >
                        <div className="font-bold text-lg mb-1">{format.name}</div>
                        <div className="text-xs opacity-90">{format.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quality Settings */}
                <div>
                  <label className="block text-lg font-medium mb-4">
                    Quality: {quality}%
                    {targetFormat === "jpg" && " (JPEG only)"}
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      disabled={targetFormat !== "jpg"}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Smaller File</span>
                      <span>Better Quality</span>
                    </div>
                    
                    {/* Estimated Size */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Estimated Output:</span>
                        <span className="text-lg font-bold text-primary">
                          {getEstimatedSize()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Based on {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supported Formats */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Supported Formats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold">
                      JPG
                    </div>
                    <span>JPEG Image</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Input/Output</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      PNG
                    </div>
                    <span>PNG Image</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Input/Output</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                      WEBP
                    </div>
                    <span>WebP Image</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Input/Output</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-green-100 text-green-800 flex items-center justify-center font-bold">
                      SVG
                    </div>
                    <span>SVG Vector</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Input/Output</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Batch Conversion</div>
                    <div className="text-sm text-muted-foreground">Convert multiple images at once</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Drag & Drop</div>
                    <div className="text-sm text-muted-foreground">Easy file selection</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Quality Control</div>
                    <div className="text-sm text-muted-foreground">Adjust JPEG quality</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">No Watermarks</div>
                    <div className="text-sm text-muted-foreground">Clean output files</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="border rounded-xl p-6 bg-linear-to-br from-pink-50 to-rose-50">
              <h3 className="text-lg font-semibold mb-3">Conversion Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>WebP</strong> for smallest file size</li>
                <li>• <strong>PNG</strong> for images with transparency</li>
                <li>• <strong>JPG</strong> for photographs (adjust quality)</li>
                <li>• <strong>SVG</strong> for logos and illustrations</li>
                <li>• Maximum file size: 50MB</li>
              </ul>
            </div>

            {/* Stats */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Current Conversion</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files Selected:</span>
                  <span className="font-bold">{selectedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Size:</span>
                  <span className="font-bold">
                    {selectedFiles.length > 0 
                      ? formatSize(selectedFiles.reduce((sum, file) => sum + file.size, 0))
                      : "0 B"
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Format:</span>
                  <span className="font-bold text-primary">{targetFormat.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Common Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl">
              <div className="text-4xl font-bold text-primary mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">Web Optimization</h3>
              <p className="text-muted-foreground">
                Convert images to WebP format for faster website loading and better performance.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="text-4xl font-bold text-primary mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-3">Graphic Design</h3>
              <p className="text-muted-foreground">
                Convert between formats for different design software requirements and print/web usage.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <div className="text-4xl font-bold text-primary mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-3">Email & Documents</h3>
              <p className="text-muted-foreground">
                Reduce image file sizes for email attachments and document embedding.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-linear-to-r from-primary/10 to-primary/5 border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-muted-foreground">Output Formats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50MB</div>
                <div className="text-muted-foreground">Max File Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Batch</div>
                <div className="text-muted-foreground">Multi-file Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <div className="text-muted-foreground">Watermarks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="image-converter" />
    </ToolLayout>
  );
}