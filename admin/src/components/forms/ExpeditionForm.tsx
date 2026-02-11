"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expeditionSchema, type ExpeditionFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { RichTextEditor } from "@/components/editors/RichTextEditor";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { FormField } from "@/components/ui/FormField";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { GalleryUpload } from "@/components/ui/GalleryUpload";
import { PdfItineraryUpload } from "@/components/ui/PdfItineraryUpload";
import type { Expedition, ExpeditionDifficulty, ExpeditionStatus } from "@/types/api";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Mountain,
  Clock,
  Users,
  MapPin,
  Camera,
  Save,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Shield,
  Backpack,
  ListChecks,
} from "lucide-react";

interface ExpeditionFormProps {
  expedition?: Expedition;
  onSubmit: (data: ExpeditionFormData) => Promise<void>;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const difficultyOptions: { value: ExpeditionDifficulty; label: string; description: string }[] = [
  { value: "advanced", label: "Advanced", description: "For experienced trekkers with high-altitude experience" },
  { value: "expert", label: "Expert", description: "Technical climbing skills required" },
  { value: "extreme", label: "Extreme", description: "Only for professional mountaineers" },
];

const seasonOptions = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const statusOptions: { value: ExpeditionStatus; label: string; description: string }[] = [
  { value: "draft", label: "Draft", description: "Not visible to public" },
  { value: "published", label: "Published", description: "Live and bookable" },
  { value: "archived", label: "Archived", description: "Hidden from public view" },
];

export function ExpeditionForm({ expedition, onSubmit, isLoading, mode }: ExpeditionFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpeditionFormData>({
    resolver: zodResolver(expeditionSchema),
    defaultValues: {
      name: expedition?.name || "",
      slug: expedition?.slug || "",
      difficulty: expedition?.difficulty || "advanced",
      duration: expedition?.duration || 7,
      summitAltitude: expedition?.summitAltitude || 0,
      baseAltitude: expedition?.baseAltitude || 0,
      location: expedition?.location || "",
      region: expedition?.region || "",
      description: expedition?.description || "",
      shortDescription: expedition?.shortDescription || "",
      highlights: expedition?.highlights || [],
      requirements: expedition?.requirements || {
        experience: "",
        fitnessLevel: "",
        technicalSkills: [],
      },
      equipment: expedition?.equipment || {
        provided: [],
        personal: [],
      },
      price: expedition?.price || 0,
      group_size_min: expedition?.groupSize?.min || 4,
      group_size_max: expedition?.groupSize?.max || 12,
      season: expedition?.season || [],
      successRate: expedition?.successRate || 0,
      image: expedition?.image || "",
      gallery: expedition?.gallery || [],
      safetyInfo: expedition?.safetyInfo || "",
      featured: expedition?.featured || false,
      status: expedition?.status || "draft",
      itineraryPdfUrl: expedition?.itineraryPdfUrl || "",
      itinerary: expedition?.itinerary?.map(day => ({
        day: day.day,
        title: day.title,
        description: day.description,
        altitude: day.altitude,
        activities: day.activities || [],
      })) || [],
    },
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary, move: moveItinerary } = useFieldArray({
    control,
    name: "itinerary" as const,
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control: control as any,
    name: "highlights" as any,
  });

  const { fields: providedEquipFields, append: appendProvidedEquip, remove: removeProvidedEquip } = useFieldArray({
    control: control as any,
    name: "equipment.provided" as any,
  });

  const { fields: personalEquipFields, append: appendPersonalEquip, remove: removePersonalEquip } = useFieldArray({
    control: control as any,
    name: "equipment.personal" as any,
  });

  const { fields: technicalSkillFields, append: appendTechnicalSkill, remove: removeTechnicalSkill } = useFieldArray({
    control: control as any,
    name: "requirements.technicalSkills" as any,
  });

  const name = watch("name");
  const difficulty = watch("difficulty");

  // Auto-generate slug from name
  useEffect(() => {
    if (!expedition && name) {
      setValue("slug", slugify(name));
    }
  }, [name, expedition, setValue]);

  // Sync day numbers when itinerary order changes
  useEffect(() => {
    itineraryFields.forEach((_, index) => {
      setValue(`itinerary.${index}.day`, index + 1);
    });
  }, [itineraryFields, setValue]);

  const addItineraryDay = () => {
    const newDay = itineraryFields.length + 1;
    appendItinerary({
      day: newDay,
      title: `Day ${newDay}`,
      description: "",
      altitude: 0,
      activities: [],
    });
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Mountain },
    { id: "details", label: "Details", icon: ListChecks },
    { id: "description", label: "Description", icon: AlertCircle },
    { id: "requirements", label: "Requirements", icon: Shield },
    { id: "equipment", label: "Equipment", icon: Backpack },
    { id: "itinerary", label: "Itinerary", icon: Clock },
    { id: "media", label: "Media", icon: Camera },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Expedition Name" error={errors.name?.message} required>
                <Input {...register("name")} placeholder="e.g. Black Peak Expedition" />
              </FormField>

              <FormField label="Slug" error={errors.slug?.message} required>
                <Input {...register("slug")} placeholder="black-peak-expedition" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Difficulty" error={errors.difficulty?.message} required>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      {difficultyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Status" error={errors.status?.message} required>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Featured">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 pt-2">
                      <Switch checked={field.value} onChange={field.onChange} />
                      <span className="text-sm text-gray-600">Show on homepage</span>
                    </div>
                  )}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Location" error={errors.location?.message} required>
                <Input {...register("location")} placeholder="e.g. Gangotri, Uttarakhand" />
              </FormField>

