"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { mediaService } from "@/services/media.service";
import { MediaPicker } from "./MediaPicker";
import type { MediaFile } from "@/types/api";
import {
  Upload,
  X,
  Plus,
  FolderOpen,
  Loader2,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  error?: string;
}

export function GalleryUpload({
  value = [],
  onChange,
  folder = "general",
  maxImages = 20,
  error,
}: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFilesUpload = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (imageFiles.length === 0) return;

    const remainingSlots = maxImages - value.length;
    const filesToUpload = imageFiles.slice(0, remainingSlots);

    setIsUploading(true);
    try {
      const uploadPromises = filesToUpload.map((file) =>
        mediaService.upload({ file, folder })
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => mediaService.getFullUrl(r.url));
      onChange([...value, ...newUrls]);
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

      if (e.dataTransfer.files.length > 0) {
        handleFilesUpload(e.dataTransfer.files);
      }
    },
    [value, folder, maxImages]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(e.target.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMediaSelect = (media: MediaFile | MediaFile[]) => {
    const selected = Array.isArray(media) ? media : [media];
    const remainingSlots = maxImages - value.length;
    const newUrls = selected
      .slice(0, remainingSlots)
      .map((m) => mediaService.getFullUrl(m.url));
    onChange([...value, ...newUrls]);
    setShowMediaPicker(false);
  };

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...value];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, removed);
    onChange(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const canAddMore = value.length < maxImages;

  return (
    <>
      <div className="space-y-4">
        {/* Gallery Grid */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {value.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative group aspect-square rounded-lg overflow-hidden border-2 cursor-move transition-all",
                  draggedIndex === index
                    ? "border-primary-500 opacity-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <img
                  src={url}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Drag handle indicator */}
                <div className="absolute top-1 left-1 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-white" />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Image number badge */}
                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 rounded text-xs text-white">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Zone */}
        {canAddMore && (
          <div
            className={cn(
              "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
              dragOver
                ? "border-primary-500 bg-primary-50"
                : error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <ImageIcon className="h-6 w-6" />
                  <Plus className="h-4 w-4" />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Add more images ({value.length}/{maxImages})
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <label className="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                    <Upload className="inline-block h-4 w-4 mr-1" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 ring-1 ring-primary-200 hover:bg-primary-100"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Media Library
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Info text */}
        <p className="text-xs text-gray-500">
          Drag images to reorder. First image will be used as primary.
        </p>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        multiple={true}
        acceptedTypes="image"
        defaultFolder={folder}
      />
    </>
  );
}
