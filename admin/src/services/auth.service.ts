import { apiClient, handleApiError } from "@/lib/api-client";
import type { AuthResponse, User } from "@/types/api";

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      // Login endpoint expects form data
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await apiClient.post<AuthResponse>(
        "/api/v1/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = response.data.access_token;

      // Get user info
      const userResponse = await apiClient.get<User>("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        token,
        user: userResponse.data,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/api/v1/auth/me");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};


