import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  Expedition,
  ExpeditionListItem,
  ExpeditionCreate,
  ExpeditionUpdate,
  ExpeditionStatus,
  PaginatedResponse,
} from "@/types/api";

export interface ExpeditionListParams {
  skip?: number;
  limit?: number;
  status?: string;
  featured?: boolean;
  difficulty?: string;
  min_price?: number;
  max_price?: number;
  region?: string;
  search?: string;
}

export const expeditionService = {
  async list(params: ExpeditionListParams = {}): Promise<PaginatedResponse<ExpeditionListItem>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ExpeditionListItem>>(
        "/api/v1/expeditions",
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<Expedition> {
    try {
      const response = await apiClient.get<Expedition>(`/api/v1/expeditions/id/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBySlug(slug: string): Promise<Expedition> {
    try {
      const response = await apiClient.get<Expedition>(`/api/v1/expeditions/${slug}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: ExpeditionCreate): Promise<Expedition> {
    try {
      const response = await apiClient.post<Expedition>("/api/v1/expeditions", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: ExpeditionUpdate): Promise<Expedition> {
    try {
      const response = await apiClient.put<Expedition>(`/api/v1/expeditions/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/expeditions/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async publish(id: number): Promise<Expedition> {
    try {
      const response = await apiClient.post<Expedition>(`/api/v1/expeditions/${id}/publish`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async unpublish(id: number): Promise<Expedition> {
    try {
      const response = await apiClient.post<Expedition>(`/api/v1/expeditions/${id}/unpublish`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async archive(id: number): Promise<Expedition> {
    try {
      const response = await apiClient.post<Expedition>(`/api/v1/expeditions/${id}/archive`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async restore(id: number): Promise<Expedition> {
    try {
      const response = await apiClient.post<Expedition>(`/api/v1/expeditions/${id}/restore`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async duplicate(id: number): Promise<Expedition> {
    try {
      const response = await apiClient.post<Expedition>(`/api/v1/expeditions/${id}/duplicate`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Status transition validation
  canTransitionTo(currentStatus: string, targetStatus: string): boolean {
    const allowedTransitions: Record<string, string[]> = {
      draft: ["published", "archived"],
      published: ["draft", "archived"],
      archived: ["draft", "published"],
    };

    return allowedTransitions[currentStatus]?.includes(targetStatus) || false;
  },

  // Check if expedition can be published (business rules)
  async canPublish(id: number): Promise<{ canPublish: boolean; reasons: string[] }> {
    try {
      const expedition = await this.getById(id);
      const reasons: string[] = [];

      // Required fields validation
      if (!expedition.name?.trim()) reasons.push("Expedition name is required");
      if (!expedition.description?.trim()) reasons.push("Description is required");
      if (!expedition.image) reasons.push("Featured image is required");
      if (!expedition.location?.trim()) reasons.push("Location is required");
      if (!expedition.region?.trim()) reasons.push("Region is required");
      if (expedition.price <= 0) reasons.push("Valid price is required");
      if (expedition.duration <= 0) reasons.push("Valid duration is required");
      if (expedition.summitAltitude <= 0) reasons.push("Valid summit altitude is required");
      if (expedition.baseAltitude <= 0) reasons.push("Valid base altitude is required");

      // Highlights validation
      if (!expedition.highlights || expedition.highlights.length === 0) {
        reasons.push("At least one highlight is required");
      }

      // Requirements validation
      if (!expedition.requirements?.experience?.trim()) {
        reasons.push("Experience requirement is required");
      }
      if (!expedition.requirements?.fitnessLevel?.trim()) {
        reasons.push("Fitness level requirement is required");
      }

      // Equipment validation
      if (!expedition.equipment?.provided || expedition.equipment.provided.length === 0) {
        reasons.push("At least one provided equipment item is required");
      }

      // Itinerary validation
      if (!expedition.itinerary || expedition.itinerary.length === 0) {
        reasons.push("At least one itinerary day is required");
      } else {
        const missingDayInfo = expedition.itinerary.find(
          (day) => !day.title?.trim() || !day.description?.trim()
        );
        if (missingDayInfo) {
          reasons.push("All itinerary days must have title and description");
        }
      }

      // Group size validation
      if (expedition.groupSize.min <= 0) reasons.push("Minimum group size must be greater than 0");
      if (expedition.groupSize.max < expedition.groupSize.min) {
        reasons.push("Maximum group size must be greater than or equal to minimum");
      }

      // Season validation
      if (!expedition.season || expedition.season.length === 0) {
        reasons.push("At least one season is required");
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
