"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { mediaService } from "@/services/media.service";
import { Upload, FileText, Loader2, X } from "lucide-react";

interface PdfItineraryUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  error?: boolean;
}

export function PdfItineraryUpload({
  value,
  onChange,
  placeholder = "Upload PDF or enter URL",
  error,
}: PdfItineraryUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">(value?.startsWith("http") ? "url" : "upload");
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      return;
    }
    setIsUploading(true);
    try {
      const response = await mediaService.upload({
        file,
        folder: "itineraries",
      });
      onChange(mediaService.getFullUrl(response.url));
    } catch (err) {
      console.error("PDF upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      handleFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "application/pdf") {
      handleFileUpload(file);
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md border transition-colors",
            mode === "upload"
              ? "bg-primary-500 text-white border-primary-500"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
          )}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md border transition-colors",
            mode === "url"
              ? "bg-primary-500 text-white border-primary-500"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
          )}
        >
          Enter URL
        </button>
      </div>

      {mode === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragOver ? "border-primary-500 bg-primary-50" : "border-gray-300",
            error && "border-red-500"
          )}
        >
          {value ? (
            <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 text-red-600 shrink-0" />
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:underline truncate"
                >
                  {value}
                </a>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded hover:bg-gray-200 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : isUploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-itinerary-upload"
              />
              <label
                htmlFor="pdf-itinerary-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-10 w-10 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {placeholder}
                </span>
                <span className="text-xs text-gray-500">
                  Drop PDF here or click to browse
                </span>
              </label>
            </>
          )}
        </div>
      )}

      {mode === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            value={value ? value : urlInput}
            onChange={(e) => {
              const v = e.target.value;
              setUrlInput(v);
              onChange(v);
            }}
            onFocus={() => {
              if (value) setUrlInput(value);
            }}
            placeholder="https://example.com/itinerary.pdf"
            className={cn(
              "flex-1 px-3 py-2 border rounded-md text-sm",
              error && "border-red-500"
            )}
          />
          {(value || urlInput) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
