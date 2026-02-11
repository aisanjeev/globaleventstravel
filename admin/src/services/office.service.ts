import { apiClient, handleApiError } from "@/lib/api-client";

export interface Office {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmarks?: string;
  phone: string;
  email: string;
  coordinates: { lat: number; lng: number };
  mapUrl: string;
  image?: string;
}

export interface OfficeCreate {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmarks?: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  mapUrl: string;
  image?: string;
}

export interface OfficeUpdate {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmarks?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  mapUrl?: string;
  image?: string;
}

export const officeService = {
  async list(): Promise<Office[]> {
    try {
      const response = await apiClient.get<Office[]>("/api/v1/offices");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<Office> {
    try {
      const response = await apiClient.get<Office>(`/api/v1/offices/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: OfficeCreate): Promise<Office> {
    try {
      const response = await apiClient.post<Office>("/api/v1/offices", {
        ...data,
        mapUrl: data.mapUrl,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: OfficeUpdate): Promise<Office> {
    try {
      const response = await apiClient.put<Office>(`/api/v1/offices/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/offices/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
