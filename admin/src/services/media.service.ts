import { apiClient, handleApiError, API_BASE_URL } from "@/lib/api-client";
import type { 
  MediaFile, 
  UploadResponse, 
  MediaListResponse, 
  MediaUpdate,
  TagInfo,
  FolderInfo 
} from "@/types/api";

export interface MediaListParams {
  query?: string;
  folder?: string;
  tags?: string[];
  mime_type?: string;
  skip?: number;
  limit?: number;
}

export interface MediaUploadParams {
  file: File;
  folder?: string;
  tags?: string[];
  alt_text?: string;
  caption?: string;
}

export const mediaService = {
  /**
   * List media files with filtering and pagination
   */
  async list(params: MediaListParams = {}): Promise<MediaListResponse> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (params.query) queryParams.query = params.query;
      if (params.folder) queryParams.folder = params.folder;
      if (params.tags && params.tags.length > 0) {
        queryParams.tags = params.tags.join(",");
      }
      if (params.mime_type) queryParams.mime_type = params.mime_type;
      if (params.skip !== undefined) queryParams.skip = params.skip.toString();
      if (params.limit !== undefined) queryParams.limit = params.limit.toString();
      
      const response = await apiClient.get<MediaListResponse>("/api/v1/media", { 
        params: queryParams 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload a file with hash-based deduplication
   */
  async upload(params: MediaUploadParams): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", params.file);
      
      if (params.folder) {
        formData.append("folder", params.folder);
      }
      if (params.tags && params.tags.length > 0) {
        formData.append("tags", params.tags.join(","));
      }
      if (params.alt_text) {
        formData.append("alt_text", params.alt_text);
      }
      if (params.caption) {
        formData.append("caption", params.caption);
      }

      const response = await apiClient.post<UploadResponse>(
        "/api/v1/media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single media file by ID
   */
  async getById(id: number): Promise<MediaFile> {
    try {
      const response = await apiClient.get<MediaFile>(`/api/v1/media/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update media metadata (tags, alt_text, caption, folder)
   */
  async update(id: number, data: MediaUpdate): Promise<MediaFile> {
    try {
      const response = await apiClient.patch<MediaFile>(`/api/v1/media/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Replace all tags for a media item
   */
  async updateTags(id: number, tags: string[]): Promise<MediaFile> {
    try {
      const response = await apiClient.put<MediaFile>(`/api/v1/media/${id}/tags`, { tags });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a media file
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/media/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all unique tags with usage counts
   */
  async getTags(): Promise<TagInfo[]> {
    try {
      const response = await apiClient.get<TagInfo[]>("/api/v1/media/tags");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all folders with file counts
   */
  async getFolders(): Promise<FolderInfo[]> {
    try {
      const response = await apiClient.get<FolderInfo[]>("/api/v1/media/folders");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get full URL for a media file
   * Handles both relative and absolute URLs
   */
  getFullUrl(urlOrPath: string): string {
    if (!urlOrPath) return "";
    
    // Already absolute URL (Azure or external)
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      return urlOrPath;
    }
    
    // Relative URL - prepend API base
    return `${API_BASE_URL}${urlOrPath}`;
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  /**
   * Check if a file is an image based on MIME type
   */
  isImage(mimeType: string): boolean {
    return mimeType.startsWith("image/");
  },

  /**
   * Check if a file is a video based on MIME type
   */
  isVideo(mimeType: string): boolean {
    return mimeType.startsWith("video/");
  },

  /**
   * Check if a file is a PDF
   */
  isPdf(mimeType: string): boolean {
    return mimeType === "application/pdf";
  },
};