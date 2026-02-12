"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { expeditionService } from "@/services/expedition.service";
import { useUIStore } from "@/store/ui.store";
import type { ExpeditionListItem, ExpeditionStatus, ExpeditionDifficulty } from "@/types/api";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MoreHorizontal,
  Copy,
  Archive,
  RefreshCw,
  Mountain,
  Clock,
  IndianRupee,
  MapPin,
  Star,
  TrendingUp,
} from "lucide-react";

export default function ExpeditionListPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  const difficultyFilter = searchParams.get("difficulty");
  const { addToast } = useUIStore();

  const [expeditions, setExpeditions] = useState<ExpeditionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(statusFilter || "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(difficultyFilter || "all");
  const limit = 10;

  const fetchExpeditions = async () => {
    setLoading(true);
    try {
      const data = await expeditionService.list({
        skip: (page - 1) * limit,
        limit,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        search: search || undefined,
      });
      setExpeditions(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch expeditions:", error);
      addToast({ type: "error", message: "Failed to load expeditions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpeditions();
  }, [page, selectedStatus, selectedDifficulty, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expedition?")) return;

    try {
      await expeditionService.delete(id);
      addToast({ type: "success", message: "Expedition deleted successfully" });
      fetchExpeditions();
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete expedition" });
    }
  };

  const handleStatusChange = async (id: number, newStatus: ExpeditionStatus) => {
    try {
      const expedition = expeditions.find(e => e.id === id);
      if (!expedition) return;

      // Check if transition is allowed
      if (!expeditionService.canTransitionTo(expedition.status, newStatus)) {
        addToast({ 
          type: "error", 
          message: `Cannot change status from ${expedition.status} to ${newStatus}` 
        });
        return;
      }

      // Business rules validation for publishing
      if (newStatus === "published") {
        const validation = await expeditionService.canPublish(id);
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
          await expeditionService.publish(id);
          break;
        case "archived":
          await expeditionService.archive(id);
          break;
        case "draft":
          await expeditionService.unpublish(id);
          break;
        default:
          await expeditionService.update(id, { status: newStatus });
      }
      
      addToast({ type: "success", message: `Expedition ${newStatus} successfully` });
      fetchExpeditions();
    } catch (error) {
      addToast({ type: "error", message: `Failed to change expedition status` });
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await expeditionService.duplicate(id);
      addToast({ type: "success", message: "Expedition duplicated successfully" });
      fetchExpeditions();
    } catch (error) {
      addToast({ type: "error", message: "Failed to duplicate expedition" });
    }
  };

  const getStatusBadge = (status: ExpeditionStatus) => {
    const variants: Record<ExpeditionStatus, "success" | "warning" | "default"> = {
      published: "success",
      draft: "warning",
      archived: "default",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getDifficultyBadge = (difficulty: ExpeditionDifficulty) => {
    const colors: Record<ExpeditionDifficulty, string> = {
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800",
      extreme: "bg-purple-100 text-purple-800",
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
        title="Expeditions"
        description="Manage your mountaineering expeditions"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Expeditions" },
        ]}
        actions={
          <Link href="/dashboard/expeditions/create">
            <Button>
              <Plus className="h-4 w-4" />
              New Expedition
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
                  placeholder="Search expeditions..."
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
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Difficulty</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Expedition Grid */}
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
      ) : expeditions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mountain className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expeditions found</h3>
            <p className="text-gray-500 text-center mb-4">
              {search || selectedStatus !== "all" || selectedDifficulty !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first expedition"}
            </p>
            <Link href="/dashboard/expeditions/create">
              <Button>Create Expedition</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditions.map((expedition) => (
              <Card key={expedition.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Expedition Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-600 overflow-hidden">
                    {expedition.image ? (
                      <img
                        src={expedition.image}
                        alt={expedition.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Mountain className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    {expedition.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      {getStatusBadge(expedition.status)}
                    </div>
                    <div className="absolute bottom-2 right-2">
                      {getDifficultyBadge(expedition.difficulty)}
                    </div>
                  </div>

                  {/* Expedition Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {expedition.name}
                      </h3>
                    </div>

                    {expedition.shortDescription && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {expedition.shortDescription}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {expedition.duration} days
                        </div>
                        <div className="flex items-center">
                          <Mountain className="h-4 w-4 mr-1" />
                          {expedition.summitAltitude}m
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {expedition.location}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          ₹{expedition.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {expedition.successRate > 0 && (
                          <div className="flex items-center text-blue-500">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm ml-1">{expedition.successRate}%</span>
                          </div>
                        )}
                        {expedition.rating > 0 && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm ml-1">{expedition.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(expedition.updated_at)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/expeditions/${expedition.id}`}>
                          <Button size="sm" variant="outline">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(expedition.id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(expedition.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Status Actions */}
                    <div className="mt-3 flex items-center space-x-2">
                      {expedition.status === "draft" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(expedition.id, "published")}
                          className="text-green-600 hover:text-green-700"
                        >
                          Publish
                        </Button>
                      )}
                      {expedition.status === "published" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(expedition.id, "draft")}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          Unpublish
                        </Button>
                      )}
                      {(expedition.status === "draft" || expedition.status === "published") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(expedition.id, "archived")}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      )}
                      {expedition.status === "archived" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(expedition.id, "draft")}
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
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} expeditions
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
