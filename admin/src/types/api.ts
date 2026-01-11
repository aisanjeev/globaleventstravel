export type PostStatus = "draft" | "published" | "archived";
export type ContentType = "markdown" | "html";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export interface BlogAuthor {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategoryTree extends BlogCategory {
  children: BlogCategoryTree[];
  post_count: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  post_count?: number;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentType: ContentType;
  status: PostStatus;
  author: BlogAuthor;
  publishDate?: string;
  updatedDate?: string;
  publishedAt?: string;
  featuredImage?: string;
  category?: string;
  categoryId?: number;
  categoryName?: string;
  tags?: string[];
  tagsList?: BlogTag[];
  readTime?: number;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  author: BlogAuthor;
  publishDate?: string;
  featuredImage?: string;
  category?: string;
  categoryName?: string;
  tags?: string[];
  readTime?: number;
  featured: boolean;
  status: PostStatus;
  contentType: ContentType;
  createdAt: string;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  content_type?: ContentType;
  status?: PostStatus;
  category_id?: number;
  category?: string;
  tags?: string[];
  tag_ids?: number[];
  featured_image?: string;
  read_time?: number;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  author_id: number;
  published_at?: string;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  url: string;
  size: number;
  mime_type: string;
  folder: string;
  created_at: string;
}

export interface UploadResponse {
  id: string;
  filename: string;
  original_filename: string;
  url: string;
  size: number;
  mime_type: string;
  folder: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}


