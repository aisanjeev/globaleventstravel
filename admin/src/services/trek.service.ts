import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  Trek,
  TrekListItem,
  TrekCreate,
  TrekUpdate,
  PaginatedResponse,
} from "@/types/api";

export interface TrekListParams {
  skip?: number;
  limit?: number;
  status?: string;
  featured?: boolean;
  category?: string;
  category_id?: number;
  difficulty?: string;
  location?: string;
  search?: string;
}

export const trekService = {
  async list(params: TrekListParams = {}): Promise<PaginatedResponse<TrekListItem>> {
    try {
      const response = await apiClient.get<PaginatedResponse<TrekListItem>>(
        "/api/v1/treks",
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<Trek> {
    try {
      const response = await apiClient.get<Trek>(`/api/v1/treks/id/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBySlug(slug: string): Promise<Trek> {
    try {
      const response = await apiClient.get<Trek>(`/api/v1/treks/${slug}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: TrekCreate): Promise<Trek> {
    try {
      const response = await apiClient.post<Trek>("/api/v1/treks", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: TrekUpdate): Promise<Trek> {
    try {
      const response = await apiClient.put<Trek>(`/api/v1/treks/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/treks/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async publish(id: number): Promise<Trek> {
    try {
      const response = await apiClient.post<Trek>(`/api/v1/treks/${id}/publish`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async unpublish(id: number): Promise<Trek> {
    try {
      const response = await apiClient.post<Trek>(`/api/v1/treks/${id}/unpublish`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async archive(id: number): Promise<Trek> {
    try {
      const response = await apiClient.post<Trek>(`/api/v1/treks/${id}/archive`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async restore(id: number): Promise<Trek> {
    try {
      const response = await apiClient.post<Trek>(`/api/v1/treks/${id}/restore`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async duplicate(id: number): Promise<Trek> {
    try {
      const response = await apiClient.post<Trek>(`/api/v1/treks/${id}/duplicate`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Status transition validation
  canTransitionTo(currentStatus: string, targetStatus: string): boolean {
    const allowedTransitions: Record<string, string[]> = {
      draft: ["published", "archived"],
      published: ["draft", "archived", "seasonal"],
      archived: ["draft", "published"],
      seasonal: ["published", "archived"],
    };

    return allowedTransitions[currentStatus]?.includes(targetStatus) || false;
  },

  // Check if trek can be published (business rules)
  async canPublish(id: number): Promise<{ canPublish: boolean; reasons: string[] }> {
    try {
      const trek = await this.getById(id);
      const reasons: string[] = [];

      // Required fields validation
      if (!trek.name?.trim()) reasons.push("Trek name is required");
      if (!trek.description?.trim()) reasons.push("Trek description is required");
      if (!trek.featured_image) reasons.push("Featured image is required");
      if (!trek.location?.trim()) reasons.push("Location is required");
      if (trek.price <= 0) reasons.push("Valid price is required");
      if (trek.duration <= 0) reasons.push("Valid duration is required");
      if (trek.max_altitude <= 0) reasons.push("Valid maximum altitude is required");

      // Itinerary validation
      if (!trek.itinerary || trek.itinerary.length === 0) {
        reasons.push("At least one itinerary day is required");
      } else {
        const missingDayInfo = trek.itinerary.find(
          (day) => !day.title?.trim() || !day.description?.trim()
        );
        if (missingDayInfo) {
          reasons.push("All itinerary days must have title and description");
        }

        // Check for sequential day numbers
        const dayNumbers = trek.itinerary.map(day => day.day).sort((a, b) => a - b);
        for (let i = 0; i < dayNumbers.length; i++) {
          if (dayNumbers[i] !== i + 1) {
            reasons.push("Itinerary days must be sequential starting from 1");
            break;
          }
        }
      }

      // Group size validation
      if (trek.group_size_min <= 0) reasons.push("Minimum group size must be greater than 0");
      if (trek.group_size_max < trek.group_size_min) {
        reasons.push("Maximum group size must be greater than or equal to minimum");
      }

      // Season validation
      if (!trek.best_season || trek.best_season.length === 0) {
        reasons.push("At least one best season is required");
      }

      return {
        canPublish: reasons.length === 0,
        reasons,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },
};