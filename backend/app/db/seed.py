"""
Database seeding script.
Populates the database with initial data from frontend mock data.
"""
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.db.models import (
    Trek, TrekImage, ItineraryDay,
    Expedition, ExpeditionDay,
    Guide, Testimonial, Office,
    BlogPost, BlogAuthor, User
)
from app.core.security import get_password_hash


def seed_guides(db: Session):
    """Seed guide data."""
    guides_data = [
        {
            "name": "Rajesh Kumar",
            "bio": "Born and raised in the mountains of Uttarakhand, Rajesh has been leading treks for over 15 years. His deep knowledge of local terrain and culture makes every trek special.",
            "experience_years": 15,
            "profile_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
            "specializations": ["High Altitude", "Winter Treks", "Photography Tours"],
            "rating": 4.9,
        },
        {
            "name": "Vikram Singh",
            "bio": "A certified mountaineer with experience on some of the world's highest peaks. Vikram brings technical expertise and a calm demeanor to challenging expeditions.",
            "experience_years": 12,
            "profile_image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
            "specializations": ["Technical Climbing", "Expedition Leadership", "First Aid"],
            "rating": 4.8,
        },
        {
            "name": "Deepa Negi",
            "bio": "One of the few female trek leaders in the region, Deepa is passionate about making trekking accessible to everyone. Her encouraging nature helps first-timers feel confident.",
            "experience_years": 8,
            "profile_image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300",
            "specializations": ["Beginner Friendly", "Women-Only Groups", "Nature Education"],
            "rating": 4.9,
        },
    ]
    
    for guide_data in guides_data:
        existing = db.query(Guide).filter(Guide.name == guide_data["name"]).first()
        if not existing:
            guide = Guide(**guide_data)
            db.add(guide)
    db.commit()
    print(f"✓ Seeded {len(guides_data)} guides")


def seed_treks(db: Session):
    """Seed trek data."""
    treks_data = [
        {
            "name": "Hampta Pass Trek",
            "slug": "hampta-pass",
            "difficulty": "moderate",
            "duration": 5,
            "price": 12999,
            "season": ["May", "June", "September", "October"],
            "elevation": 4270,
            "distance": 35,
            "description": "One of the most dramatic crossovers in the Himalayas, Hampta Pass takes you from the lush green valleys of Kullu to the barren landscapes of Lahaul.",
            "short_description": "Cross from lush Kullu valley to barren Lahaul desert in this dramatic Himalayan crossover trek.",
            "image": "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800",
            "rating": 4.8,
            "review_count": 124,
            "featured": True,
        },
        {
            "name": "Kedarkantha Trek",
            "slug": "kedarkantha",
            "difficulty": "easy",
            "duration": 6,
            "price": 9999,
            "season": ["December", "January", "February", "March"],
            "elevation": 3810,
            "distance": 20,
            "description": "Perfect winter trek with stunning snow-covered trails and panoramic views of Himalayan peaks.",
            "short_description": "A perfect winter trek with pristine snow trails and 360-degree summit views.",
            "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
            "rating": 4.9,
            "review_count": 256,
            "featured": True,
        },
        {
            "name": "Valley of Flowers",
            "slug": "valley-of-flowers",
            "difficulty": "moderate",
            "duration": 6,
            "price": 14999,
            "season": ["July", "August", "September"],
            "elevation": 3658,
            "distance": 38,
            "description": "UNESCO World Heritage Site featuring over 600 species of exotic flowers blooming in the monsoon.",
            "short_description": "Walk through a UNESCO World Heritage Site carpeted with exotic Himalayan flowers.",
            "image": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800",
            "rating": 4.7,
            "review_count": 89,
            "featured": True,
        },
        {
            "name": "Roopkund Trek",
            "slug": "roopkund",
            "difficulty": "hard",
            "duration": 8,
            "price": 18999,
            "season": ["May", "June", "September", "October"],
            "elevation": 5029,
            "distance": 53,
            "description": "The mysterious skeleton lake trek - one of the most challenging and rewarding treks in India.",
            "short_description": "Trek to the mysterious skeleton lake at 5,029m - a challenging high-altitude adventure.",
            "image": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800",
            "rating": 4.6,
            "review_count": 67,
            "featured": False,
        },
        {
            "name": "Sar Pass Trek",
            "slug": "sar-pass",
            "difficulty": "moderate",
            "duration": 5,
            "price": 11999,
            "season": ["April", "May", "June"],
            "elevation": 4200,
            "distance": 48,
            "description": "Experience thrilling snow slides and stunning meadows on this classic Himalayan trek from Kasol.",
            "short_description": "Classic trek from Kasol featuring snow slides, alpine meadows, and stunning vistas.",
            "image": "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800",
            "rating": 4.5,
            "review_count": 98,
            "featured": False,
        },
        {
            "name": "Brahmatal Trek",
            "slug": "brahmatal",
            "difficulty": "moderate",
            "duration": 6,
            "price": 10999,
            "season": ["December", "January", "February", "March"],
            "elevation": 3425,
            "distance": 24,
            "description": "A winter wonderland trek with frozen lakes and spectacular views of Mt. Trishul and Nanda Ghunti.",
            "short_description": "Winter trek featuring frozen alpine lakes and views of majestic Himalayan peaks.",
            "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
            "rating": 4.8,
            "review_count": 112,
            "featured": True,
        },
    ]
    
    for trek_data in treks_data:
        existing = db.query(Trek).filter(Trek.slug == trek_data["slug"]).first()
        if not existing:
            trek = Trek(**trek_data)
            db.add(trek)
    db.commit()
    print(f"✓ Seeded {len(treks_data)} treks")


