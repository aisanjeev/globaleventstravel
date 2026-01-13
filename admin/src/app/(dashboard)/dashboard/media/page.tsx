"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { mediaService } from "@/services/media.service";
import { useUIStore } from "@/store/ui.store";
import { formatFileSize, formatDate } from "@/lib/utils";
import type { MediaFile } from "@/types/api";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  File,
  Copy,
  Check,
  X,
  Loader2,
  Grid,
  List,
} from "lucide-react";

export default function MediaPage() {
  const { addToast } = useUIStore();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dragOver, setDragOver] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const response = await mediaService.list({ limit: 100 });
      setFiles(response.items);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (validFiles.length === 0) {
      addToast({ type: "error", message: "Please select image files only" });
      return;
    }

    setUploading(true);
    try {
      for (const file of validFiles) {
        await mediaService.upload({ file, folder: "general" });
      }
      addToast({
        type: "success",
        message: `Uploaded ${validFiles.length} file(s) successfully`,
      });
      fetchFiles();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to upload files",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await mediaService.delete(file.id);
      addToast({ type: "success", message: "File deleted successfully" });
      setSelectedFile(null);
      fetchFiles();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to delete file",
      });
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = mediaService.getFullUrl(url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    addToast({ type: "success", message: "URL copied to clipboard" });
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload and manage your media files"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Media" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded p-1.5 ${
                  viewMode === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded p-1.5 ${
                  viewMode === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <label>
              <span className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 cursor-pointer">
                <Upload className="h-4 w-4" />
                Upload Files
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        }
      />

      {/* Upload Zone */}
      <Card
        className={`mb-6 transition-colors ${
          dragOver ? "border-primary-500 bg-primary-50" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="py-8 text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop files here, or click Upload Files
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Supported formats: JPG, PNG, GIF, WebP, SVG
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Files Grid/List */}
      <Card>
        {loading ? (
          <CardContent className="py-12 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </CardContent>
        ) : files.length === 0 ? (
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No files uploaded yet</p>
          </CardContent>
        ) : viewMode === "grid" ? (
          <CardContent className="py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gray-50 hover:border-primary-500"
                >
                  {isImage(file.mime_type) ? (
                    <img
                      src={mediaService.getFullUrl(file.url)}
                      alt={file.original_filename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <File className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.url);
                      }}
                      className="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100"
                    >
                      {copiedUrl === file.url ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Folder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {isImage(file.mime_type) ? (
                          <img
                            src={mediaService.getFullUrl(file.url)}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <File className="h-10 w-10 text-gray-400" />
                        )}
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">
                          {file.original_filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {file.folder}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(file.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
                          title="Copy URL"
                        >
                          {copiedUrl === file.url ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* File Details Modal */}
      <Modal
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        title="File Details"
        size="lg"
      >
        {selectedFile && (
          <div className="space-y-4">
            {isImage(selectedFile.mime_type) && (
              <img
                src={mediaService.getFullUrl(selectedFile.url)}
                alt={selectedFile.original_filename}
                className="max-h-[300px] w-full rounded-lg object-contain bg-gray-100"
              />
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Filename</p>
                <p className="font-medium">{selectedFile.original_filename}</p>
              </div>
              <div>
                <p className="text-gray-500">Size</p>
                <p className="font-medium">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium">{selectedFile.mime_type}</p>
              </div>
              <div>
                <p className="text-gray-500">Folder</p>
                <p className="font-medium">{selectedFile.folder}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">URL</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={mediaService.getFullUrl(selectedFile.url)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedFile.url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="danger"
                onClick={() => handleDelete(selectedFile)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button variant="outline" onClick={() => setSelectedFile(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


