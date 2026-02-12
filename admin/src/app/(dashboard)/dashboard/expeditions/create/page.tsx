"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExpeditionForm } from "@/components/forms/ExpeditionForm";
import { expeditionService } from "@/services/expedition.service";
import { useUIStore } from "@/store/ui.store";
import { useState } from "react";
import type { ExpeditionFormData } from "@/lib/validations";

export default function CreateExpeditionPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ExpeditionFormData) => {
    setIsLoading(true);
    try {
      await expeditionService.create(data);
      addToast({ type: "success", message: "Expedition created successfully" });
      router.push("/dashboard/expeditions");
    } catch (error: any) {
      addToast({ 
        type: "error", 
        message: error.message || "Failed to create expedition" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Expedition"
        description="Add a new mountaineering expedition"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Expeditions", href: "/dashboard/expeditions" },
          { label: "Create" },
        ]}
      />

      <ExpeditionForm onSubmit={handleSubmit} isLoading={isLoading} mode="create" />
    </div>
  );
}
