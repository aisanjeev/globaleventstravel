// ============================================
// Global Events Travels - Constants
// ============================================

export const SITE_CONFIG = {
  name: 'Global Events Travels',
  tagline: 'Adventure Awaits in the Himalayas',
  description: 'Discover amazing treks and expeditions in the Himalayas with experienced guides and unforgettable experiences.',
  url: 'https://globaleventstravels.com',
  email: 'info@globaleventstravels.com',
  phone: '+91 98765 43210',
  address: 'Manali, Himachal Pradesh, India',
};

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Treks', href: '/treks' },
  { name: 'About', href: '/about' },
  { name: 'Guides', href: '/guides' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/globaleventstravels',
  instagram: 'https://instagram.com/globaleventstravels',
  twitter: 'https://twitter.com/globaleventstravels',
  youtube: 'https://youtube.com/globaleventstravels',
};

export const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'badge-easy' },
  moderate: { label: 'Moderate', color: 'badge-moderate' },
  hard: { label: 'Hard', color: 'badge-hard' },
  expert: { label: 'Expert', color: 'badge-expert' },
};

export const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
};

