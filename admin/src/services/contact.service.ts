import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  ContactMessage,
  ContactMessageListItem,
  ContactStatus,
  PaginatedResponse,
} from "@/types/api";

export interface ContactListParams {
  skip?: number;
  limit?: number;
  status?: ContactStatus | "all";
}

export interface ContactUpdatePayload {
  status?: ContactStatus;
  admin_notes?: string;
}

export const contactService = {
  async list(
    params: ContactListParams = {}
  ): Promise<PaginatedResponse<ContactMessageListItem>> {
    try {
      const { status, ...rest } = params;
      const apiParams: Record<string, any> = { ...rest };
      if (status && status !== "all") {
        apiParams.status = status;
      }

      const response = await apiClient.get<
        PaginatedResponse<ContactMessageListItem>
      >("/api/v1/contacts", { params: apiParams });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<ContactMessage> {
    try {
      const response = await apiClient.get<ContactMessage>(
        `/api/v1/contacts/${id}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: ContactUpdatePayload): Promise<ContactMessage> {
    try {
      const response = await apiClient.put<ContactMessage>(
        `/api/v1/contacts/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async markRead(id: number): Promise<ContactMessage> {
    try {
      const response = await apiClient.patch<ContactMessage>(
        `/api/v1/contacts/${id}/read`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/contacts/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

