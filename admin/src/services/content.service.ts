import { apiClient, handleApiError } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";

export interface PageSection {
  id: number;
  page: string;
  key: string;
  title?: string | null;
  subtitle?: string | null;
  badge_text?: string | null;
  body_html?: string | null;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PageSectionCreate {
  page: string;
  key: string;
  title?: string;
  subtitle?: string;
  badge_text?: string;
  body_html?: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface PageSectionUpdate extends Partial<PageSectionCreate> {}

export const contentService = {
  async listByPage(page: string, activeOnly = false): Promise<PageSection[]> {
    try {
      const response = await apiClient.get<PageSection[]>(
        `/api/v1/content/${encodeURIComponent(page)}`,
        { params: { active_only: activeOnly } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getByPageAndKey(page: string, key: string): Promise<PageSection> {
    try {
      const response = await apiClient.get<PageSection>(
        `/api/v1/content/${encodeURIComponent(page)}/${encodeURIComponent(key)}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: PageSectionCreate): Promise<PageSection> {
    try {
      const response = await apiClient.post<PageSection>("/api/v1/content", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: PageSectionUpdate): Promise<PageSection> {
    try {
      const response = await apiClient.put<PageSection>(`/api/v1/content/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/content/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

