"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { blogService } from "@/services/blog.service";
import { categoryService } from "@/services/category.service";
import { tagService } from "@/services/tag.service";
import {
  FileText,
  FolderTree,
  Tags,
  TrendingUp,
  Plus,
  Eye,
} from "lucide-react";

interface Stats {
  posts: number;
  published: number;
  drafts: number;
  categories: number;
  tags: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    published: 0,
    drafts: 0,
    categories: 0,
    tags: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsData, publishedData, draftsData, categories, tags] =
          await Promise.all([
            blogService.list({ limit: 1 }),
            blogService.list({ limit: 1, status: "published" }),
            blogService.list({ limit: 1, status: "draft" }),
            categoryService.list(),
            tagService.list(),
          ]);

        setStats({
          posts: postsData.total,
          published: publishedData.total,
          drafts: draftsData.total,
          categories: categories.length,
          tags: tags.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Total Posts",
      value: stats.posts,
      icon: FileText,
      color: "bg-blue-500",
      href: "/dashboard/blog",
    },
    {
      name: "Published",
      value: stats.published,
      icon: Eye,
      color: "bg-green-500",
      href: "/dashboard/blog?status=published",
    },
    {
      name: "Drafts",
      value: stats.drafts,
      icon: TrendingUp,
      color: "bg-yellow-500",
      href: "/dashboard/blog?status=draft",
    },
    {
      name: "Categories",
      value: stats.categories,
      icon: FolderTree,
      color: "bg-purple-500",
      href: "/dashboard/blog/categories",
    },
    {
      name: "Tags",
      value: stats.tags,
      icon: Tags,
      color: "bg-pink-500",
      href: "/dashboard/blog/tags",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your content."
        actions={
          <Link
            href="/dashboard/blog/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard/blog/create"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Post</p>
                <p className="text-sm text-gray-500">Write a new blog post</p>
              </div>
            </Link>

            <Link
              href="/dashboard/blog/categories"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Categories</p>
                <p className="text-sm text-gray-500">Organize your content</p>
              </div>
            </Link>

            <Link
              href="/dashboard/blog/tags"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                <Tags className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Tags</p>
                <p className="text-sm text-gray-500">Add or remove tags</p>
              </div>
            </Link>

            <Link
              href="/dashboard/media"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Media Library</p>
                <p className="text-sm text-gray-500">Upload and manage files</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


