"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrekForm } from "@/components/forms/TrekForm";
import { trekService } from "@/services/trek.service";
import { useUIStore } from "@/store/ui.store";
import type { Trek } from "@/types/api";
import type { TrekFormData } from "@/lib/validations";

interface EditTrekPageProps {
  params: { id: string };
}

export default function EditTrekPage({ params }: EditTrekPageProps) {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [trek, setTrek] = useState<Trek | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trekId = parseInt(params.id, 10);

  useEffect(() => {
    const fetchTrek = async () => {
      try {
        const data = await trekService.getById(trekId);
        setTrek(data);
      } catch (error) {
        console.error("Failed to fetch trek:", error);
        addToast({ type: "error", message: "Failed to load trek" });
        router.push("/dashboard/treks");
      } finally {
        setLoading(false);
      }
    };

    if (trekId) {
      fetchTrek();
    }
  }, [trekId, router, addToast]);

  const handleSubmit = async (data: TrekFormData) => {
    setIsSubmitting(true);
    try {
      const updatedTrek = await trekService.update(trekId, data);
      setTrek(updatedTrek);
      addToast({ 
        type: "success", 
        message: "Trek updated successfully"
      });
    } catch (error: any) {
      console.error("Failed to update trek:", error);
      addToast({ 
        type: "error", 
        message: error.message || "Failed to update trek"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trek? This action cannot be undone.")) {
      return;
    }

    try {
      await trekService.delete(trekId);
      addToast({ type: "success", message: "Trek deleted successfully" });
      router.push("/dashboard/treks");
    } catch (error) {
      addToast({ type: "error", message: "Failed to delete trek" });
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicatedTrek = await trekService.duplicate(trekId);
      addToast({ type: "success", message: "Trek duplicated successfully" });
      router.push(`/dashboard/treks/${duplicatedTrek.id}`);
    } catch (error) {
      addToast({ type: "error", message: "Failed to duplicate trek" });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (!trek) return;

      // Check if transition is allowed
      if (!trekService.canTransitionTo(trek.status, newStatus as any)) {
        addToast({ 
          type: "error", 
          message: `Cannot change status from ${trek.status} to ${newStatus}` 
        });
        return;
      }

      // Business rules validation for publishing
      if (newStatus === "published") {
        const validation = await trekService.canPublish(trekId);
        if (!validation.canPublish) {
          addToast({ 
            type: "error", 
            message: `Cannot publish: ${validation.reasons.join(", ")}` 
          });
          return;
        }
      }

      let updatedTrek;
      switch (newStatus) {
        case "published":
          updatedTrek = await trekService.publish(trekId);
          break;
        case "archived":
          updatedTrek = await trekService.archive(trekId);
          break;
        case "draft":
          updatedTrek = await trekService.unpublish(trekId);
          break;
        default:
          updatedTrek = await trekService.update(trekId, { status: newStatus as any });
      }
      
      setTrek(updatedTrek);
      addToast({ type: "success", message: `Trek ${newStatus} successfully` });
    } catch (error) {
      addToast({ type: "error", message: `Failed to change trek status` });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Trek not found</h1>
        <p className="text-gray-600 mt-2">The requested trek could not be found.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit: ${trek.name}`}
        description="Update your trek details and itinerary"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Treks", href: "/dashboard/treks" },
          { label: trek.name },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              Delete
            </button>
            
            {/* Status Change Actions */}
            {trek.status === "draft" && (
              <button
                onClick={() => handleStatusChange("published")}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                Publish
              </button>
            )}
            {trek.status === "published" && (
              <button
                onClick={() => handleStatusChange("draft")}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                Unpublish
              </button>
            )}
            {(trek.status === "draft" || trek.status === "published") && (
              <button
                onClick={() => handleStatusChange("archived")}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                Archive
              </button>
            )}
            {trek.status === "archived" && (
              <button
                onClick={() => handleStatusChange("draft")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                Restore
              </button>
            )}
          </div>
        }
      />

      <TrekForm
        trek={trek}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        mode="edit"
      />
    </div>
  );
}