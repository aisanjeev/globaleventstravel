import { apiClient, handleApiError, API_BASE_URL } from "@/lib/api-client";
import type { MediaFile, UploadResponse } from "@/types/api";

export interface MediaListParams {
  folder?: string;
  skip?: number;
  limit?: number;
}

export const mediaService = {
  async list(params: MediaListParams = {}): Promise<MediaFile[]> {
    try {
      const response = await apiClient.get<MediaFile[]>("/api/v1/uploads", { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async upload(file: File, folder: string = "general"): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await apiClient.post<UploadResponse>(
        "/api/v1/uploads",
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

  async delete(folder: string, filename: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/uploads/${folder}/${filename}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getFullUrl(relativePath: string): string {
    if (relativePath.startsWith("http")) {
      return relativePath;
    }
    return `${API_BASE_URL}${relativePath}`;
  },
};


