"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { mediaService } from "@/services/media.service";
import type { MediaFile, TagInfo, FolderInfo } from "@/types/api";
import { Modal } from "./Modal";
import {
  Upload,
  X,
  Search,
  Image as ImageIcon,
  FileText,
  Video,
  Check,
  Loader2,
  FolderOpen,
  Tag,
  Grid,
  List,
} from "lucide-react";

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaFile | MediaFile[]) => void;
  multiple?: boolean;
  acceptedTypes?: "image" | "video" | "document" | "all";
  defaultFolder?: string;
}

type ViewMode = "grid" | "list";

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  acceptedTypes = "all",
  defaultFolder,
}: MediaPickerProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>(defaultFolder || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 24;

  // Get MIME type filter based on acceptedTypes
  const getMimeTypeFilter = (): string | undefined => {
    switch (acceptedTypes) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "document":
        return "application/pdf";
      default:
        return undefined;
    }
  };

  // Load media files
  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await mediaService.list({
        query: searchQuery || undefined,
        folder: selectedFolder || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        mime_type: getMimeTypeFilter(),
        skip: page * limit,
        limit,
      });
      setMedia(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedFolder, selectedTags, page, acceptedTypes]);

  // Load folders and tags
  const loadFilters = useCallback(async () => {
    try {
      const [foldersData, tagsData] = await Promise.all([
        mediaService.getFolders(),
        mediaService.getTags(),
      ]);
      setFolders(foldersData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to load filters:", error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
      loadFilters();
    }
  }, [isOpen, loadMedia, loadFilters]);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
      setPage(0);
    }
  }, [isOpen]);

  // Handle file selection
  const handleSelect = (file: MediaFile) => {
    if (multiple) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(file.id)) {
          next.delete(file.id);
        } else {
          next.add(file.id);
        }
        return next;
      });
    } else {
      setSelectedIds(new Set([file.id]));
    }
  };

  // Handle confirm selection
  const handleConfirm = () => {
    const selected = media.filter((m) => selectedIds.has(m.id));
    if (selected.length > 0) {
      onSelect(multiple ? selected : selected[0]);
      onClose();
    }
  };

  // Handle file upload
  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await mediaService.upload({
          file,
          folder: selectedFolder || "general",
        });
      }
      // Reload media after upload
      await loadMedia();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [selectedFolder]
  );

  // Get file icon based on MIME type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return ImageIcon;
    if (mimeType.startsWith("video/")) return Video;
    return FileText;
  };

  // Render media item
  const renderMediaItem = (file: MediaFile) => {
    const isSelected = selectedIds.has(file.id);
    const FileIcon = getFileIcon(file.mime_type);
    const isImage = mediaService.isImage(file.mime_type);

    if (viewMode === "list") {
      return (
        <div
          key={file.id}
          onClick={() => handleSelect(file)}
          className={cn(
            "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
            isSelected
              ? "bg-primary-50 ring-2 ring-primary-500"
              : "hover:bg-gray-50"
          )}
        >
          {isImage ? (
            <img
              src={mediaService.getFullUrl(file.url)}
              alt={file.alt_text || file.original_filename}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
              <FileIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.original_filename}
            </p>
            <p className="text-xs text-gray-500">
              {mediaService.formatFileSize(file.size)} • {file.folder}
            </p>
          </div>
          {isSelected && (
            <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
          )}
        </div>
      );
    }

    return (
      <div
        key={file.id}
        onClick={() => handleSelect(file)}
        className={cn(
          "relative aspect-square rounded-lg overflow-hidden cursor-pointer group",
          isSelected ? "ring-3 ring-primary-500" : "ring-1 ring-gray-200"
        )}
      >
        {isImage ? (
          <img
            src={mediaService.getFullUrl(file.url)}
            alt={file.alt_text || file.original_filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <FileIcon className="w-10 h-10 text-gray-400" />
            <p className="mt-2 text-xs text-gray-500 px-2 text-center truncate max-w-full">
              {file.original_filename}
            </p>
          </div>
        )}

        {/* Selection overlay */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity",
            isSelected ? "bg-primary-500/20" : "bg-black/0 group-hover:bg-black/10"
          )}
        />

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* File info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-white truncate">{file.original_filename}</p>
          <p className="text-xs text-white/70">
            {mediaService.formatFileSize(file.size)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Media Library" size="xl">
      <div className="flex flex-col h-[70vh]">
        {/* Toolbar */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>

          {/* Folder filter */}
          <select
            value={selectedFolder}
            onChange={(e) => {
              setSelectedFolder(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
          >
            <option value="">All Folders</option>
            {folders.map((folder) => (
              <option key={folder.folder} value={folder.folder}>
                {folder.folder} ({folder.count})
              </option>
            ))}
          </select>

          {/* View mode toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload button */}
          <label className="cursor-pointer px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              className="hidden"
              accept={
                acceptedTypes === "image"
                  ? "image/*"
                  : acceptedTypes === "video"
                  ? "video/*"
                  : acceptedTypes === "document"
                  ? "application/pdf"
                  : "*"
              }
            />
          </label>
        </div>

        {/* Tags filter */}
        {tags.length > 0 && (
          <div className="flex items-center gap-2 py-3 border-b border-gray-200 overflow-x-auto">
            <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag.tag}
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag.tag)
                      ? prev.filter((t) => t !== tag.tag)
                      : [...prev, tag.tag]
                  );
                  setPage(0);
                }}
                className={cn(
                  "px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors",
                  selectedTags.includes(tag.tag)
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {tag.tag} ({tag.count})
              </button>
            ))}
          </div>
        )}

        {/* Media grid */}
        <div
          className={cn(
            "flex-1 overflow-y-auto py-4",
            dragOver && "bg-primary-50"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FolderOpen className="w-12 h-12 mb-4" />
              <p>No media files found</p>
              <p className="text-sm mt-1">
                Drop files here or click Upload to add files
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {media.map(renderMediaItem)}
            </div>
          ) : (
            <div className="space-y-2">{media.map(renderMediaItem)}</div>
          )}
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {page * limit + 1}-{Math.min((page + 1) * limit, total)} of{" "}
              {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * limit >= total}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {selectedIds.size} file{selectedIds.size !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Convenience hook for using the media picker
export function useMediaPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | MediaFile[] | null>(
    null
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleSelect = useCallback((media: MediaFile | MediaFile[]) => {
    setSelectedMedia(media);
  }, []);

  return {
    isOpen,
    open,
    close,
    selectedMedia,
    handleSelect,
    MediaPickerComponent: (props: Omit<MediaPickerProps, "isOpen" | "onClose" | "onSelect">) => (
      <MediaPicker
        isOpen={isOpen}
        onClose={close}
        onSelect={handleSelect}
        {...props}
      />
    ),
  };
}
