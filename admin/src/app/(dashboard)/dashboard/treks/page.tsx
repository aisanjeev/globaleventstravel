"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { trekService } from "@/services/trek.service";
import { useUIStore } from "@/store/ui.store";
import type { TrekListItem, TrekStatus, TrekDifficulty } from "@/types/api";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  Archive,
  RefreshCw,
  Mountain,
  Clock,
  IndianRupee,
  MapPin,
  Star,
  Calendar,
} from "lucide-react";

export default function TrekListPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  const difficultyFilter = searchParams.get("difficulty");
  const { addToast } = useUIStore();

  const [treks, setTreks] = useState<TrekListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(statusFilter || "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(difficultyFilter || "all");
  const limit = 10;

  const fetchTreks = async () => {
    setLoading(true);
    try {
      const data = await trekService.list({
        skip: (page - 1) * limit,
        limit,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        search: search || undefined,
      });
      setTreks(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch treks:", error);
      addToast({ type: "error", message: "Failed to load treks" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks();
  }, [page, selectedStatus, selectedDifficulty, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trek?")) return;

    try {
      await trekService.delete(id);
      addToast({ type: "success", message: "Trek deleted successfully" });
      fetchTreks();
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete trek" });
    }
  };

  const handleStatusChange = async (id: number, newStatus: TrekStatus) => {
    try {
      const trek = treks.find(t => t.id === id);
      if (!trek) return;

      // Check if transition is allowed
      if (!trekService.canTransitionTo(trek.status, newStatus)) {
        addToast({ 
          type: "error", 
          message: `Cannot change status from ${trek.status} to ${newStatus}` 
        });
        return;
      }

      // Business rules validation for publishing
      if (newStatus === "published") {
        const validation = await trekService.canPublish(id);
        if (!validation.canPublish) {
          addToast({ 
            type: "error", 
            message: `Cannot publish: ${validation.reasons.join(", ")}` 
          });
          return;
        }
      }

      switch (newStatus) {
        case "published":
          await trekService.publish(id);
          break;
        case "archived":
          await trekService.archive(id);
          break;
        case "draft":
          await trekService.unpublish(id);
          break;
        default:
          await trekService.update(id, { status: newStatus });
      }
      
      addToast({ type: "success", message: `Trek ${newStatus} successfully` });
      fetchTreks();
    } catch (error) {
      addToast({ type: "error", message: `Failed to change trek status` });
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await trekService.duplicate(id);
      addToast({ type: "success", message: "Trek duplicated successfully" });
      fetchTreks();
    } catch (error) {
      addToast({ type: "error", message: "Failed to duplicate trek" });
    }
  };

  const getStatusBadge = (status: TrekStatus) => {
    const variants: Record<TrekStatus, "success" | "warning" | "default" | "info"> = {
      published: "success",
      draft: "warning",
      archived: "default",
      seasonal: "info",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getDifficultyBadge = (difficulty: TrekDifficulty) => {
    const colors: Record<TrekDifficulty, string> = {
      easy: "bg-green-100 text-green-800",
      moderate: "bg-blue-100 text-blue-800", 
      difficult: "bg-yellow-100 text-yellow-800",
      challenging: "bg-orange-100 text-orange-800",
      extreme: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <PageHeader
        title="Treks"
        description="Manage your trek offerings"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Treks" },
        ]}
        actions={
          <Link href="/dashboard/treks/create">
            <Button>
              <Plus className="h-4 w-4" />
              New Trek
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search treks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="seasonal">Seasonal</option>
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
              <option value="challenging">Challenging</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Trek Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : treks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mountain className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No treks found</h3>
            <p className="text-gray-500 text-center mb-4">
              {search || selectedStatus !== "all" || selectedDifficulty !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first trek"}
            </p>
            <Link href="/dashboard/treks/create">
              <Button>Create Trek</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treks.map((trek) => (
              <Card key={trek.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Trek Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-600 overflow-hidden">
                    {trek.featured_image ? (
                      <img
                        src={trek.featured_image}
                        alt={trek.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Mountain className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    {trek.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      {getStatusBadge(trek.status)}
                    </div>
                    <div className="absolute bottom-2 right-2">
                      {getDifficultyBadge(trek.difficulty)}
                    </div>
                  </div>

                  {/* Trek Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {trek.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show action menu
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {trek.short_description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {trek.short_description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {trek.duration} days
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {trek.location}
                        </div>
                        {trek.best_season && trek.best_season.length > 0 && (
                          <div className="flex items-center text-amber-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {trek.best_season.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          ₹{trek.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {trek.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm ml-1">{trek.rating}</span>
                            <span className="text-xs text-gray-400 ml-1">
                              ({trek.review_count})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(trek.updated_at)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/treks/${trek.id}`}>
                          <Button size="sm" variant="outline">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(trek.id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(trek.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Status Actions */}
                    <div className="mt-3 flex items-center space-x-2">
                      {trek.status === "draft" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(trek.id, "published")}
                          className="text-green-600 hover:text-green-700"
                        >
                          Publish
                        </Button>
                      )}
                      {trek.status === "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(trek.id, "draft")}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          Unpublish
                        </Button>
                      )}
                      {(trek.status === "draft" || trek.status === "published") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(trek.id, "archived")}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      )}
                      {trek.status === "archived" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(trek.id, "draft")}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} treks
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}