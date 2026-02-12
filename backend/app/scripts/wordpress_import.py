"""
WordPress blog import script.

Fetches posts, categories, tags, and featured images from the WordPress REST API
and imports them into the local database without modifying existing application code.

Usage:
    poetry run python -m app.scripts.wordpress_import [--dry-run] [--skip-existing] [--limit N]
    poetry run import-wordpress-blog [--dry-run] [--skip-existing] [--limit N]
"""
import argparse
import re
from datetime import datetime
from html import unescape
from typing import Any, Dict, List, Optional

import requests

from app.crud.blog import (
    blog_author_crud,
    blog_category_crud,
    blog_crud,
    blog_tag_crud,
)
from app.db.models.blog import BlogAuthor, BlogCategory, BlogTag
from app.db.session import SessionLocal
from app.models.blog import (
    BlogCategoryCreate,
    BlogPostCreate,
    BlogTagCreate,
    ContentTypeEnum,
    PostStatusEnum,
)

WP_BASE_URL = "https://globaleventstravels.com"
IMPORT_AUTHOR_NAME = "Imported from WordPress"


def fetch_wp_categories() -> List[Dict[str, Any]]:
    """Fetch all categories from WordPress REST API."""
    url = f"{WP_BASE_URL}/wp-json/wp/v2/categories"
    categories = []
    page = 1
    while True:
        resp = requests.get(url, params={"per_page": 100, "page": page}, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        categories.extend(data)
        if len(data) < 100:
            break
        page += 1
    return categories


def fetch_wp_tags() -> List[Dict[str, Any]]:
    """Fetch all tags from WordPress REST API."""
    url = f"{WP_BASE_URL}/wp-json/wp/v2/tags"
    tags = []
    page = 1
    while True:
        resp = requests.get(url, params={"per_page": 100, "page": page}, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        tags.extend(data)
        if len(data) < 100:
            break
        page += 1
    return tags


def fetch_wp_media_url(media_id: int) -> Optional[str]:
    """Fetch featured image URL from WordPress media endpoint. Returns None if media_id is 0."""
    if not media_id:
        return None
    url = f"{WP_BASE_URL}/wp-json/wp/v2/media/{media_id}"
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        return data.get("source_url")
    except requests.RequestException:
        return None


def fetch_wp_posts(limit: Optional[int] = None) -> List[Dict[str, Any]]:
    """Fetch posts from WordPress REST API with pagination."""
    url = f"{WP_BASE_URL}/wp-json/wp/v2/posts"
    posts = []
    page = 1
    while True:
        resp = requests.get(
            url,
            params={"per_page": 100, "page": page, "status": "publish"},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        for p in data:
            posts.append(p)
            if limit and len(posts) >= limit:
                return posts
        if len(data) < 100:
            break
        page += 1
    return posts


def strip_html(text: str) -> str:
    """Remove HTML tags from text."""
    return re.sub(r"<[^>]+>", "", text).strip()


def ensure_import_author(db) -> int:
    """Ensure default import author exists. Returns author_id."""
    author = blog_author_crud.get_by_name(db, IMPORT_AUTHOR_NAME)
    if author:
        return author.id
    author = BlogAuthor(name=IMPORT_AUTHOR_NAME)
    db.add(author)
    db.commit()
    db.refresh(author)
    return author.id


def parse_wp_date(date_str: Optional[str]) -> Optional[datetime]:
    """Parse WordPress ISO date string to datetime."""
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return None


def format_date_for_db(dt: Optional[datetime]) -> Optional[str]:
    """Format datetime as YYYY-MM-DD string for publish_date/updated_date."""
    if not dt:
        return None
    return dt.strftime("%Y-%m-%d")


def run_import(
    dry_run: bool = False,
    skip_existing: bool = False,
    limit: Optional[int] = None,
) -> None:
    """Run the WordPress blog import."""
    db = SessionLocal()
    try:
        print("Fetching WordPress categories...")
        wp_categories = fetch_wp_categories()
        print(f"  Found {len(wp_categories)} categories")

        # Map WP category id -> local BlogCategory id
        wp_cat_id_to_local: Dict[int, int] = {}
        for wc in wp_categories:
            slug = wc.get("slug", "").lower()[:100]
            name = unescape(wc.get("name", slug))[:100]
            desc = (wc.get("description") or "")[:500] if wc.get("description") else None
            existing = blog_category_crud.get_by_slug(db, slug)
            if existing:
                wp_cat_id_to_local[wc["id"]] = existing.id
            elif not dry_run:
                cat_create = BlogCategoryCreate(
                    name=name,
                    slug=slug,
                    description=desc,
                    display_order=wc.get("count", 0),
                )
                cat = blog_category_crud.create(db, obj_in=cat_create)
                wp_cat_id_to_local[wc["id"]] = cat.id
            else:
                wp_cat_id_to_local[wc["id"]] = -1  # placeholder for dry-run

        print("Fetching WordPress tags...")
        wp_tags = fetch_wp_tags()
        print(f"  Found {len(wp_tags)} tags")

        # Map WP tag id -> local BlogTag id
        wp_tag_id_to_local: Dict[int, int] = {}
        for wt in wp_tags:
            slug = wt.get("slug", "").lower()[:50]
            name = unescape(wt.get("name", slug))[:50]
            existing = blog_tag_crud.get_by_slug(db, slug)
            if existing:
                wp_tag_id_to_local[wt["id"]] = existing.id
            elif not dry_run:
                tag_create = BlogTagCreate(name=name, slug=slug)
                tag = blog_tag_crud.create(db, obj_in=tag_create)
                wp_tag_id_to_local[wt["id"]] = tag.id
            else:
                wp_tag_id_to_local[wt["id"]] = -1

        author_id = ensure_import_author(db) if not dry_run else 1
        if dry_run:
            print("  [DRY-RUN] Would use author_id=1")

        print("Fetching WordPress posts...")
        wp_posts = fetch_wp_posts(limit=limit)
        print(f"  Found {len(wp_posts)} posts")

        created = 0
        skipped = 0
        for i, wp in enumerate(wp_posts):
            slug = wp.get("slug", "")
            if not slug:
                continue
            existing = blog_crud.get_by_slug(db, slug)
            if existing and skip_existing:
                skipped += 1
                continue

            title = unescape(wp.get("title", {}).get("rendered", "")[:255])
            content = unescape(wp.get("content", {}).get("rendered", ""))
            excerpt_raw = wp.get("excerpt", {}).get("rendered", "")
            excerpt = strip_html(unescape(excerpt_raw))[:500] if excerpt_raw else None

            date_str = wp.get("date")
            modified_str = wp.get("modified")
            published_at = parse_wp_date(date_str)
            publish_date = format_date_for_db(published_at)
            updated_date = format_date_for_db(parse_wp_date(modified_str))

            category_id = None
            wp_cats = wp.get("categories") or []
            if wp_cats:
                first_cat_id = wp_cats[0]
                category_id = wp_cat_id_to_local.get(first_cat_id)

            tag_ids = []
            for tid in wp.get("tags") or []:
                if tid in wp_tag_id_to_local and wp_tag_id_to_local[tid] > 0:
                    tag_ids.append(wp_tag_id_to_local[tid])

            featured_media_id = wp.get("featured_media") or 0
            featured_image = fetch_wp_media_url(featured_media_id) if featured_media_id else None

            yoast = wp.get("yoast_head_json") or {}
            meta_title = (yoast.get("title") or "")[:70]
            meta_description = yoast.get("description") or ""

            status = PostStatusEnum.PUBLISHED if wp.get("status") == "publish" else PostStatusEnum.DRAFT

            if dry_run:
                print(f"  [DRY-RUN] Would import: {slug} - {title[:50]}...")
                created += 1
                continue

            obj_in = BlogPostCreate(
                title=title,
                slug=slug,
                excerpt=excerpt,
                content=content,
                content_type=ContentTypeEnum.HTML,
                status=status,
                author_id=author_id,
                category_id=category_id,
                publish_date=publish_date,
                updated_date=updated_date,
                published_at=published_at,
                featured_image=featured_image,
                meta_title=meta_title or None,
                meta_description=meta_description or None,
            )
            blog_crud.create_with_tags(db, obj_in=obj_in, tag_ids=tag_ids)
            created += 1

        print(f"\nImport complete: {created} posts imported, {skipped} skipped (existing)")
    except requests.RequestException as e:
        print(f"Error fetching from WordPress: {e}")
        raise
    finally:
        db.close()


def run_cli() -> None:
    """CLI entry point for Poetry script."""
    parser = argparse.ArgumentParser(
        description="Import blog posts from WordPress (globaleventstravels.com)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Log what would be imported without writing to database",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip posts whose slug already exists",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Only import first N posts (for testing)",
    )
    args = parser.parse_args()
    run_import(
        dry_run=args.dry_run,
        skip_existing=args.skip_existing,
        limit=args.limit,
    )


if __name__ == "__main__":
    run_cli()