def seed_expeditions(db: Session):
    """Seed expedition data."""
    expeditions_data = [
        {
            "name": "Black Peak Expedition",
            "slug": "black-peak",
            "difficulty": "expert",
            "duration": 12,
            "summit_altitude": 6387,
            "base_altitude": 3800,
            "location": "Gangotri, Uttarakhand",
            "region": "Garhwal Himalayas",
            "description": "Black Peak (Kalanag) is one of the most challenging and rewarding peaks in the Indian Himalayas.",
            "short_description": "A challenging 6,387m summit expedition in the Garhwal Himalayas with technical climbing and glacier crossings.",
            "highlights": [
                "Summit at 6,387 meters",
                "Technical climbing experience",
                "Stunning views of Gangotri glacier",
                "Acclimatization at scenic camps",
                "Certificate of achievement",
            ],
            "requirements": {
                "experience": "Minimum 2 high-altitude treks (above 4,500m) completed",
                "fitnessLevel": "Excellent cardiovascular fitness",
                "technicalSkills": ["Basic rope work", "Crampon walking", "Ice axe usage"],
            },
            "equipment": {
                "provided": ["Mountaineering boots", "Crampons and ice axe", "Climbing harness", "Ropes"],
                "personal": ["Layered clothing", "Down jacket", "Trekking poles", "Sunglasses"],
            },
            "price": 65000,
            "group_size_min": 4,
            "group_size_max": 12,
            "season": ["May", "June", "September", "October"],
            "success_rate": 72,
            "image": "/images/expeditions/black-peak.jpg",
            "safety_info": "This expedition includes trained guides, emergency oxygen, and evacuation protocols.",
            "rating": 4.7,
            "review_count": 23,
            "featured": True,
        },
        {
            "name": "Friendship Peak Expedition",
            "slug": "friendship-peak",
            "difficulty": "advanced",
            "duration": 8,
            "summit_altitude": 5289,
            "base_altitude": 3500,
            "location": "Manali, Himachal Pradesh",
            "region": "Pir Panjal Range",
            "description": "Friendship Peak is the perfect introduction to high-altitude mountaineering.",
            "short_description": "An ideal first summit at 5,289m near Manali - perfect introduction to Himalayan mountaineering.",
            "highlights": [
                "Perfect first summit for aspiring mountaineers",
                "Technical training included",
                "Stunning 360° views from summit",
                "Beautiful base camp at Lady Leg meadow",
                "Easy access from Manali",
            ],
            "requirements": {
                "experience": "At least one high-altitude trek recommended",
                "fitnessLevel": "Good cardiovascular fitness",
                "technicalSkills": ["None required - training provided"],
            },
            "equipment": {
                "provided": ["Mountaineering boots", "Crampons and ice axe", "Climbing harness", "Helmet"],
                "personal": ["Warm clothing layers", "Down jacket", "Gloves", "Sunglasses"],
            },
            "price": 28000,
            "group_size_min": 4,
            "group_size_max": 15,
            "season": ["April", "May", "June", "September", "October"],
            "success_rate": 85,
            "image": "/images/expeditions/friendship-peak.jpg",
            "safety_info": "Includes certified guides, emergency evacuation plan, and first aid kit.",
            "rating": 4.9,
            "review_count": 67,
            "featured": True,
        },
    ]
    
    for exp_data in expeditions_data:
        existing = db.query(Expedition).filter(Expedition.slug == exp_data["slug"]).first()
        if not existing:
            expedition = Expedition(**exp_data)
            db.add(expedition)
    db.commit()
    print(f"✓ Seeded {len(expeditions_data)} expeditions")