              <FormField label="Region" error={errors.region?.message} required>
                <Input {...register("region")} placeholder="e.g. Garhwal Himalayas" />
              </FormField>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Expedition Details</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Duration (days)" error={errors.duration?.message} required>
                <Input type="number" {...register("duration", { valueAsNumber: true })} min={1} />
              </FormField>

              <FormField label="Summit Altitude (m)" error={errors.summitAltitude?.message} required>
                <Input type="number" {...register("summitAltitude", { valueAsNumber: true })} min={0} />
              </FormField>

              <FormField label="Base Altitude (m)" error={errors.baseAltitude?.message} required>
                <Input type="number" {...register("baseAltitude", { valueAsNumber: true })} min={0} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Price (₹)" error={errors.price?.message} required>
                <Input type="number" {...register("price", { valueAsNumber: true })} min={0} />
              </FormField>

              <FormField label="Min Group Size" error={errors.group_size_min?.message} required>
                <Input type="number" {...register("group_size_min", { valueAsNumber: true })} min={1} />
              </FormField>

              <FormField label="Max Group Size" error={errors.group_size_max?.message} required>
                <Input type="number" {...register("group_size_max", { valueAsNumber: true })} min={1} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Success Rate (%)" error={errors.successRate?.message}>
                <Input type="number" {...register("successRate", { valueAsNumber: true })} min={0} max={100} />
              </FormField>

              <FormField label="Season" error={errors.season?.message} required>
                <Controller
                  name="season"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {seasonOptions.map((month) => (
                        <button
                          key={month}
                          type="button"
                          onClick={() => {
                            const current = field.value || [];
                            if (current.includes(month)) {
                              field.onChange(current.filter((m: string) => m !== month));
                            } else {
                              field.onChange([...current, month]);
                            }
                          }}
                          className={cn(
                            "px-3 py-1 text-xs rounded-full border transition-colors",
                            (field.value || []).includes(month)
                              ? "bg-primary-500 text-white border-primary-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                          )}
                        >
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </FormField>
            </div>

            <FormField
              label="PDF Itinerary"
              error={errors.itineraryPdfUrl?.message}
              hint="Upload a PDF or paste URL. Used for automated emails when leads request itinerary."
            >
              <Controller
                name="itineraryPdfUrl"
                control={control}
                render={({ field }) => (
                  <PdfItineraryUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={!!errors.itineraryPdfUrl}
                  />
                )}
              />
            </FormField>
          </CardContent>
        </Card>
      )}

      {/* Description Tab */}
      {activeTab === "description" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Description & Highlights</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Short Description" error={errors.shortDescription?.message} required>
              <Textarea
                {...register("shortDescription")}
                placeholder="Brief summary of the expedition..."
                rows={3}
              />
            </FormField>

            <FormField label="Full Description" error={errors.description?.message} required>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Detailed expedition description..."
                  />
                )}
              />
            </FormField>

            <FormField label="Highlights" error={(errors.highlights as any)?.message}>
              <div className="space-y-2">
                {highlightFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...register(`highlights.${index}` as const)}
                      placeholder="Enter a highlight..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendHighlight("")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Highlight
                </Button>
              </div>
            </FormField>

            <FormField label="Safety Information" error={errors.safetyInfo?.message}>
              <Textarea
                {...register("safetyInfo")}
                placeholder="Safety protocols and requirements..."
                rows={3}
              />
            </FormField>
          </CardContent>
        </Card>
      )}

