"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FileText, Download, Upload, Edit, Save, 
  Trash2, RotateCw, Scissors, Type, Image as ImageIcon,
  ZoomIn, ZoomOut, Undo, Redo, Printer, Eye,
  Maximize2, Minimize2, X, Check, Loader2,
  FileUp, FileDown, Shield, Lock, Search,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Highlighter, Square, Circle, ArrowLeft,
  ArrowRight, BookOpen, FilePlus, FileMinus,
  ChevronLeft, ChevronRight, Expand, Shrink
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface PDFPage {
  id: number;
  selected: boolean;
}

interface Annotation {
  id: string;
  type: 'text' | 'highlight' | 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color: string;
  fontSize?: number;
}

export default function PDFEditorPage() {
  // State management
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scale, setScale] = useState(1.2); // Increased default scale
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'highlight' | 'rectangle' | 'circle'>('select');
  const [textContent, setTextContent] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [editedPdfBlob, setEditedPdfBlob] = useState<Blob | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const pdfIframeRef = useRef<HTMLIFrameElement>(null);

  // Handle file selection - REAL PDF LOADING
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file');
      return;
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setPdfFile(file);
    setIsLoading(true);
    setUploadProgress(0);
    setAnnotations([]);
    setEditedPdfBlob(null);
    
    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 20;
        });
      }, 100);
      
      // Load PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(pdfDoc);
      
      // Create pages array
      const pageCount = pdfDoc.getPageCount();
      const pages: PDFPage[] = Array.from({ length: pageCount }, (_, i) => ({
        id: i + 1,
        selected: i === 0
      }));
      
      setPdfPages(pages);
      setCurrentPageIndex(0);
      
      // Create preview URL from original PDF
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      setEditedPdfBlob(blob);
      
      setUploadProgress(100);
      setSuccess('PDF loaded successfully! You can now add text.');
      
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(null);
      }, 1500);
      
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF file. Please try another file.');
      setIsLoading(false);
      setPdfFile(null);
    }
  };

  // Handle drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
      }
    };

    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('drop', handleDrop);
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  // Add text to PDF - REAL EDITING FUNCTION
  const addTextToPDF = async () => {
    if (!pdfDoc || !textContent.trim()) {
      setError('No PDF loaded or no text entered');
      return;
    }
    
    setIsEditing(true);
    
    try {
      // Create a copy of the PDF document to modify
      const pdfBytes = await pdfDoc.save();
      const modifiedPdfDoc = await PDFDocument.load(pdfBytes);
      
      // Get the current page
      const pages = modifiedPdfDoc.getPages();
      if (currentPageIndex >= pages.length) {
        setError('Invalid page index');
        return;
      }
      
      const page = pages[currentPageIndex];
      
      // Get font
      const font = await modifiedPdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Add text to the page
      // Position text near the top-center of the page
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const textWidth = font.widthOfTextAtSize(textContent, fontSize);
      
      page.drawText(textContent, {
        x: (pageWidth - textWidth) / 2, // Center horizontally
        y: pageHeight - 100, // 100 points from top
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      // Save the modified PDF
      const modifiedPdfBytes = await modifiedPdfDoc.save();
      const pdfBlobBytes = new Uint8Array(modifiedPdfBytes);
      const blob = new Blob([pdfBlobBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      // Update preview
      setPdfPreviewUrl(url);
      setEditedPdfBlob(blob);
      
      // Add to annotations list
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: 'text',
        x: 100,
        y: 100,
        width: 200,
        height: 30,
        content: textContent,
        color: '#000000',
        fontSize: fontSize
      };
      
      setAnnotations([...annotations, newAnnotation]);
      setTextContent('');
      setSuccess('Text added to PDF successfully!');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Error adding text to PDF:', err);
      setError('Failed to add text to PDF');
    } finally {
      setIsEditing(false);
    }
  };

  // Handle download edited PDF
  const handleDownload = async () => {
    if (!editedPdfBlob || !pdfFile) {
      setError('No edited PDF to download');
      return;
    }
    
    try {
      const url = URL.createObjectURL(editedPdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited_${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('PDF downloaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    }
  };

  // Handle page selection
  const handlePageSelect = (pageId: number) => {
    setPdfPages(pages => 
      pages.map(page => ({
        ...page,
        selected: page.id === pageId
      }))
    );
    setCurrentPageIndex(pageId - 1);
  };

  // Handle clear all
  const handleClearAll = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setPdfPages([]);
    setAnnotations([]);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);
    setPdfPreviewUrl(null);
    setEditedPdfBlob(null);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
  };

  // Handle rotate page
  const handleRotatePage = async (degrees: number) => {
    if (!pdfDoc) return;
    
    try {
      setIsEditing(true);
      
      // Load current PDF bytes
      const pdfBytes = await pdfDoc.save();
      const rotatedPdfDoc = await PDFDocument.load(pdfBytes);
      const pages = rotatedPdfDoc.getPages();
      
      if (currentPageIndex < pages.length) {
        const page = pages[currentPageIndex];
        const currentRotation = page.getRotation();
        page.setRotation(currentRotation.angle + degrees);
      }
      
      // Save rotated PDF
      const rotatedPdfBytes = await rotatedPdfDoc.save();
      const rotatedBlobBytes: Uint8Array = Uint8Array.from(rotatedPdfBytes);
      const arrayBuffer = rotatedPdfBytes.buffer.slice(0) as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });


      const url = URL.createObjectURL(blob);
      
      setPdfPreviewUrl(url);
      setEditedPdfBlob(blob);
      setSuccess(`Page rotated ${degrees} degrees`);
      
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error rotating page:', err);
      setError('Failed to rotate page');
    } finally {
      setIsEditing(false);
    }
  };

  // Generate sample PDFs for demo
  const samplePDFs = [
    { name: 'Sample Invoice.pdf', size: '2.4 MB', pages: 3 },
    { name: 'Sample Contract.pdf', size: '1.8 MB', pages: 5 },
    { name: 'Sample Report.pdf', size: '3.2 MB', pages: 8 },
    { name: 'Blank Document.pdf', size: '0.2 MB', pages: 1 },
  ];

  // Create a blank PDF
  const createBlankPDF = async () => {
    try {
      setIsLoading(true);
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Add a blank page
      const page = pdfDoc.addPage([595, 842]); // A4 size
      
      // Add some default text
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText('New PDF Document', {
        x: 50,
        y: 700,
        size: 24,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      page.drawText('Created with UtilityToolsHub PDF Editor', {
        x: 50,
        y: 650,
        size: 12,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const pdfArrayBuffer = pdfBytes.buffer.slice(0) as ArrayBuffer;
      const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const file = new File([blob], 'blank_document.pdf', { type: 'application/pdf' });
      
      // Set states
      setPdfFile(file);
      setPdfDoc(pdfDoc);
      setPdfPages([{ id: 1, selected: true }]);
      setCurrentPageIndex(0);
      setPdfPreviewUrl(url);
      setEditedPdfBlob(blob);
      setSuccess('Blank PDF created! You can now add text.');
      
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(null);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating blank PDF:', err);
      setError('Failed to create blank PDF');
      setIsLoading(false);
    }
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  // Handle fit to width
  const handleFitWidth = () => {
    setScale(1.2);
  };

  return (
    <ToolLayout
      title="PDF Editor - Edit PDF Files Online"
      description="Free online PDF editor. Edit text, add images, annotate, and modify PDF documents without installation."
      keywords="PDF editor, edit PDF, modify PDF, online PDF editor, free PDF editor"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-red-500 to-pink-500 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Free Online <span className="text-red-600 dark:text-red-400">PDF Editor</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Edit your PDF documents directly in the browser. Add text, annotations, and more.
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <X className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Main Editor Interface */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Pages & Tools */}
          <div className="space-y-6">
            {/* Upload Card */}
            {!pdfFile ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload PDF
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Drag & drop or click to browse
                  </p>
                  
                  <div
                    ref={dropZoneRef}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-red-400 dark:hover:border-red-500 transition-colors"
                  >
                    <FileUp className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Drop PDF file here
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      or click to select
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-6">
                    <button
                      onClick={createBlankPDF}
                      disabled={isLoading}
                      className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FilePlus className="w-4 h-4" />
                      )}
                      Create Blank PDF
                    </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Secure & private - files processed in your browser</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* File Info Card */
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {pdfFile.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB • {pdfPages.length} page{pdfPages.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearAll}
                    disabled={isEditing}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {isLoading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Processing PDF...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={!editedPdfBlob || isEditing}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    {isEditing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download PDF
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>
            )}

            {/* Pages Thumbnails */}
            {pdfPages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Pages ({pdfPages.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRotatePage(90)}
                      disabled={isEditing}
                      className="p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {pdfPages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => handlePageSelect(page.id)}
                      className={`p-3 rounded-lg cursor-pointer border ${
                        page.selected
                          ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Page {page.id}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {page.selected ? 'Selected' : 'Click to select'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample PDFs */}
            {!pdfFile && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Try with sample PDF
                </h4>
                <div className="space-y-2">
                  {samplePDFs.map((pdf, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Create mock file for demo
                        const fakeFile = new File([''], pdf.name, { type: 'application/pdf' });
                        Object.defineProperty(fakeFile, 'size', { 
                          value: parseFloat(pdf.size) * 1024 * 1024 
                        });
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(fakeFile);
                        handleFileSelect(dataTransfer.files);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {pdf.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {pdf.size} • {pdf.pages} page{pdf.pages > 1 ? 's' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Editor Area - BIGGER PDF VIEWER */}
          <div className="lg:col-span-3"> {/* Changed from col-span-2 to col-span-3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
              {/* Editor Toolbar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 min-w-15 text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleFitWidth}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ml-2"
                      title="Fit to Width"
                    >
                      <Expand className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveTool('select')}
                      className={`p-2 rounded-lg ${
                        activeTool === 'select'
                          ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Select tool"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTool('text')}
                      className={`p-2 rounded-lg ${
                        activeTool === 'text'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Add text"
                    >
                      <Type className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRotatePage(90)}
                      disabled={isEditing}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
                      title="Rotate page 90°"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={!editedPdfBlob || isEditing}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-green-600 dark:text-green-400 disabled:opacity-50"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Page Navigation */}
                  {pdfPages.length > 1 && (
                    <>
                      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handlePageSelect(currentPageIndex)}
                          disabled={currentPageIndex === 0 || isEditing}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Page {currentPageIndex + 1} of {pdfPages.length}
                        </span>
                        <button 
                          onClick={() => handlePageSelect(currentPageIndex + 2)}
                          disabled={currentPageIndex === pdfPages.length - 1 || isEditing}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* PDF Viewer Area - BIGGER */}
              <div className="flex-1 p-4 flex flex-col">
                {!pdfFile ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No PDF Loaded
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Upload a PDF file to start editing
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                    >
                      Select PDF File
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    {/* PDF Preview - BIGGER IFRAME */}
                    <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                      {pdfPreviewUrl ? (
                        <iframe
                          ref={pdfIframeRef}
                          src={pdfPreviewUrl}
                          className="w-full h-full min-h-150" /* Increased height */
                          title="PDF Preview"
                          style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8">
                          <Loader2 className="w-8 h-8 mb-4 animate-spin text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-400">Loading PDF preview...</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Editing in Progress */}
                    {isEditing && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                          <span className="text-sm text-blue-700 dark:text-blue-300">
                            Processing PDF edits...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Text Editor Section */}
            {pdfFile && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add Text to PDF
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Text Content
                      </label>
                      <input
                        type="text"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        placeholder="Enter text to add to PDF..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTextToPDF();
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Font Size
                      </label>
                      <select 
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      >
                        <option value="8">8pt - Small</option>
                        <option value="10">10pt</option>
                        <option value="12">12pt - Normal</option>
                        <option value="14">14pt</option>
                        <option value="16">16pt</option>
                        <option value="18">18pt</option>
                        <option value="24">24pt - Large</option>
                        <option value="32">32pt - Extra Large</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={addTextToPDF}
                      disabled={!textContent.trim() || isEditing}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2"
                    >
                      {isEditing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding Text...
                        </>
                      ) : (
                        <>
                          <Type className="w-4 h-4" />
                          Add Text to PDF
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setTextContent('');
                        setFontSize(14);
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Reset
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>✓ Text will be added to the center-top of page {currentPageIndex + 1}</p>
                    <p>✓ You can download the edited PDF after adding text</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Complete PDF Editor Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center mb-4">
                <Type className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Real Text Editing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add text directly to your PDF documents. Text becomes part of the PDF and is preserved in downloads.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Browser-Based Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All PDF editing happens in your browser. No server uploads, complete privacy and security.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Instant Download
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Download your edited PDF immediately. No watermarks, no registration, no limitations.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 border border-blue-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How to Use This PDF Editor
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload PDF</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag & drop or click to upload your PDF file
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Add Text</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter text and click "Add Text to PDF"
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Preview</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See your changes in the large preview window
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Download</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download the edited PDF with your changes
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-6 bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border border-green-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                100% Browser-Based Processing
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your PDF files are never uploaded to any server. All editing happens locally in your browser for maximum privacy and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}