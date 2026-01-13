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
  { name: 'Expeditions', href: '/expeditions' },
  { name: 'About', href: '/about' },
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
  difficult: { label: 'Difficult', color: 'badge-hard' },
  challenging: { label: 'Challenging', color: 'badge-expert' },
  extreme: { label: 'Extreme', color: 'badge-extreme' },
};

export const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
};

// Trek options for lead capture form
export const TREK_OPTIONS = [
  { value: '', label: 'Select a Trek' },
  { value: 'hampta-pass', label: 'Hampta Pass Trek' },
  { value: 'kedarkantha', label: 'Kedarkantha Trek' },
  { value: 'valley-of-flowers', label: 'Valley of Flowers' },
  { value: 'roopkund', label: 'Roopkund Trek' },
  { value: 'sar-pass', label: 'Sar Pass Trek' },
  { value: 'brahmatal', label: 'Brahmatal Trek' },
  { value: 'chadar', label: 'Chadar Trek' },
  { value: 'goechala', label: 'Goechala Trek' },
  { value: 'custom', label: 'Custom Trek / Not Sure' },
];

// Form configuration
export const LEAD_FORM_CONFIG = {
  whatsappCountryCode: '+91',
  successMessage: 'Thank you! Your trek itinerary will be sent to your WhatsApp shortly.',
  privacyText: 'Your data is 100% safe. We never share your information.',
  ctaText: 'Get Instant Itinerary',
  formTitle: 'Get Your Free Trek Guide',
  formSubtitle: 'Personalized itinerary sent to WhatsApp',
};

// Hero section content
export const HERO_CONTENT = {
  badge: 'Now booking for 2025 season',
  headline: 'Get Your Custom Himalayan Trek Itinerary',
  subheadline: 'Free personalized trek guide with day-by-day plan, packing list & budget breakdown — sent instantly to WhatsApp',
  stats: [
    { value: '50+', label: 'Trek Routes' },
    { value: '10k+', label: 'Happy Trekkers' },
    { value: '15+', label: 'Expert Guides' },
    { value: '8+', label: 'Years Experience' },
  ],
  testimonial: {
    quote: 'Best trekking experience of my life! The guides were amazing.',
    author: 'Priya S.',
    trek: 'Kedarkantha Trek',
  },
};

