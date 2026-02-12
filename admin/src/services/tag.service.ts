import { apiClient, handleApiError } from "@/lib/api-client";
import type { BlogTag } from "@/types/api";

export interface TagCreateData {
  name: string;
  slug: string;
}

export interface TagUpdateData {
  name?: string;
  slug?: string;
}

export const tagService = {
  async list(): Promise<BlogTag[]> {
    try {
      const response = await apiClient.get<BlogTag[]>("/api/v1/blog/tags");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: TagCreateData): Promise<BlogTag> {
    try {
      const response = await apiClient.post<BlogTag>("/api/v1/blog/tags", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: TagUpdateData): Promise<BlogTag> {
    try {
      const response = await apiClient.put<BlogTag>(
        `/api/v1/blog/tags/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/blog/tags/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};


