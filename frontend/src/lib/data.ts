// ============================================
// Mock Data for Development
// Replace with API calls in production
// ============================================

import type { Trek, Testimonial, Guide, Office, Expedition, BlogPost } from './types';

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
    role: 'Software Engineer',
    location: 'Bangalore',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    testimonial: 'The Kedarkantha trek was absolutely magical! The guides were professional, the food was great, and the views were breathtaking. This was my first trek and I couldn\'t have asked for a better experience.',
    trek_name: 'Kedarkantha Trek',
    rating: 5,
    verified: true,
    tags: ['Great Guides', 'Amazing Views', 'Beginner Friendly'],
    helpful_count: 24,
    date: '2024-12-15',
    featured: true,
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Marketing Manager',
    location: 'Mumbai',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    testimonial: 'Global Events Travels made my dream of trekking in the Himalayas come true. Their attention to safety and the beautiful campsites made this an unforgettable adventure.',
    trek_name: 'Hampta Pass Trek',
    rating: 5,
    verified: true,
    tags: ['Safety First', 'Beautiful Camps', 'Well Organized'],
    helpful_count: 18,
    date: '2024-11-20',
    featured: true,
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Doctor',
    location: 'Delhi',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    testimonial: 'I\'ve done multiple treks with this team and every time they exceed expectations. The Valley of Flowers was like walking through paradise. Highly recommend!',
    trek_name: 'Valley of Flowers',
    rating: 5,
    verified: true,
    tags: ['Amazing Views', 'Repeat Customer', 'Paradise'],
    helpful_count: 31,
    date: '2024-09-10',
    featured: true,
  },
  {
    id: 4,
    name: 'Vikash Kumar',
    role: 'IT Professional',
    location: 'Chennai',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    testimonial: 'Did the Brahmatal trek in winter and it was surreal. Walking on frozen lakes with snow-capped peaks all around - absolutely worth it. The team ensured we were safe throughout.',
    trek_name: 'Brahmatal Trek',
    rating: 5,
    verified: true,
    tags: ['Winter Trek', 'Frozen Lakes', 'Safe'],
    helpful_count: 15,
    date: '2024-02-05',
    featured: false,
  },
  {
    id: 5,
    name: 'Sneha Reddy',
    role: 'Content Creator',
    location: 'Hyderabad',
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    testimonial: 'As a solo female traveler, I was initially nervous. But the team made me feel completely safe and welcome. Met amazing fellow trekkers and created memories for a lifetime!',
    trek_name: 'Kedarkantha Trek',
    rating: 4,
    verified: true,
    tags: ['Solo Friendly', 'Women Safety', 'Community'],
    helpful_count: 42,
    date: '2024-01-18',
    featured: false,
  },
  {
    id: 6,
    name: 'Arjun Nair',
    role: 'Entrepreneur',
    location: 'Kochi',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    testimonial: 'The Roopkund trek pushed my limits in the best way possible. Challenging but incredibly rewarding. The skeleton lake was eerie yet fascinating. Expert guides made all the difference.',
    trek_name: 'Roopkund Trek',
    rating: 5,
    verified: true,
    tags: ['Challenging', 'Expert Guides', 'Bucket List'],
    helpful_count: 28,
    date: '2024-10-08',
    featured: false,
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

// ============================================
// Office Locations Data
// ============================================

export const OFFICES: Office[] = [
  {
    id: 1,
    name: 'Himachal Office (HQ)',
    address: "Global Camp's by Global Events Travels, Aleo road petrol pump near Chandarmaki Cottage, NSB Hotel",
    city: 'Manali',
    state: 'Himachal Pradesh',
    pincode: '175131',
    landmarks: 'Near Aleo Road Petrol Pump, NSB Hotel',
    phone: '+91 98765 43210',
    email: 'himachal@globaleventstravels.com',
    coordinates: { lat: 32.2299, lng: 77.1889 },
    mapUrl: 'https://maps.google.com/?q=32.2299,77.1889',
    image: '/images/offices/manali.jpg',
  },
  {
    id: 2,
    name: 'Chennai Office',
    address: '306, 1st Main Road, MKB Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600039',
    phone: '+91 98765 43211',
    email: 'chennai@globaleventstravels.com',
    coordinates: { lat: 13.1175, lng: 80.1434 },
    mapUrl: 'https://maps.google.com/?q=13.1175,80.1434',
    image: '/images/offices/chennai.jpg',
  },
  {
    id: 3,
    name: 'Kasol Office',
    address: "Casanova Camp's Choj Bridge, Near Bus Stand, Manikaran Road, Near Volvo",
    city: 'Kasol, Sosan',
    state: 'Himachal Pradesh',
    pincode: '175101',
    landmarks: 'Choj Bridge, Near Volvo Bus Stand',
    phone: '+91 98765 43212',
    email: 'kasol@globaleventstravels.com',
    coordinates: { lat: 32.0167, lng: 77.3167 },
    mapUrl: 'https://maps.google.com/?q=32.0167,77.3167',
    image: '/images/offices/kasol.jpg',
  },
  {
    id: 4,
    name: 'Dehradun Office',
    address: 'Kugiyal Niwas, Vimal Kumar Singh, Ganesh Vihar Lane 6, Mata Mandir Road, Near Kukreja Institute, Ajabpur Kalan',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '248001',
    landmarks: 'Near Kukreja Institute, Mata Mandir Road',
    phone: '+91 98765 43213',
    email: 'dehradun@globaleventstravels.com',
    coordinates: { lat: 30.2871, lng: 78.0211 },
    mapUrl: 'https://maps.google.com/?q=30.2871,78.0211',
    image: '/images/offices/dehradun.jpg',
  },
];

// ============================================
// Expeditions Data
// ============================================

export const EXPEDITIONS: Expedition[] = [
  {
    id: 1,
    name: 'Black Peak Expedition',
    slug: 'black-peak',
    difficulty: 'expert',
    duration: 12,
    summitAltitude: 6387,
    baseAltitude: 3800,
    location: 'Gangotri, Uttarakhand',
    region: 'Garhwal Himalayas',
    description: 'Black Peak (Kalanag) is one of the most challenging and rewarding peaks in the Indian Himalayas. Standing at 6,387 meters, it offers a true mountaineering experience with technical climbing, crevasse crossings, and stunning views of the Gangotri glacier range. This expedition is perfect for experienced trekkers looking to step into high-altitude mountaineering.',
    shortDescription: 'A challenging 6,387m summit expedition in the Garhwal Himalayas with technical climbing and glacier crossings.',
    highlights: [
      'Summit at 6,387 meters - one of India\'s highest climbable peaks',
      'Technical climbing experience with rope work and ice craft',
      'Stunning views of Gangotri glacier and surrounding peaks',
      'Acclimatization at scenic high-altitude camps',
      'Certificate of achievement upon successful summit',
    ],
    requirements: {
      experience: 'Minimum 2 high-altitude treks (above 4,500m) completed',
      fitnessLevel: 'Excellent cardiovascular fitness, ability to carry 15kg pack',
      technicalSkills: ['Basic rope work', 'Crampon walking', 'Ice axe usage'],
    },
    itinerary: [
      { day: 1, title: 'Arrive Dehradun', description: 'Arrive at Dehradun. Team briefing and equipment check.', altitude: 640, activities: ['Team meeting', 'Equipment check', 'Briefing'] },
      { day: 2, title: 'Drive to Gangotri', description: 'Scenic drive along the Bhagirathi river to Gangotri.', altitude: 3048, activities: ['Drive', 'Acclimatization walk'] },
      { day: 3, title: 'Trek to Bhojwasa', description: 'Trek through beautiful pine forests to Bhojwasa.', altitude: 3792, activities: ['Trekking', 'Camping'] },
      { day: 4, title: 'Trek to Gaumukh & Tapovan', description: 'Visit Gaumukh glacier source and trek to Tapovan meadows.', altitude: 4463, activities: ['Glacier visit', 'Meadow camping'] },
      { day: 5, title: 'Acclimatization at Tapovan', description: 'Rest day for acclimatization with short hikes.', altitude: 4463, activities: ['Rest', 'Acclimatization hikes'] },
      { day: 6, title: 'Trek to Nandanvan', description: 'Trek across Gangotri glacier to Nandanvan base.', altitude: 4500, activities: ['Glacier crossing', 'Camping'] },
      { day: 7, title: 'Advance Base Camp', description: 'Establish advance base camp closer to Black Peak.', altitude: 5200, activities: ['Load ferry', 'Camp setup'] },
      { day: 8, title: 'Training Day', description: 'Technical training - rope work, crampon, ice axe.', altitude: 5200, activities: ['Technical training', 'Practice climbs'] },
      { day: 9, title: 'Summit Camp', description: 'Move to summit camp with essential gear.', altitude: 5800, activities: ['High camp', 'Rest'] },
      { day: 10, title: 'Summit Day', description: 'Early morning summit push to Black Peak (6,387m).', altitude: 6387, activities: ['Summit attempt', 'Descent to ABC'] },
      { day: 11, title: 'Descend to Tapovan', description: 'Descend back to Tapovan for celebration.', altitude: 4463, activities: ['Descent', 'Celebration'] },
      { day: 12, title: 'Return to Gangotri', description: 'Trek back to Gangotri and drive to Dehradun.', altitude: 640, activities: ['Trek', 'Drive', 'Departure'] },
    ],
    equipment: {
      provided: [
        'Mountaineering boots (if needed)',
        'Crampons and ice axe',
        'Climbing harness and helmet',
        'Ropes and carabiners',
        'High altitude tents',
        'Sleeping bags (-20°C rated)',
        'Kitchen equipment and food',
        'First aid and emergency oxygen',
      ],
      personal: [
        'Layered clothing (base, mid, outer)',
        'Down jacket',
        'Trekking poles',
        'Sunglasses and sunscreen',
        'Personal medications',
        'Headlamp with extra batteries',
        'Water bottles and hydration system',
        'Personal toiletries',
      ],
    },
    price: 65000,
    groupSize: { min: 4, max: 12 },
    season: ['May', 'June', 'September', 'October'],
    successRate: 72,
    image: '/images/expeditions/black-peak.jpg',
    gallery: [
      '/images/expeditions/black-peak-1.jpg',
      '/images/expeditions/black-peak-2.jpg',
      '/images/expeditions/black-peak-3.jpg',
    ],
    safetyInfo: 'This expedition includes trained guides, emergency oxygen, satellite communication, and evacuation protocols. All climbers must have travel insurance covering high-altitude mountaineering.',
    rating: 4.7,
    reviewCount: 23,
    featured: true,
  },
  {
    id: 2,
    name: 'Friendship Peak Expedition',
    slug: 'friendship-peak',
    difficulty: 'advanced',
    duration: 8,
    summitAltitude: 5289,
    baseAltitude: 3500,
    location: 'Manali, Himachal Pradesh',
    region: 'Pir Panjal Range',
    description: 'Friendship Peak is the perfect introduction to high-altitude mountaineering. At 5,289 meters, it offers a challenging yet achievable summit with technical sections that teach essential climbing skills. Located near Manali, it\'s easily accessible and provides stunning views of the Pir Panjal range and the Solang Valley.',
    shortDescription: 'An ideal first summit at 5,289m near Manali - perfect introduction to Himalayan mountaineering.',
    highlights: [
      'Perfect first summit for aspiring mountaineers',
      'Technical training included - ice craft and rope work',
      'Stunning 360° views from the summit',
      'Beautiful base camp at Lady Leg meadow',
      'Easy access from Manali',
      'Certificate and summit photo',
    ],
    requirements: {
      experience: 'At least one high-altitude trek (above 4,000m) recommended',
      fitnessLevel: 'Good cardiovascular fitness, regular exercise routine',
      technicalSkills: ['None required - training provided'],
    },
    itinerary: [
      { day: 1, title: 'Arrive Manali', description: 'Arrive at Manali. Team briefing at base hotel.', altitude: 2050, activities: ['Team meeting', 'Briefing', 'Gear check'] },
      { day: 2, title: 'Drive to Solang & Trek to Dhundi', description: 'Short drive to Solang, then trek to Dhundi camp.', altitude: 2850, activities: ['Drive', 'Trek', 'Camping'] },
      { day: 3, title: 'Trek to Lady Leg Base Camp', description: 'Trek through beautiful meadows to Lady Leg.', altitude: 3500, activities: ['Trekking', 'Acclimatization'] },
      { day: 4, title: 'Training Day', description: 'Technical training - crampon walking, ice axe arrest, rope techniques.', altitude: 3500, activities: ['Training', 'Practice'] },
      { day: 5, title: 'Advance Camp', description: 'Move to advance camp below the glacier.', altitude: 4200, activities: ['Trek', 'Camp setup'] },
      { day: 6, title: 'Summit Day', description: 'Early morning summit push. Return to Lady Leg.', altitude: 5289, activities: ['Summit', 'Descent', 'Celebration'] },
      { day: 7, title: 'Descend to Dhundi', description: 'Trek back to Dhundi camp.', altitude: 2850, activities: ['Descent', 'Rest'] },
      { day: 8, title: 'Return to Manali', description: 'Trek to Solang and drive back to Manali.', altitude: 2050, activities: ['Trek', 'Drive', 'Departure'] },
    ],
    equipment: {
      provided: [
        'Mountaineering boots',
        'Crampons and ice axe',
        'Climbing harness',
        'Helmet',
        'Ropes and safety gear',
        'High altitude tents',
        'Sleeping bags',
        'All meals during trek',
      ],
      personal: [
        'Warm clothing layers',
        'Down/synthetic jacket',
        'Gloves (inner and outer)',
        'Balaclava or face cover',
        'Sunglasses',
        'Sunscreen SPF 50+',
        'Personal medications',
        'Daypack',
      ],
    },
    price: 28000,
    groupSize: { min: 4, max: 15 },
    season: ['April', 'May', 'June', 'September', 'October'],
    successRate: 85,
    image: '/images/expeditions/friendship-peak.jpg',
    gallery: [
      '/images/expeditions/friendship-peak-1.jpg',
      '/images/expeditions/friendship-peak-2.jpg',
    ],
    safetyInfo: 'Includes certified guides, emergency evacuation plan, first aid kit, and weather monitoring. Suitable for fit individuals with some trekking experience.',
    rating: 4.9,
    reviewCount: 67,
    featured: true,
  },
];

// ============================================
// Utility Functions
// ============================================

// Trek utilities
export const getFeaturedTreks = () => MOCK_TREKS.filter(trek => trek.featured);
export const getTrekBySlug = (slug: string) => MOCK_TREKS.find(trek => trek.slug === slug);
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

// Testimonial utilities
export const getFeaturedTestimonials = () => MOCK_TESTIMONIALS.filter(t => t.featured);
export const getTestimonialsByTrek = (trekName: string) => 
  MOCK_TESTIMONIALS.filter(t => t.trek_name === trekName);

// Expedition utilities
export const getFeaturedExpeditions = () => EXPEDITIONS.filter(e => e.featured);
export const getExpeditionBySlug = (slug: string) => EXPEDITIONS.find(e => e.slug === slug);

// Office utilities
export const getOfficeByCity = (city: string) => OFFICES.find(o => o.city.toLowerCase().includes(city.toLowerCase()));

// ============================================
// Blog Posts Data
// ============================================

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: '13 Best Summer Treks in India for 2025',
    slug: 'best-summer-treks-india-2025',
    excerpt: 'Discover the most breathtaking summer treks in India. From the Valley of Flowers to Hampta Pass, find your perfect adventure for the 2025 trekking season.',
    content: `
# 13 Best Summer Treks in India for 2025

Summer in India (April to June) is the perfect time to escape the scorching plains and head to the cool mountains. Here are our top picks for summer treks that offer stunning views, manageable weather, and unforgettable experiences.

## 1. Valley of Flowers Trek, Uttarakhand

The Valley of Flowers is a UNESCO World Heritage Site that comes alive with over 600 species of wildflowers during summer. This moderate trek takes you through alpine meadows carpeted with vibrant blooms.

**Best Time:** July - September
**Duration:** 6 Days
**Difficulty:** Moderate

## 2. Hampta Pass Trek, Himachal Pradesh

One of the most dramatic crossover treks, Hampta Pass takes you from lush green valleys to barren moonscapes in just 5 days. The contrast is breathtaking!

**Best Time:** June - October
**Duration:** 5 Days
**Difficulty:** Moderate

## 3. Rupin Pass Trek

For those seeking adventure, Rupin Pass offers hanging villages, dramatic waterfalls, and a challenging climb to 15,250 ft.

**Best Time:** May - June, September - October
**Duration:** 8 Days
**Difficulty:** Difficult

... Continue reading for all 13 treks with detailed information on difficulty, best time to visit, and what makes each trek special.
    `,
    author: {
      name: 'Rajesh Kumar',
      avatar: '/images/team/rajesh.jpg',
      bio: 'Senior Trek Leader with 15+ years of Himalayan experience',
      role: 'Head Guide',
    },
    publishDate: '2024-12-20',
    featuredImage: '/images/blog/summer-treks.jpg',
    category: 'season-guide',
    tags: ['Summer Treks', 'India', '2025', 'Best Treks', 'Himalayas'],
    readTime: 12,
    featured: true,
    metaDescription: 'Complete guide to the 13 best summer treks in India for 2025. Find difficulty levels, best times, and expert tips.',
  },
  {
    id: 2,
    title: 'Complete Guide: Kasol to Kheerganga Trek for Beginners',
    slug: 'kasol-kheerganga-trek-beginners-guide',
    excerpt: 'Everything you need to know about the famous Kasol to Kheerganga trek. Perfect for first-time trekkers looking for an easy yet rewarding Himalayan experience.',
    content: `
# Complete Guide: Kasol to Kheerganga Trek for Beginners

The Kasol to Kheerganga trek is one of the most popular beginner-friendly treks in Himachal Pradesh. Known for its natural hot springs at the top and the vibrant backpacker culture of Kasol, this trek is perfect for first-timers.

## Trek Overview

- **Starting Point:** Barshaini (accessible from Kasol)
- **End Point:** Kheerganga
- **Distance:** 12-13 km one way
- **Duration:** 1-2 days
- **Altitude:** 2,960 meters
- **Difficulty:** Easy to Moderate

## Day-by-Day Itinerary

### Day 1: Kasol to Barshaini to Kheerganga
Start early from Kasol and take a shared taxi to Barshaini. The trek begins from here...

## What to Pack

- Comfortable trekking shoes
- Light backpack (if camping) or just essentials (if staying at camps)
- Water bottle
- Snacks
- Rain jacket
- Warm layers for evening

## Cost Breakdown

| Item | Cost (INR) |
|------|------------|
| Shared taxi from Kasol to Barshaini | 50-100 |
| Trek guide (optional) | 500-1000 |
| Accommodation at camps | 200-500 |
| Meals | 300-500 |
| **Total Budget** | **1,000 - 2,000** |

This is one of the most budget-friendly treks in India!
    `,
    author: {
      name: 'Deepa Negi',
      avatar: '/images/team/deepa.jpg',
      bio: 'Passionate about making trekking accessible to everyone',
      role: 'Trek Leader',
    },
    publishDate: '2024-12-15',
    featuredImage: '/images/blog/kheerganga.jpg',
    category: 'trek-guide',
    tags: ['Kheerganga', 'Kasol', 'Beginners', 'Budget Trek', 'Himachal'],
    readTime: 8,
    featured: true,
    metaDescription: 'Complete beginner guide to Kasol Kheerganga trek. Includes itinerary, cost breakdown, packing list, and expert tips.',
  },
  {
    id: 3,
    title: 'Essential Trekking Gear: What to Pack for Himalayan Treks',
    slug: 'essential-trekking-gear-himalayan-treks',
    excerpt: 'A comprehensive packing guide for Himalayan treks. Learn what gear is essential, what to skip, and how to pack light without compromising safety.',
    content: `
# Essential Trekking Gear: What to Pack for Himalayan Treks

Packing for a Himalayan trek can be overwhelming. Pack too much and you'll struggle with weight; pack too little and you'll be uncomfortable or unsafe. Here's our definitive guide.

## The Essentials Checklist

### Clothing
- **Base Layer:** Moisture-wicking thermal top and bottom
- **Mid Layer:** Fleece jacket
- **Outer Layer:** Waterproof jacket and pants
- **Trekking Pants:** Quick-dry, comfortable
- **Warm Hat & Gloves:** Even in summer at high altitude

### Footwear
- **Trekking Boots:** Ankle support, waterproof, broken-in
- **Sandals:** For camp
- **Socks:** Wool or synthetic, 3-4 pairs

### Gear
- **Backpack:** 40-60L with rain cover
- **Sleeping Bag:** Rated for expected temperatures
- **Trekking Poles:** Highly recommended
- **Headlamp:** With extra batteries

## What NOT to Pack

- Heavy jeans (cotton is terrible for trekking)
- Multiple gadgets
- Full-size toiletries
- Too many "just in case" items
    `,
    author: {
      name: 'Vikram Singh',
      avatar: '/images/team/vikram.jpg',
      bio: 'Certified mountaineer and gear expert',
      role: 'Expedition Leader',
    },
    publishDate: '2024-12-10',
    featuredImage: '/images/blog/trekking-gear.jpg',
    category: 'gear-review',
    tags: ['Gear', 'Packing', 'Equipment', 'Tips', 'Preparation'],
    readTime: 10,
    featured: false,
    metaDescription: 'Complete packing guide for Himalayan treks. Essential gear list, what to skip, and expert packing tips.',
  },
  {
    id: 4,
    title: 'Altitude Sickness: Prevention, Symptoms & Treatment',
    slug: 'altitude-sickness-prevention-symptoms-treatment',
    excerpt: 'Everything trekkers need to know about altitude sickness (AMS). Learn how to prevent it, recognize symptoms early, and what to do if it strikes.',
    content: `
# Altitude Sickness: Prevention, Symptoms & Treatment

Altitude sickness, or Acute Mountain Sickness (AMS), is a common concern for Himalayan trekkers. Understanding it can be the difference between a successful summit and a medical emergency.

## What is Altitude Sickness?

AMS occurs when you ascend to high altitudes faster than your body can adjust. Above 2,500m, the air has less oxygen, and your body needs time to acclimatize.

## Symptoms to Watch For

### Mild AMS
- Headache
- Nausea
- Fatigue
- Dizziness
- Loss of appetite

### Severe AMS (Seek Help Immediately)
- Confusion
- Difficulty walking
- Shortness of breath at rest
- Persistent vomiting

## Prevention Tips

1. **Ascend Gradually:** Follow the "climb high, sleep low" principle
2. **Stay Hydrated:** Drink 3-4 liters daily
3. **Avoid Alcohol:** Especially first few days at altitude
4. **Listen to Your Body:** Don't push through symptoms
5. **Acclimatization Days:** Build rest days into your itinerary

## Treatment

The only cure for AMS is descent. If symptoms are severe, descend immediately.
    `,
    author: {
      name: 'Dr. Ananya Patel',
      avatar: '/images/team/ananya.jpg',
      bio: 'Trek doctor and wilderness medicine specialist',
      role: 'Medical Advisor',
    },
    publishDate: '2024-12-05',
    featuredImage: '/images/blog/altitude-sickness.jpg',
    category: 'safety',
    tags: ['Safety', 'Altitude Sickness', 'AMS', 'Health', 'Prevention'],
    readTime: 7,
    featured: true,
    metaDescription: 'Complete guide to altitude sickness for trekkers. Prevention tips, symptoms to watch, and treatment options.',
  },
  {
    id: 5,
    title: 'Budget Trekking: How to Trek in India Under ₹10,000',
    slug: 'budget-trekking-india-under-10000',
    excerpt: 'Yes, you can trek in the Himalayas on a budget! Here are our top tips for experiencing incredible treks without breaking the bank.',
    content: `
# Budget Trekking: How to Trek in India Under ₹10,000

Think Himalayan trekking is expensive? Think again! With smart planning, you can experience breathtaking trails for under ₹10,000 including travel.

## Budget-Friendly Treks

### 1. Triund Trek (Dharamshala)
- **Cost:** ₹2,000-3,000
- **Duration:** 1-2 days
- **What's included:** Transport, food, basic camping

### 2. Kheerganga Trek (Kasol)
- **Cost:** ₹2,000-4,000
- **Duration:** 2 days
- **What's included:** Everything!

### 3. Nag Tibba Trek (Uttarakhand)
- **Cost:** ₹4,000-6,000
- **Duration:** 2-3 days
- **What's included:** Organized trek with meals

## Money-Saving Tips

1. **Travel by Bus:** Save 50-70% compared to flights
2. **Go in Groups:** Share transport and guide costs
3. **Carry Your Own Snacks:** Trail food is expensive
4. **Off-Season Travel:** April and November have lower prices
5. **Book Directly:** Avoid middlemen and aggregators
    `,
    author: {
      name: 'Rahul Verma',
      avatar: '/images/team/rahul.jpg',
      bio: 'Budget travel enthusiast and trek blogger',
      role: 'Content Writer',
    },
    publishDate: '2024-11-28',
    featuredImage: '/images/blog/budget-trekking.jpg',
    category: 'budget-tips',
    tags: ['Budget', 'Cheap Treks', 'Money Saving', 'India', 'Tips'],
    readTime: 6,
    featured: false,
    metaDescription: 'Complete guide to budget trekking in India. Trek in the Himalayas for under ₹10,000 with these expert tips.',
  },
  {
    id: 6,
    title: 'Kedarkantha Trek: Complete Winter Trekking Guide',
    slug: 'kedarkantha-trek-winter-guide',
    excerpt: 'The ultimate guide to Kedarkantha, India\'s most popular winter trek. Everything from preparation to summit day, with insider tips.',
    content: `
# Kedarkantha Trek: Complete Winter Trekking Guide

Kedarkantha is often called the "Queen of Winter Treks" in India. With pristine snow trails, 360-degree summit views, and a relatively easy grade, it's perfect for beginners experiencing their first snow trek.

## Why Kedarkantha?

- **Stunning Snow:** Guaranteed snow from December to March
- **360° Summit Views:** See dozens of Himalayan peaks
- **Beginner-Friendly:** Easy to moderate difficulty
- **Short Duration:** Just 6 days from Delhi

## Trek Details

| Parameter | Details |
|-----------|---------|
| Altitude | 12,500 ft (3,810m) |
| Distance | 20 km total |
| Duration | 6 days |
| Best Time | December - March |
| Difficulty | Easy to Moderate |

## Day-by-Day Itinerary

### Day 1: Dehradun to Sankri
Drive through scenic Mussoorie and Purola to reach Sankri village.

### Day 2: Sankri to Juda Ka Talab
Trek through oak and pine forests to the beautiful frozen lake.

### Day 3: Juda Ka Talab to Kedarkantha Base
Short trek to base camp with stunning views opening up.

### Day 4: Summit Day!
Start at 3 AM for sunrise at the summit. Descend to Hargaon.

### Day 5: Buffer Day
Extra day for weather contingency.

### Day 6: Return to Dehradun
Trek down and drive back.
    `,
    author: {
      name: 'Rajesh Kumar',
      avatar: '/images/team/rajesh.jpg',
      bio: 'Senior Trek Leader with 15+ years of Himalayan experience',
      role: 'Head Guide',
    },
    publishDate: '2024-11-20',
    featuredImage: '/images/blog/kedarkantha.jpg',
    category: 'trek-guide',
    tags: ['Kedarkantha', 'Winter Trek', 'Snow Trek', 'Uttarakhand', 'Beginners'],
    readTime: 15,
    featured: true,
    metaDescription: 'Complete Kedarkantha trek guide. Itinerary, best time, difficulty, and expert tips for India\'s best winter trek.',
  },
  {
    id: 7,
    title: 'Best Time to Visit Ladakh: Month-by-Month Guide',
    slug: 'best-time-visit-ladakh-monthly-guide',
    excerpt: 'Planning a Ladakh trip? This month-by-month guide helps you choose the perfect time based on weather, crowds, and activities.',
    content: `
# Best Time to Visit Ladakh: Month-by-Month Guide

Ladakh's extreme climate means timing is everything. Here's what to expect each month.

## Quick Overview

| Month | Weather | Crowds | Best For |
|-------|---------|--------|----------|
| Jan-Feb | Extreme cold (-20°C) | None | Chadar Trek |
| Mar-Apr | Cold, melting snow | Low | Early season |
| May-Jun | Pleasant, clear | Medium | Trekking, driving |
| Jul-Aug | Warm, monsoon elsewhere | High | Peak season |
| Sep-Oct | Cool, clear | Medium | Photography, festivals |
| Nov-Dec | Cold, closing down | Very Low | Solitude |

## Best Months: June - September

This is peak season for good reason:
- All roads open
- Pleasant temperatures
- Maximum activities available
- Festivals like Hemis

## Winter: Only for the Brave

The famous Chadar Trek (frozen river) happens in January-February. Not for casual tourists!
    `,
    author: {
      name: 'Vikram Singh',
      avatar: '/images/team/vikram.jpg',
      bio: 'Certified mountaineer and Ladakh specialist',
      role: 'Expedition Leader',
    },
    publishDate: '2024-11-15',
    featuredImage: '/images/blog/ladakh-guide.jpg',
    category: 'destination',
    tags: ['Ladakh', 'Best Time', 'Travel Guide', 'Planning', 'Weather'],
    readTime: 9,
    featured: false,
    metaDescription: 'Month-by-month guide to visiting Ladakh. Find the best time based on weather, crowds, and your travel goals.',
  },
  {
    id: 8,
    title: 'Solo Trekking in India: Safety Tips for Solo Travelers',
    slug: 'solo-trekking-india-safety-tips',
    excerpt: 'Want to trek solo in the Himalayas? Here\'s everything you need to know about staying safe while enjoying the freedom of solo adventure.',
    content: `
# Solo Trekking in India: Safety Tips for Solo Travelers

Solo trekking offers unmatched freedom, but it comes with responsibilities. Here's how to stay safe while enjoying the mountains alone.

## Is Solo Trekking Safe in India?

The short answer: It depends. Popular trails like Triund or Kheerganga are generally safe. Remote high-altitude treks? Join a group.

## Essential Safety Tips

### Before You Go
1. **Share Your Itinerary:** Tell family/friends your exact plan
2. **Research Thoroughly:** Know the trail, weather, and emergency contacts
3. **Check Weather:** Mountain weather changes fast
4. **Get Insurance:** Evacuation coverage is essential

### On the Trail
1. **Start Early:** More daylight = safer
2. **Stay on Marked Trails:** Getting lost is the #1 danger
3. **Trust Your Instincts:** If something feels wrong, turn back
4. **Keep Your Phone Charged:** Carry a power bank
5. **Make Friends:** Chat with fellow trekkers on popular trails

### Emergency Preparedness
- Carry a first aid kit
- Know basic navigation (compass/GPS)
- Have emergency contact numbers saved offline
- Carry emergency shelter (space blanket)

## Recommended Solo Treks

1. Triund (Easy, crowded, safe)
2. Kheerganga (Easy, popular)
3. Nag Tibba (Moderate, local guides available)
4. Prashar Lake (Easy, day trek possible)
    `,
    author: {
      name: 'Deepa Negi',
      avatar: '/images/team/deepa.jpg',
      bio: 'Passionate about empowering solo travelers',
      role: 'Trek Leader',
    },
    publishDate: '2024-11-10',
    featuredImage: '/images/blog/solo-trekking.jpg',
    category: 'safety',
    tags: ['Solo Travel', 'Safety', 'Tips', 'Women Travelers', 'India'],
    readTime: 8,
    featured: false,
    metaDescription: 'Complete safety guide for solo trekking in India. Tips for staying safe while enjoying the freedom of solo adventure.',
  },
];

// Blog utilities
export const getFeaturedPosts = () => BLOG_POSTS.filter(post => post.featured);
export const getPostBySlug = (slug: string) => BLOG_POSTS.find(post => post.slug === slug);
export const getPostsByCategory = (category: string) => 
  BLOG_POSTS.filter(post => post.category === category);
export const getPostsByTag = (tag: string) => 
  BLOG_POSTS.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
export const getRecentPosts = (limit: number = 5) => 
  [...BLOG_POSTS].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, limit);
export const getRelatedPosts = (currentSlug: string, limit: number = 3) => {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];
  return BLOG_POSTS
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category || 
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
};

// Blog categories for filtering
export const BLOG_CATEGORIES = [
  { value: 'trek-guide', label: 'Trek Guides', icon: '🥾' },
  { value: 'budget-tips', label: 'Budget Tips', icon: '💰' },
  { value: 'destination', label: 'Destinations', icon: '📍' },
  { value: 'gear-review', label: 'Gear Reviews', icon: '🎒' },
  { value: 'safety', label: 'Safety', icon: '⛑️' },
  { value: 'season-guide', label: 'Season Guides', icon: '📅' },
  { value: 'travel-tips', label: 'Travel Tips', icon: '✈️' },
];

