"use client";
import RelatedTools from "@/components/RelatedTools";
import { useState, useRef, useEffect } from "react";
import {
  PDFDocument,
  rgb,
  StandardFonts,
  degrees,
} from "pdf-lib";
import ToolLayout from "@/components/ToolLayout";
import {
  FileText,
  Download,
  Upload,
  RotateCw,
  Type,
  ZoomIn,
  ZoomOut,
  Loader2,
  X,
  Check,
  Shield,
  Lock,
  ChevronLeft,
  ChevronRight,
  FilePlus,
} from "lucide-react";

/* ---------- Types ---------- */
interface PDFPage {
  id: number;
  selected: boolean;
}

interface Annotation {
  id: string;
  type: "text";
  content: string;
  fontSize: number;
}

/* ---------- Component ---------- */
export default function PDFEditorPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfPages, setPdfPages] = useState<PDFPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [editedPdfBlob, setEditedPdfBlob] = useState<Blob | null>(null);

  const [textContent, setTextContent] = useState("");
  const [fontSize, setFontSize] = useState(14);

  const [scale, setScale] = useState(1.2);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Helpers ---------- */
  const bytesToBlob = (bytes: Uint8Array) =>
    new Blob([bytes.buffer.slice(0) as ArrayBuffer], {
      type: "application/pdf",
    });

  /* ---------- Load PDF ---------- */
  const handleFileSelect = async (files: FileList | null) => {
    if (!files?.length) return;

    const file = files[0];
    if (!file.type.includes("pdf")) {
      setError("Please upload a valid PDF");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);

      setPdfDoc(doc);
      setPdfFile(file);

      const pages = Array.from(
        { length: doc.getPageCount() },
        (_, i) => ({ id: i + 1, selected: i === 0 })
      );
      setPdfPages(pages);

      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
      setEditedPdfBlob(blob);
    } catch {
      setError("Failed to load PDF");
    }
  };

  /* ---------- Add Text ---------- */
  const addTextToPDF = async () => {
    if (!pdfDoc || !textContent.trim()) return;

    try {
      setIsEditing(true);

      const bytes = await pdfDoc.save();
      const doc = await PDFDocument.load(bytes);
      const page = doc.getPages()[currentPageIndex];
      const font = await doc.embedFont(StandardFonts.Helvetica);

      page.drawText(textContent, {
        x: 50,
        y: page.getHeight() - 100,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      const outBytes = await doc.save();
      const blob = bytesToBlob(outBytes);
      setEditedPdfBlob(blob);
      setPdfPreviewUrl(URL.createObjectURL(blob));

      setTextContent("");
      setSuccess("Text added successfully");
    } catch {
      setError("Failed to add text");
    } finally {
      setIsEditing(false);
    }
  };

  /* ---------- Rotate Page ---------- */
  const handleRotatePage = async (rotationDelta: number) => {
    if (!pdfDoc) return;

    try {
      setIsEditing(true);

      const bytes = await pdfDoc.save();
      const doc = await PDFDocument.load(bytes);
      const page = doc.getPages()[currentPageIndex];

      const current = page.getRotation().angle;
      const newAngle = (current + rotationDelta) % 360;

      page.setRotation(degrees(newAngle));

      const outBytes = await doc.save();
      const blob = bytesToBlob(outBytes);

      setEditedPdfBlob(blob);
      setPdfPreviewUrl(URL.createObjectURL(blob));
      setSuccess("Page rotated");
    } catch {
      setError("Rotation failed");
    } finally {
      setIsEditing(false);
    }
  };

  /* ---------- Zoom ---------- */
  const zoomIn = () => setScale((s) => Math.min(3, s + 0.2));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.2));

  /* ---------- Render ---------- */
  return (
    <ToolLayout
      title="PDF Editor - Edit PDFs Online"
      description="Edit PDFs directly in your browser"
      keywords="pdf editor, edit pdf online"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        {!pdfFile ? (
          <div className="border-dashed border-2 p-10 text-center rounded-xl">
            <Upload className="mx-auto mb-4" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg"
            >
              Upload PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <button onClick={() => handleRotatePage(90)}>
                <RotateCw />
              </button>
              <button onClick={zoomIn}>
                <ZoomIn />
              </button>
              <button onClick={zoomOut}>
                <ZoomOut />
              </button>
              <button onClick={addTextToPDF}>
                <Type /> Add Text
              </button>
              <button
                onClick={() => {
                  if (!editedPdfBlob) return;
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(editedPdfBlob);
                  a.download = "edited.pdf";
                  a.click();
                }}
              >
                <Download />
              </button>
            </div>

            <iframe
              src={pdfPreviewUrl ?? ""}
              className="w-full h-[80vh] border"
              style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
            />
          </>
        )}
      </div>
      <RelatedTools currentToolId="pdf-editor" />
    </ToolLayout>
  );
}