def seed_testimonials(db: Session):
    """Seed testimonial data."""
    testimonials_data = [
        {
            "name": "Priya Sharma",
            "role": "Software Engineer",
            "location": "Bangalore",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "testimonial": "The Kedarkantha trek was absolutely magical! The guides were professional, the food was great, and the views were breathtaking.",
            "trek_name": "Kedarkantha Trek",
            "rating": 5.0,
            "verified": True,
            "tags": ["Great Guides", "Amazing Views", "Beginner Friendly"],
            "helpful_count": 24,
            "date": "2024-12-15",
            "featured": True,
        },
        {
            "name": "Rahul Verma",
            "role": "Marketing Manager",
            "location": "Mumbai",
            "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            "testimonial": "Global Events Travels made my dream of trekking in the Himalayas come true. Their attention to safety was impressive.",
            "trek_name": "Hampta Pass Trek",
            "rating": 5.0,
            "verified": True,
            "tags": ["Safety First", "Beautiful Camps", "Well Organized"],
            "helpful_count": 18,
            "date": "2024-11-20",
            "featured": True,
        },
        {
            "name": "Ananya Patel",
            "role": "Doctor",
            "location": "Delhi",
            "image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            "testimonial": "I've done multiple treks with this team and every time they exceed expectations. The Valley of Flowers was like walking through paradise.",
            "trek_name": "Valley of Flowers",
            "rating": 5.0,
            "verified": True,
            "tags": ["Amazing Views", "Repeat Customer", "Paradise"],
            "helpful_count": 31,
            "date": "2024-09-10",
            "featured": True,
        },
    ]
    
    for test_data in testimonials_data:
        existing = db.query(Testimonial).filter(
            Testimonial.name == test_data["name"],
            Testimonial.trek_name == test_data["trek_name"]
        ).first()
        if not existing:
            testimonial = Testimonial(**test_data)
            db.add(testimonial)
    db.commit()
    print(f"✓ Seeded {len(testimonials_data)} testimonials")


def seed_offices(db: Session):
    """Seed office data."""
    offices_data = [
        {
            "name": "Himachal Office (HQ)",
            "address": "Global Camp's by Global Events Travels, Aleo road petrol pump near Chandarmaki Cottage, NSB Hotel",
            "city": "Manali",
            "state": "Himachal Pradesh",
            "pincode": "175131",
            "landmarks": "Near Aleo Road Petrol Pump, NSB Hotel",
            "phone": "+91 98765 43210",
            "email": "himachal@globaleventstravels.com",
            "lat": 32.2299,
            "lng": 77.1889,
            "map_url": "https://maps.google.com/?q=32.2299,77.1889",
            "image": "/images/offices/manali.jpg",
        },
        {
            "name": "Chennai Office",
            "address": "306, 1st Main Road, MKB Nagar",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600039",
            "phone": "+91 98765 43211",
            "email": "chennai@globaleventstravels.com",
            "lat": 13.1175,
            "lng": 80.1434,
            "map_url": "https://maps.google.com/?q=13.1175,80.1434",
            "image": "/images/offices/chennai.jpg",
        },
        {
            "name": "Kasol Office",
            "address": "Casanova Camp's Choj Bridge, Near Bus Stand, Manikaran Road, Near Volvo",
            "city": "Kasol, Sosan",
            "state": "Himachal Pradesh",
            "pincode": "175101",
            "landmarks": "Choj Bridge, Near Volvo Bus Stand",
            "phone": "+91 98765 43212",
            "email": "kasol@globaleventstravels.com",
            "lat": 32.0167,
            "lng": 77.3167,
            "map_url": "https://maps.google.com/?q=32.0167,77.3167",
            "image": "/images/offices/kasol.jpg",
        },
        {
            "name": "Dehradun Office",
            "address": "Kugiyal Niwas, Vimal Kumar Singh, Ganesh Vihar Lane 6, Mata Mandir Road",
            "city": "Dehradun",
            "state": "Uttarakhand",
            "pincode": "248001",
            "landmarks": "Near Kukreja Institute, Mata Mandir Road",
            "phone": "+91 98765 43213",
            "email": "dehradun@globaleventstravels.com",
            "lat": 30.2871,
            "lng": 78.0211,
            "map_url": "https://maps.google.com/?q=30.2871,78.0211",
            "image": "/images/offices/dehradun.jpg",
        },
    ]
    
    for office_data in offices_data:
        existing = db.query(Office).filter(Office.name == office_data["name"]).first()
        if not existing:
            office = Office(**office_data)
            db.add(office)
    db.commit()
    print(f"✓ Seeded {len(offices_data)} offices")


