import { apiClient, handleApiError } from "@/lib/api-client";

export interface SiteSettings {
  id: number;
  company_name: string;
  tagline: string | null;
  description: string | null;
  url: string | null;
  email: string;
  phone: string;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
}

export interface SiteSettingsUpdate {
  company_name?: string;
  tagline?: string | null;
  description?: string | null;
  url?: string | null;
  email?: string;
  phone?: string;
  address?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  youtube_url?: string | null;
}

export const settingsService = {
  async get(): Promise<SiteSettings> {
    try {
      const response = await apiClient.get<SiteSettings>("/api/v1/site-settings");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(data: SiteSettingsUpdate): Promise<SiteSettings> {
    try {
      const response = await apiClient.put<SiteSettings>(
        "/api/v1/site-settings",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
