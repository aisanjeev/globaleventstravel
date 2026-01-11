"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { mediaService } from "@/services/media.service";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  error?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder = "blog",
  placeholder = "Drop image here or click to upload",
  error,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    setIsUploading(true);
    try {
      const response = await mediaService.upload(file, folder);
      onChange(mediaService.getFullUrl(response.url));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [folder]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  if (value) {
    return (
      <div className="relative rounded-lg border border-gray-200 p-2">
        <img
          src={value}
          alt="Preview"
          className="max-h-48 w-full object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (showUrlInput) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(false)}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
        dragOver
          ? "border-primary-500 bg-primary-50"
          : error
          ? "border-red-300 bg-red-50"
          : "border-gray-300 hover:border-gray-400"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">{placeholder}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <label className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <LinkIcon className="h-4 w-4" />
              URL
            </button>
          </div>
        </>
      )}
    </div>
  );
}


