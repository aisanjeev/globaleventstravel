// ============================================
// Global Events Travels - Type Definitions
// ============================================

export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert';

export interface Trek {
  id: number;
  name: string;
  slug: string;
  difficulty: Difficulty;
  duration: number; // days
  price: number;
  season: string[];
  elevation: number; // meters
  distance: number; // kilometers
  description: string;
  short_description?: string;
  image: string;
  images?: TrekImage[];
  itinerary?: ItineraryDay[];
  reviews?: Review[];
  guide_id?: number;
  guide?: Guide;
  rating: number;
  review_count: number;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  elevation_gain: number;
  distance: number;
}

export interface TrekImage {
  id: number;
  trek_id: number;
  url: string;
  caption?: string;
  display_order: number;
}

export interface Review {
  id: number;
  trek_id: number;
  user_name: string;
  email?: string;
  rating: number;
  title: string;
  comment: string;
  helpful_count: number;
  created_at: string;
}

export interface Guide {
  id: number;
  name: string;
  bio: string;
  experience_years: number;
  profile_image_url: string;
  specializations: string[];
  rating: number;
}

export interface Booking {
  id: number;
  trek_id: number;
  name: string;
  email: string;
  phone: string;
  group_size: number;
  preferred_date: string;
  special_requirements?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role?: string;
  image_url?: string;
  testimonial: string;
  trek_name?: string;
  featured: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

