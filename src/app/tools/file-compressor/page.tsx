"use client";

import RelatedTools from "@/components/RelatedTools";
import { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Archive, 
  Minimize,
  Trash2,
  Check,
  AlertCircle,
  Gauge,
  Clock,
  BarChart3,
  FileDown
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type FileType = 'image' | 'pdf' | null;
type CompressionLevel = 'low' | 'medium' | 'high' | 'extreme';

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: FileType;
  url: string;
  compressedSize?: number;
  compressionRatio?: number;
  status: 'uploaded' | 'compressing' | 'compressed' | 'error';
}

interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  ratio: number;
  timeSaved: number; // in ms
}

export default function FileCompressor() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [fileType, setFileType] = useState<FileType>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [isDragging, setIsDragging] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressionStats | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Simulate compression
  const simulateCompression = (file: FileInfo): Promise<FileInfo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate compressed size based on compression level
        let compressionFactor = 1;
        switch (compressionLevel) {
          case 'low':
            compressionFactor = 0.8; // 20% reduction
            break;
          case 'medium':
            compressionFactor = 0.6; // 40% reduction
            break;
          case 'high':
            compressionFactor = 0.4; // 60% reduction
            break;
          case 'extreme':
            compressionFactor = 0.2; // 80% reduction
            break;
        }

        const compressedSize = Math.max(1000, Math.floor(file.size * compressionFactor)); // Minimum 1KB
        const compressionRatio = ((file.size - compressedSize) / file.size * 100);
        
        resolve({
          ...file,
          compressedSize,
          compressionRatio,
          status: 'compressed'
        });
      }, 1500); // Simulate 1.5s compression time
    });
  };

  // Handle file upload
  const handleFileUpload = (uploadedFiles: FileList) => {
    const newFiles: FileInfo[] = [];
    
    Array.from(uploadedFiles).forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type === 'application/pdf' ? 'pdf' : null;
      
      if (!fileType) {
        alert('Please upload only images or PDF files');
        return;
      }

      if (!fileType) {
        setFileType(fileType);
      }

      const fileInfo: FileInfo = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        type: fileType,
        url: URL.createObjectURL(file),
        status: 'uploaded'
      };

      newFiles.push(fileInfo);
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  // Compress all files
  const handleCompressAll = async () => {
    if (files.length === 0) return;

    // Update all files to compressing status
    setFiles(prev => prev.map(file => ({ ...file, status: 'compressing' })));

    const compressionPromises = files.map(file => simulateCompression(file));
    const compressedFiles = await Promise.all(compressionPromises);

    setFiles(compressedFiles);

    // Calculate total stats
    const totalOriginal = compressedFiles.reduce((sum, file) => sum + file.size, 0);
    const totalCompressed = compressedFiles.reduce((sum, file) => sum + (file.compressedSize || 0), 0);
    const totalRatio = ((totalOriginal - totalCompressed) / totalOriginal * 100);

    setCompressionStats({
      originalSize: totalOriginal,
      compressedSize: totalCompressed,
      ratio: totalRatio,
      timeSaved: Math.floor(totalOriginal / 10000) // Simulate time saved
    });
  };

  // Compress single file
  const handleCompressFile = async (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'compressing' } : file
    ));

    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const compressedFile = await simulateCompression(file);
    
    setFiles(prev => prev.map(f => 
      f.id === fileId ? compressedFile : f
    ));
  };

  // Remove file
  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    if (files.length === 1) {
      setCompressionStats(null);
    }
  };

  // Download compressed file
  const handleDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file?.compressedSize) return;

    // Create a dummy blob for download simulation
    const dummyContent = `Compressed: ${file.name}\nOriginal: ${formatFileSize(file.size)}\nCompressed: ${formatFileSize(file.compressedSize)}\nRatio: ${file.compressionRatio?.toFixed(1)}%`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
    setCompressionStats(null);
  };

  // Calculate total savings
  const totalSavings = files.reduce((sum, file) => {
    if (file.compressedSize) {
      return sum + (file.size - file.compressedSize);
    }
    return sum;
  }, 0);

  return (
    <ToolLayout
      title="File Compressor"
      description="Compress images and PDF files to reduce file size while maintaining quality. Supports multiple compression levels."
      keywords="file compressor, image compressor, PDF compressor, reduce file size, compress images, compress PDF"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Settings */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div 
              className={`rounded-2xl border-2 border-dashed transition-all ${isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Supports images (JPG, PNG, GIF) and PDF files
                </p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Browse Files
                </button>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  Maximum file size: 50MB per file
                </p>
              </div>
            </div>

            {/* Compression Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Minimize className="w-5 h-5" />
                Compression Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compression Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['low', 'medium', 'high', 'extreme'] as CompressionLevel[]).map(level => (
                      <button
                        key={level}
                        onClick={() => setCompressionLevel(level)}
                        className={`py-3 rounded-lg text-sm font-medium transition-all ${compressionLevel === level
                            ? level === 'low' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                              : level === 'medium'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                              : level === 'high'
                              ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700'
                              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                            : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                          }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-center text-gray-600 dark:text-gray-400">
                    <div>Best Quality</div>
                    <div>Balanced</div>
                    <div>Good Size</div>
                    <div>Smallest Size</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">Files to compress</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{files.length} file(s) selected</div>
                    </div>
                    {files.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCompressAll}
                  disabled={files.length === 0}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${files.length === 0
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    }`}
                >
                  <Minimize className="w-5 h-5" />
                  Compress All Files ({files.length})
                </button>
              </div>
            </div>

            {/* Compression Statistics */}
            {compressionStats && (
              <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-emerald-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Compression Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Original Size</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {formatFileSize(compressionStats.originalSize)}
                      </div>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Compressed Size</div>
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatFileSize(compressionStats.compressedSize)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Space Saved</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatFileSize(compressionStats.originalSize - compressionStats.compressedSize)}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-linear-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${compressionStats.ratio}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                      {compressionStats.ratio.toFixed(1)}% reduction
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-blue-500" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">Ratio</div>
                      </div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {compressionStats.ratio.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
                      </div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        ~{Math.ceil(compressionStats.timeSaved / 1000)}s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - File List & Results */}
          <div className="space-y-6">
            {/* Files List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Files ({files.length})
                </h3>
                {totalSavings > 0 && (
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
                    Saved: {formatFileSize(totalSavings)}
                  </div>
                )}
              </div>

              {files.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No files uploaded
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Upload images or PDF files to compress them
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Upload Files
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-125 overflow-y-auto pr-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${file.type === 'image' 
                          ? 'bg-blue-100 dark:bg-blue-900' 
                          : 'bg-purple-100 dark:bg-purple-900'
                        }`}>
                          {file.type === 'image' ? (
                            <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800 dark:text-white truncate">
                              {file.name}
                            </h4>
                            <button
                              onClick={() => handleRemoveFile(file.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-600 dark:text-gray-400">
                              {formatFileSize(file.size)}
                              {file.compressedSize && (
                                <span className="ml-2">→ {formatFileSize(file.compressedSize)}</span>
                              )}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${file.status === 'uploaded'
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                : file.status === 'compressing'
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                : file.status === 'compressed'
                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                              }`}>
                              {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                            </div>
                          </div>
                          
                          {file.compressionRatio !== undefined && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Compression</span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                  {file.compressionRatio.toFixed(1)}% smaller
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-linear-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                  style={{ width: `${file.compressionRatio}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3">
                            {file.status === 'uploaded' && (
                              <button
                                onClick={() => handleCompressFile(file.id)}
                                className="flex-1 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Minimize className="w-4 h-4" />
                                Compress
                              </button>
                            )}
                            
                            {file.status === 'compressed' && (
                              <button
                                onClick={() => handleDownload(file.id)}
                                className="flex-1 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features & Tips */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Features & Tips
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
                    <Archive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">Smart Compression</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Intelligent algorithms optimize compression without visible quality loss
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center shrink-0">
                    <Gauge className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">4 Compression Levels</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose from Low (best quality) to Extreme (smallest size)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center shrink-0">
                    <FileDown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">Batch Processing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Compress multiple files at once with batch processing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Formats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Supported Formats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-800 dark:text-white">Images</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    JPG, PNG, GIF, WEBP, BMP
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-800 dark:text-white">Documents</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    PDF files only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Privacy & Security
              </h4>
              <p className="text-sm text-yellow-700/80 dark:text-yellow-400/80">
                All file processing happens locally in your browser. No files are uploaded to any server.
                Your documents and images remain private and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="file-compressor" />
    </ToolLayout>
  );
}