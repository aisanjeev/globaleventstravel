import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  category_id: z.number({ message: "Category is required" }).optional().nullable(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  content_type: z.enum(["html", "markdown"]).optional(),
  excerpt: z
    .string()
    .max(500, "Excerpt is too long")
    .optional()
    .or(z.literal("")),
  featured_image: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
  reading_time: z.number().optional(),
  meta_title: z
    .string()
    .max(70, "Meta title should be under 70 characters")
    .optional()
    .or(z.literal("")),
  meta_description: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional()
    .or(z.literal("")),
  published_at: z.string().optional().or(z.literal("")),
  tag_ids: z.array(z.number()).optional(),
  author_id: z.number({ message: "Author is required" }),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

export const blogCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  description: z.string().optional().or(z.literal("")),
  parent_id: z.number().optional().nullable(),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export type BlogCategoryFormData = z.infer<typeof blogCategorySchema>;

export const blogTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
});

export type BlogTagFormData = z.infer<typeof blogTagSchema>;


