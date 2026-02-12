"""
Migration script to add status column to expeditions table.
Run this script to update your database schema.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.session import SessionLocal
from sqlalchemy import text

def run_migration():
    """Add status column to expeditions table."""
    db = SessionLocal()
    try:
        # Check if column already exists
        result = db.execute(text("""
            SELECT COUNT(*) as count
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'expeditions'
            AND COLUMN_NAME = 'status'
        """))
        
        if result.scalar() > 0:
            print("[OK] Column 'status' already exists in expeditions table")
            return
        
        # Add the status column
        print("Adding 'status' column to expeditions table...")
        db.execute(text("""
            ALTER TABLE expeditions 
            ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'draft' 
            AFTER featured
        """))
        
        db.commit()
        print("[OK] Successfully added 'status' column to expeditions table")
        
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error running migration: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Running migration: Add status column to expeditions table")
    print("-" * 60)
    run_migration()
    print("-" * 60)
    print("Migration completed!")
