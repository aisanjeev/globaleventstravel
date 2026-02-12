"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExpeditionForm } from "@/components/forms/ExpeditionForm";
import { expeditionService } from "@/services/expedition.service";
import { useUIStore } from "@/store/ui.store";
import { Card, CardContent } from "@/components/ui/Card";
import { Mountain } from "lucide-react";
import type { Expedition } from "@/types/api";
import type { ExpeditionFormData } from "@/lib/validations";

export default function EditExpeditionPage() {
  const router = useRouter();
  const params = useParams();
  const expeditionId = Number(params.id);
  const { addToast } = useUIStore();
  
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpedition = async () => {
      try {
        const data = await expeditionService.getById(expeditionId);
        setExpedition(data);
      } catch (err: any) {
        setError(err.message || "Failed to load expedition");
        addToast({ type: "error", message: "Failed to load expedition" });
      } finally {
        setLoading(false);
      }
    };

    if (expeditionId) {
      fetchExpedition();
    }
  }, [expeditionId]);

  const handleSubmit = async (data: ExpeditionFormData) => {
    setIsSubmitting(true);
    try {
      await expeditionService.update(expeditionId, data);
      addToast({ type: "success", message: "Expedition updated successfully" });
      router.push("/dashboard/expeditions");
    } catch (error: any) {
      addToast({ 
        type: "error", 
        message: error.message || "Failed to update expedition" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Edit Expedition"
          description="Loading..."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Expeditions", href: "/dashboard/expeditions" },
            { label: "Edit" },
          ]}
        />
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !expedition) {
    return (
      <div>
        <PageHeader
          title="Edit Expedition"
          description="Expedition not found"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Expeditions", href: "/dashboard/expeditions" },
            { label: "Edit" },
          ]}
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mountain className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Expedition not found</h3>
            <p className="text-gray-500 text-center mb-4">
              {error || "The expedition you're looking for doesn't exist."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Edit: ${expedition.name}`}
        description="Update expedition details"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Expeditions", href: "/dashboard/expeditions" },
          { label: expedition.name },
        ]}
      />

      <ExpeditionForm 
        expedition={expedition} 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
        mode="edit" 
      />
    </div>
  );
}
