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

// ============================================
// Trek Validation Schemas
// ============================================

export const itineraryDaySchema = z.object({
  day: z.number().min(1, "Day must be at least 1"),
  title: z.string().min(1, "Day title is required").max(255, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  elevation_gain: z.number().min(0, "Elevation gain cannot be negative").default(0),
  distance: z.number().min(0, "Distance cannot be negative").default(0),
  accommodation: z.string().optional().or(z.literal("")),
  meals: z.string().optional().or(z.literal("")),
  highlights: z.array(z.string()).optional(),
});

export type ItineraryDayFormData = z.infer<typeof itineraryDaySchema>;

export const trekSchema = z.object({
  name: z.string().min(1, "Trek name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  short_description: z
    .string()
    .max(300, "Short description is too long")
    .optional()
    .or(z.literal("")),
  description: z.string().min(50, "Description must be at least 50 characters"),
  difficulty: z.enum(["easy", "moderate", "difficult", "challenging", "extreme"], {
    message: "Please select a valid difficulty level",
  }),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  max_altitude: z.number().min(0, "Maximum altitude cannot be negative"),
  distance: z.number().min(0, "Distance cannot be negative").optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  featured_image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  gallery: z.array(z.string().url("Invalid gallery image URL")).optional(),
  status: z.enum(["draft", "published", "archived", "seasonal"]),
  featured: z.boolean().default(false),
  category_id: z.number().optional().nullable(),
  location: z.string().min(1, "Location is required"),
  best_season: z.array(z.string()).min(1, "At least one best season is required"),
  group_size_min: z.number().min(1, "Minimum group size must be at least 1"),
  group_size_max: z.number().min(1, "Maximum group size must be at least 1"),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  equipment_list: z.array(z.string()).optional(),
  fitness_level: z.string().optional().or(z.literal("")),
  experience_required: z.string().optional().or(z.literal("")),
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
  meta_keywords: z.array(z.string()).optional(),
  itinerary: z.array(itineraryDaySchema).optional(),
}).refine(
  (data) => data.group_size_max >= data.group_size_min,
  {
    message: "Maximum group size must be greater than or equal to minimum group size",
    path: ["group_size_max"],
  }
);

export type TrekFormData = z.infer<typeof trekSchema>;

export const trekCategorySchema = z.object({
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

export type TrekCategoryFormData = z.infer<typeof trekCategorySchema>;

// Status transition validation
export const validateStatusTransition = (
  currentStatus: string,
  targetStatus: string
): { valid: boolean; error?: string } => {
  const allowedTransitions: Record<string, string[]> = {
    draft: ["published", "archived"],
    published: ["draft", "archived", "seasonal"],
    archived: ["draft", "published"],
    seasonal: ["published", "archived"],
  };

  const allowed = allowedTransitions[currentStatus];
  if (!allowed || !allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Cannot transition from ${currentStatus} to ${targetStatus}`,
    };
  }

  return { valid: true };
};


