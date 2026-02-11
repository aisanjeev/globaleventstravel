import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  BlogPost,
  BlogPostListItem,
  BlogPostCreate,
  BlogPostUpdate,
  BlogAuthor,
  PaginatedResponse,
} from "@/types/api";

export interface BlogListParams {
  skip?: number;
  limit?: number;
  status?: string;
  featured?: boolean;
  category?: string;
  category_id?: number;
  search?: string;
}

export const blogService = {
  async list(params: BlogListParams = {}): Promise<PaginatedResponse<BlogPostListItem>> {
    try {
      const response = await apiClient.get<PaginatedResponse<BlogPostListItem>>(
        "/api/v1/blog/posts",
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById(id: number): Promise<BlogPost> {
    try {
      const response = await apiClient.get<BlogPost>(`/api/v1/blog/posts/id/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    try {
      const response = await apiClient.get<BlogPost>(`/api/v1/blog/posts/${slug}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create(data: BlogPostCreate): Promise<BlogPost> {
    try {
      const response = await apiClient.post<BlogPost>("/api/v1/blog/posts", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update(id: number, data: BlogPostUpdate): Promise<BlogPost> {
    try {
      const response = await apiClient.put<BlogPost>(`/api/v1/blog/posts/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/blog/posts/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getAuthors(): Promise<BlogAuthor[]> {
    try {
      const response = await apiClient.get<BlogAuthor[]>("/api/v1/blog/authors");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createAuthor(data: Omit<BlogAuthor, "id">): Promise<BlogAuthor> {
    try {
      const response = await apiClient.post<BlogAuthor>("/api/v1/blog/authors", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateAuthor(
    id: number,
    data: Partial<Omit<BlogAuthor, "id">>
  ): Promise<BlogAuthor> {
    try {
      const response = await apiClient.put<BlogAuthor>(
        `/api/v1/blog/authors/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteAuthor(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/blog/authors/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};