      {/* Requirements Tab */}
      {activeTab === "requirements" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Requirements</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Experience Required" error={errors.requirements?.experience?.message} required>
              <Textarea
                {...register("requirements.experience")}
                placeholder="e.g. Minimum 2 high-altitude treks (above 4,500m) completed"
                rows={2}
              />
            </FormField>

            <FormField label="Fitness Level" error={errors.requirements?.fitnessLevel?.message} required>
              <Textarea
                {...register("requirements.fitnessLevel")}
                placeholder="e.g. Excellent cardiovascular fitness, ability to carry 15kg pack"
                rows={2}
              />
            </FormField>

            <FormField label="Technical Skills">
              <div className="space-y-2">
                {technicalSkillFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...register(`requirements.technicalSkills.${index}` as const)}
                      placeholder="e.g. Basic rope work"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTechnicalSkill(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTechnicalSkill("")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Technical Skill
                </Button>
              </div>
            </FormField>
          </CardContent>
        </Card>
      )}

      {/* Equipment Tab */}
      {activeTab === "equipment" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Equipment</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField label="Equipment Provided" error={(errors.equipment?.provided as any)?.message} required>
              <div className="space-y-2">
                {providedEquipFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...register(`equipment.provided.${index}` as const)}
                      placeholder="e.g. Mountaineering boots"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProvidedEquip(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendProvidedEquip("")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Provided Equipment
                </Button>
              </div>
            </FormField>

            <FormField label="Personal Equipment Required" error={(errors.equipment?.personal as any)?.message} required>
              <div className="space-y-2">
                {personalEquipFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...register(`equipment.personal.${index}` as const)}
                      placeholder="e.g. Down jacket"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePersonalEquip(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendPersonalEquip("")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Personal Equipment
                </Button>
              </div>
            </FormField>
          </CardContent>
        </Card>
      )}

      {/* Itinerary Tab */}
      {activeTab === "itinerary" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Day-by-Day Itinerary</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
              <Plus className="h-4 w-4 mr-1" />
              Add Day
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {itineraryFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No itinerary days added yet.</p>
                <Button type="button" variant="outline" size="sm" onClick={addItineraryDay} className="mt-2">
                  Add First Day
                </Button>
              </div>
            ) : (
              itineraryFields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <Badge>Day {index + 1}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveItinerary(index, index - 1)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      )}
                      {index < itineraryFields.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveItinerary(index, index + 1)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => removeItinerary(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Title" error={errors.itinerary?.[index]?.title?.message}>
                      <Input
                        {...register(`itinerary.${index}.title`)}
                        placeholder="e.g. Arrive Dehradun"
                      />
                    </FormField>

                    <FormField label="Altitude (m)" error={errors.itinerary?.[index]?.altitude?.message}>
                      <Input
                        type="number"
                        {...register(`itinerary.${index}.altitude`, { valueAsNumber: true })}
                        min={0}
                      />
                    </FormField>
                  </div>

                  <FormField label="Description" error={errors.itinerary?.[index]?.description?.message}>
                    <Textarea
                      {...register(`itinerary.${index}.description`)}
                      placeholder="Day description..."
                      rows={3}
                    />
                  </FormField>

                  <FormField label="Activities">
                    <Controller
                      name={`itinerary.${index}.activities`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          {(field.value || []).map((activity: string, actIndex: number) => (
                            <div key={actIndex} className="flex gap-2">
                              <Input
                                value={activity}
                                onChange={(e) => {
                                  const newActivities = [...(field.value || [])];
                                  newActivities[actIndex] = e.target.value;
                                  field.onChange(newActivities);
                                }}
                                placeholder="Activity..."
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newActivities = (field.value || []).filter((_: string, i: number) => i !== actIndex);
                                  field.onChange(newActivities);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange([...(field.value || []), ""])}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Activity
                          </Button>
                        </div>
                      )}
                    />
                  </FormField>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Images</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField label="Featured Image" error={errors.image?.message} required>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    folder="expeditions"
                  />
                )}
              />
            </FormField>

            <FormField label="Gallery Images">
              <Controller
                name="gallery"
                control={control}
                render={({ field }) => (
                  <GalleryUpload
                    value={field.value || []}
                    onChange={field.onChange}
                    folder="expeditions"
                  />
                )}
              />
            </FormField>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {mode === "create" ? "Create Expedition" : "Update Expedition"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
