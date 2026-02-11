import { apiClient, handleApiError } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";

export interface EmailLogItem {
  id: number;
  recipient_email: string;
  subject: string;
  email_type: string;
  lead_id?: number | null;
  contact_id?: number | null;
  brevo_message_id?: string | null;
  tags?: string[] | null;
  sent_at: string;
  delivered_at?: string | null;
  opened_at?: string | null;
  status: string;
}

export interface EmailLogListParams {
  skip?: number;
  limit?: number;
  email_type?: "lead_notification" | "contact_notification" | "itinerary";
  status?: "sent" | "delivered" | "opened" | "bounced" | "error";
}

export const emailLogService = {
  async list(
    params: EmailLogListParams = {}
  ): Promise<PaginatedResponse<EmailLogItem>> {
    try {
      const response = await apiClient.get<PaginatedResponse<EmailLogItem>>(
        "/api/v1/email-logs",
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
