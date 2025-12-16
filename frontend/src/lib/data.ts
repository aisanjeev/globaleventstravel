// ============================================
// Mock Data for Development
// Replace with API calls in production
// ============================================

import type { Trek, Testimonial, Guide } from './types';

export const MOCK_TREKS: Trek[] = [
  {
    id: 1,
    name: 'Hampta Pass Trek',
    slug: 'hampta-pass',
    difficulty: 'moderate',
    duration: 5,
    price: 12999,
    season: ['May', 'June', 'September', 'October'],
    elevation: 4270,
    distance: 35,
    description: 'One of the most dramatic crossovers in the Himalayas, Hampta Pass takes you from the lush green valleys of Kullu to the barren landscapes of Lahaul.',
    short_description: 'Cross from lush Kullu valley to barren Lahaul desert in this dramatic Himalayan crossover trek.',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800',
    rating: 4.8,
    review_count: 124,
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 2,
    name: 'Kedarkantha Trek',
    slug: 'kedarkantha',
    difficulty: 'easy',
    duration: 6,
    price: 9999,
    season: ['December', 'January', 'February', 'March'],
    elevation: 3810,
    distance: 20,
    description: 'Perfect winter trek with stunning snow-covered trails and panoramic views of Himalayan peaks.',
    short_description: 'A perfect winter trek with pristine snow trails and 360-degree summit views.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    rating: 4.9,
    review_count: 256,
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 3,
    name: 'Valley of Flowers',
    slug: 'valley-of-flowers',
    difficulty: 'moderate',
    duration: 6,
    price: 14999,
    season: ['July', 'August', 'September'],
    elevation: 3658,
    distance: 38,
    description: 'UNESCO World Heritage Site featuring over 600 species of exotic flowers blooming in the monsoon.',
    short_description: 'Walk through a UNESCO World Heritage Site carpeted with exotic Himalayan flowers.',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
    rating: 4.7,
    review_count: 89,
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 4,
    name: 'Roopkund Trek',
    slug: 'roopkund',
    difficulty: 'hard',
    duration: 8,
    price: 18999,
    season: ['May', 'June', 'September', 'October'],
    elevation: 5029,
    distance: 53,
    description: 'The mysterious skeleton lake trek - one of the most challenging and rewarding treks in India.',
    short_description: 'Trek to the mysterious skeleton lake at 5,029m - a challenging high-altitude adventure.',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
    rating: 4.6,
    review_count: 67,
    featured: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 5,
    name: 'Sar Pass Trek',
    slug: 'sar-pass',
    difficulty: 'moderate',
    duration: 5,
    price: 11999,
    season: ['April', 'May', 'June'],
    elevation: 4200,
    distance: 48,
    description: 'Experience thrilling snow slides and stunning meadows on this classic Himalayan trek from Kasol.',
    short_description: 'Classic trek from Kasol featuring snow slides, alpine meadows, and stunning vistas.',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800',
    rating: 4.5,
    review_count: 98,
    featured: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 6,
    name: 'Brahmatal Trek',
    slug: 'brahmatal',
    difficulty: 'moderate',
    duration: 6,
    price: 10999,
    season: ['December', 'January', 'February', 'March'],
    elevation: 3425,
    distance: 24,
    description: 'A winter wonderland trek with frozen lakes and spectacular views of Mt. Trishul and Nanda Ghunti.',
    short_description: 'Winter trek featuring frozen alpine lakes and views of majestic Himalayan peaks.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    rating: 4.8,
    review_count: 112,
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Software Engineer, Bangalore',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    testimonial: 'The Kedarkantha trek was absolutely magical! The guides were professional, the food was great, and the views were breathtaking. This was my first trek and I couldn\'t have asked for a better experience.',
    trek_name: 'Kedarkantha Trek',
    featured: true,
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Marketing Manager, Mumbai',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    testimonial: 'Global Events Travels made my dream of trekking in the Himalayas come true. Their attention to safety and the beautiful campsites made this an unforgettable adventure.',
    trek_name: 'Hampta Pass Trek',
    featured: true,
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Doctor, Delhi',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    testimonial: 'I\'ve done multiple treks with this team and every time they exceed expectations. The Valley of Flowers was like walking through paradise. Highly recommend!',
    trek_name: 'Valley of Flowers',
    featured: true,
  },
];

export const MOCK_GUIDES: Guide[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    bio: 'Born and raised in the mountains of Uttarakhand, Rajesh has been leading treks for over 15 years. His deep knowledge of local terrain and culture makes every trek special.',
    experience_years: 15,
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    specializations: ['High Altitude', 'Winter Treks', 'Photography Tours'],
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Vikram Singh',
    bio: 'A certified mountaineer with experience on some of the world\'s highest peaks. Vikram brings technical expertise and a calm demeanor to challenging expeditions.',
    experience_years: 12,
    profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    specializations: ['Technical Climbing', 'Expedition Leadership', 'First Aid'],
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Deepa Negi',
    bio: 'One of the few female trek leaders in the region, Deepa is passionate about making trekking accessible to everyone. Her encouraging nature helps first-timers feel confident.',
    experience_years: 8,
    profile_image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300',
    specializations: ['Beginner Friendly', 'Women-Only Groups', 'Nature Education'],
    rating: 4.9,
  },
];

// Utility function to get featured treks
export const getFeaturedTreks = () => MOCK_TREKS.filter(trek => trek.featured);

// Utility function to get trek by slug
export const getTrekBySlug = (slug: string) => MOCK_TREKS.find(trek => trek.slug === slug);

// Utility function to filter treks
export const filterTreks = (filters: {
  difficulty?: string;
  maxPrice?: number;
  season?: string;
}) => {
  return MOCK_TREKS.filter(trek => {
    if (filters.difficulty && trek.difficulty !== filters.difficulty) return false;
    if (filters.maxPrice && trek.price > filters.maxPrice) return false;
    if (filters.season && !trek.season.includes(filters.season)) return false;
    return true;
  });
};

