-- Migration: Add status column to expeditions table
-- Date: 2025-01-13
-- Description: Adds status field to expeditions table for draft/published/archived workflow

ALTER TABLE expeditions 
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'draft' 
AFTER featured;

-- Update existing expeditions to have 'published' status if they were previously active
-- Uncomment the line below if you want to set existing expeditions to published
-- UPDATE expeditions SET status = 'published' WHERE status = 'draft';