def seed_blog(db: Session):
    """Seed blog authors and posts."""
    # First create authors
    authors_data = [
        {
            "name": "Rajesh Kumar",
            "avatar": "/images/team/rajesh.jpg",
            "bio": "Senior Trek Leader with 15+ years of Himalayan experience",
            "role": "Head Guide",
        },
        {
            "name": "Deepa Negi",
            "avatar": "/images/team/deepa.jpg",
            "bio": "Passionate about making trekking accessible to everyone",
            "role": "Trek Leader",
        },
        {
            "name": "Vikram Singh",
            "avatar": "/images/team/vikram.jpg",
            "bio": "Certified mountaineer and gear expert",
            "role": "Expedition Leader",
        },
    ]
    
    author_map = {}
    for author_data in authors_data:
        existing = db.query(BlogAuthor).filter(BlogAuthor.name == author_data["name"]).first()
        if existing:
            author_map[author_data["name"]] = existing.id
        else:
            author = BlogAuthor(**author_data)
            db.add(author)
            db.flush()
            author_map[author_data["name"]] = author.id
    db.commit()
    print(f"✓ Seeded {len(authors_data)} blog authors")
    
    # Now create posts
    posts_data = [
        {
            "title": "13 Best Summer Treks in India for 2025",
            "slug": "best-summer-treks-india-2025",
            "excerpt": "Discover the most breathtaking summer treks in India. From the Valley of Flowers to Hampta Pass, find your perfect adventure.",
            "content": "# 13 Best Summer Treks in India for 2025\n\nSummer in India is the perfect time to escape to the mountains...",
            "author_id": author_map["Rajesh Kumar"],
            "publish_date": "2024-12-20",
            "featured_image": "/images/blog/summer-treks.jpg",
            "category": "season-guide",
            "tags": ["Summer Treks", "India", "2025", "Best Treks", "Himalayas"],
            "read_time": 12,
            "featured": True,
            "meta_description": "Complete guide to the 13 best summer treks in India for 2025.",
        },
        {
            "title": "Complete Guide: Kasol to Kheerganga Trek",
            "slug": "kasol-kheerganga-trek-beginners-guide",
            "excerpt": "Everything you need to know about the famous Kasol to Kheerganga trek. Perfect for first-time trekkers.",
            "content": "# Complete Guide: Kasol to Kheerganga Trek\n\nThe Kasol to Kheerganga trek is one of the most popular beginner-friendly treks...",
            "author_id": author_map["Deepa Negi"],
            "publish_date": "2024-12-15",
            "featured_image": "/images/blog/kheerganga.jpg",
            "category": "trek-guide",
            "tags": ["Kheerganga", "Kasol", "Beginners", "Budget Trek", "Himachal"],
            "read_time": 8,
            "featured": True,
            "meta_description": "Complete beginner guide to Kasol Kheerganga trek.",
        },
        {
            "title": "Essential Trekking Gear: What to Pack",
            "slug": "essential-trekking-gear-himalayan-treks",
            "excerpt": "A comprehensive packing guide for Himalayan treks. Learn what gear is essential.",
            "content": "# Essential Trekking Gear\n\nPacking for a Himalayan trek can be overwhelming...",
            "author_id": author_map["Vikram Singh"],
            "publish_date": "2024-12-10",
            "featured_image": "/images/blog/trekking-gear.jpg",
            "category": "gear-review",
            "tags": ["Gear", "Packing", "Equipment", "Tips", "Preparation"],
            "read_time": 10,
            "featured": False,
            "meta_description": "Complete packing guide for Himalayan treks.",
        },
    ]
    
    for post_data in posts_data:
        existing = db.query(BlogPost).filter(BlogPost.slug == post_data["slug"]).first()
        if not existing:
            post = BlogPost(**post_data)
            db.add(post)
    db.commit()
    print(f"✓ Seeded {len(posts_data)} blog posts")


def seed_admin_user(db: Session):
    """Seed default admin user."""
    admin_email = "admin@globaleventstravels.com"
    
    existing = db.query(User).filter(User.email == admin_email).first()
    if not existing:
        admin_user = User(
            email=admin_email,
            hashed_password=get_password_hash("admin123"),  # Change this in production!
            full_name="Admin User",
            role="superadmin",
            is_active=True,
            is_verified=True,
        )
        db.add(admin_user)
        db.commit()
        print("✓ Seeded admin user (email: admin@globaleventstravels.com, password: admin123)")
    else:
        print("✓ Admin user already exists")


def seed_all():
    """Run all seed functions."""
    print("\n🌱 Starting database seeding...\n")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = SessionLocal()
    
    try:
        seed_admin_user(db)
        seed_guides(db)
        seed_treks(db)
        seed_expeditions(db)
        seed_testimonials(db)
        seed_offices(db)
        seed_blog(db)
        
        print("\n✅ Database seeding completed successfully!\n")
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}\n")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    # Ensure data directory exists
    os.makedirs("data", exist_ok=True)
    seed_all()

