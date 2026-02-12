"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrekForm } from "@/components/forms/TrekForm";
import { trekService } from "@/services/trek.service";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import type { TrekFormData } from "@/lib/validations";

export default function CreateTrekPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TrekFormData) => {
    if (!user) {
      addToast({ type: "error", message: "User authentication required" });
      return;
    }

    setIsLoading(true);
    try {
      const newTrek = await trekService.create({
        ...data,
        status: data.status || "draft",
        featured: data.featured || false,
      });

      addToast({ 
        type: "success", 
        message: "Trek created successfully"
      });

      // Redirect to edit page for further customization
      router.push(`/dashboard/treks/${newTrek.id}`);
    } catch (error: any) {
      console.error("Failed to create trek:", error);
      addToast({ 
        type: "error", 
        message: error.message || "Failed to create trek"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create New Trek"
        description="Add a new trekking adventure to your offerings"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Treks", href: "/dashboard/treks" },
          { label: "Create New Trek" },
        ]}
      />

      <TrekForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  );
}