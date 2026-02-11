import { apiClient } from "@/lib/api-client";

export interface SyncResponse {
  synced: number;
  message: string;
}

export const googleReviewsService = {
  async sync(): Promise<SyncResponse> {
    const response = await apiClient.post<SyncResponse>("/api/v1/google-reviews/sync");
    return response.data;
  },
};
