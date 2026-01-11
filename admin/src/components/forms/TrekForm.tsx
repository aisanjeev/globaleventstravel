"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trekSchema, type TrekFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { RichTextEditor } from "@/components/editors/RichTextEditor";
import { MarkdownEditor } from "@/components/editors/MarkdownEditor";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { FormField } from "@/components/ui/FormField";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { trekCategoryService } from "@/services/trek-category.service";
import type { Trek, TrekCategory, TrekDifficulty, TrekStatus } from "@/types/api";
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
  Eye,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";

interface TrekFormProps {
  trek?: Trek;
  onSubmit: (data: TrekFormData) => Promise<void>;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const difficultyOptions: { value: TrekDifficulty; label: string; description: string }[] = [
  { value: "easy", label: "Easy", description: "Suitable for beginners with basic fitness" },
  { value: "moderate", label: "Moderate", description: "Requires good fitness and some experience" },
  { value: "difficult", label: "Difficult", description: "Demanding trek for experienced hikers" },
  { value: "challenging", label: "Challenging", description: "Very demanding, requires excellent fitness" },
  { value: "extreme", label: "Extreme", description: "Only for expert mountaineers" },
];

const seasonOptions = [
  "Spring (Mar-May)",
  "Summer (Jun-Aug)",
  "Autumn (Sep-Nov)",
  "Winter (Dec-Feb)",
];

const statusOptions: { value: TrekStatus; label: string; description: string }[] = [
  { value: "draft", label: "Draft", description: "Not visible to public" },
  { value: "published", label: "Published", description: "Live and bookable" },
  { value: "seasonal", label: "Seasonal", description: "Available during specific seasons" },
  { value: "archived", label: "Archived", description: "Hidden from public view" },
];

export function TrekForm({ trek, onSubmit, isLoading, mode }: TrekFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [contentType, setContentType] = useState<"html" | "markdown">("html");
  const [categories, setCategories] = useState<
    Array<TrekCategory & { level: number; fullPath: string }>
  >([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic", "itinerary"])
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TrekFormData>({
    resolver: zodResolver(trekSchema),
    defaultValues: {
      name: trek?.name || "",
      slug: trek?.slug || "",
      short_description: trek?.short_description || "",
      description: trek?.description || "",
      difficulty: trek?.difficulty || "easy",
      duration: trek?.duration || 1,
      max_altitude: trek?.max_altitude || 0,
      distance: trek?.distance || 0,
      price: trek?.price || 0,
      featured_image: trek?.featured_image || "",
      gallery: trek?.gallery || [],
      status: trek?.status || "draft",
      featured: trek?.featured || false,
      category_id: trek?.category_id || undefined,
      location: trek?.location || "",
      best_season: trek?.best_season || [],
      group_size_min: trek?.group_size_min || 1,
      group_size_max: trek?.group_size_max || 10,
      includes: trek?.includes || [],
      excludes: trek?.excludes || [],
      equipment_list: trek?.equipment_list || [],
      fitness_level: trek?.fitness_level || "",
      experience_required: trek?.experience_required || "",
      meta_title: trek?.meta_title || "",
      meta_description: trek?.meta_description || "",
      meta_keywords: trek?.meta_keywords || [],
      itinerary: trek?.itinerary?.map(day => ({
        day: day.day,
        title: day.title,
        description: day.description,
        elevation_gain: day.elevation_gain || 0,
        distance: day.distance || 0,
        accommodation: day.accommodation || "",
        meals: day.meals || "",
        highlights: day.highlights || [],
      })) || [],
    },
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary, move: moveItinerary } = useFieldArray({
    control,
    name: "itinerary",
  });

  const { fields: includesFields, append: appendInclude, remove: removeInclude } = useFieldArray({
    control,
    name: "includes",
  });

  const { fields: excludesFields, append: appendExclude, remove: removeExclude } = useFieldArray({
    control,
    name: "excludes",
  });

  const { fields: equipmentFields, append: appendEquipment, remove: removeEquipment } = useFieldArray({
    control,
    name: "equipment_list",
  });

  const name = watch("name");
  const difficulty = watch("difficulty");
  const duration = watch("duration");

  // Auto-generate slug from name
  useEffect(() => {
    if (!trek && name) {
      setValue("slug", slugify(name));
    }
  }, [name, trek, setValue]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const tree = await trekCategoryService.getTree();
        setCategories(trekCategoryService.flattenTree(tree));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const addItineraryDay = () => {
    const newDay = itineraryFields.length + 1;
    appendItinerary({
      day: newDay,
      title: `Day ${newDay}`,
      description: "",
      elevation_gain: 0,
      distance: 0,
      accommodation: "",
      meals: "",
      highlights: [],
    });
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Mountain },
    { id: "itinerary", label: "Itinerary", icon: Clock },
    { id: "details", label: "Details", icon: Users },
    { id: "media", label: "Media", icon: Camera },
    { id: "seo", label: "SEO", icon: Eye },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const hasErrors = Object.keys(errors).some(key => {
              if (tab.id === "basic") return ["name", "slug", "description", "difficulty", "location"].includes(key);
              if (tab.id === "itinerary") return key.startsWith("itinerary");
              if (tab.id === "details") return ["duration", "price", "group_size_min", "group_size_max"].includes(key);
              if (tab.id === "seo") return ["meta_title", "meta_description"].includes(key);
              return false;
            });

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {hasErrors && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Trek Name"
                  required
                  error={errors.name?.message}
                >
                  <Input
                    {...register("name")}
                    placeholder="Enter trek name"
                  />
                </FormField>

                <FormField
                  label="Slug"
                  required
                  error={errors.slug?.message}
                  description="URL-friendly version of the name"
                >
                  <Input
                    {...register("slug")}
                    placeholder="trek-name"
                  />
                </FormField>
              </div>

              <FormField
                label="Short Description"
                error={errors.short_description?.message}
                description="Brief summary for listings (max 300 characters)"
              >
                <Textarea
                  {...register("short_description")}
                  rows={3}
                  placeholder="A brief, compelling description of the trek..."
                  maxLength={300}
                />
              </FormField>

              {/* Content Editor */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Full Description</h4>
                    <div className="flex rounded-lg bg-gray-100 p-1">
                      <button
                        type="button"
                        onClick={() => setContentType("html")}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                          contentType === "html"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        Rich Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setContentType("markdown")}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                          contentType === "markdown"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        Markdown
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) =>
                      contentType === "html" ? (
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          error={!!errors.description}
                        />
                      ) : (
                        <MarkdownEditor
                          content={field.value}
                          onChange={field.onChange}
                          error={!!errors.description}
                        />
                      )
                    }
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Difficulty Level"
                  required
                  error={errors.difficulty?.message}
                >
                  <Controller
                    control={control}
                    name="difficulty"
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {difficultyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {difficultyOptions.find(d => d.value === difficulty)?.description}
                  </p>
                </FormField>

                <FormField
                  label="Duration (Days)"
                  required
                  error={errors.duration?.message}
                >
                  <Input
                    type="number"
                    min="1"
                    {...register("duration", { valueAsNumber: true })}
                  />
                </FormField>

                <FormField
                  label="Location"
                  required
                  error={errors.location?.message}
                >
                  <Input
                    {...register("location")}
                    placeholder="e.g., Himalayas, Nepal"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Category"
                  error={errors.category_id?.message}
                >
                  <Controller
                    control={control}
                    name="category_id"
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {"  ".repeat(category.level)}
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </FormField>

                <FormField
                  label="Status"
                  required
                  error={errors.status?.message}
                >
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {statusOptions.find(s => s.value === watch("status"))?.description}
                  </p>
                </FormField>
              </div>

              <div className="flex items-center space-x-4">
                <FormField
                  label="Featured Trek"
                  description="Highlight this trek in featured sections"
                >
                  <Controller
                    control={control}
                    name="featured"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Itinerary Tab */}
      {activeTab === "itinerary" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Daily Itinerary</h3>
                <p className="text-sm text-gray-600">Plan each day of the trek</p>
              </div>
              <Button
                type="button"
                onClick={addItineraryDay}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Day
              </Button>
            </CardHeader>
            <CardContent>
              {itineraryFields.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No itinerary yet</h4>
                  <p className="text-gray-600 mb-4">Start planning your trek day by day</p>
                  <Button type="button" onClick={addItineraryDay}>
                    Add First Day
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {itineraryFields.map((field, index) => (
                    <Card key={field.id} className="border-l-4 border-l-primary-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                            <Badge variant="outline">Day {index + 1}</Badge>
                            <Input
                              {...register(`itinerary.${index}.title`)}
                              placeholder="Day title"
                              className="font-medium"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => moveItinerary(index, Math.max(0, index - 1))}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => moveItinerary(index, Math.min(itineraryFields.length - 1, index + 1))}
                              disabled={index === itineraryFields.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItinerary(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <FormField
                            label="Description"
                            error={errors.itinerary?.[index]?.description?.message}
                          >
                            <Controller
                              control={control}
                              name={`itinerary.${index}.description`}
                              render={({ field }) => (
                                <div className="border rounded-lg">
                                  <div className="border-b px-3 py-2 bg-gray-50">
                                    <div className="flex space-x-2">
                                      <span className="text-xs text-gray-500">Format:</span>
                                      <button
                                        type="button"
                                        className="px-2 py-1 text-xs bg-white rounded border text-gray-600 hover:text-gray-900"
                                      >
                                        Rich Text
                                      </button>
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <RichTextEditor
                                      content={field.value}
                                      onChange={field.onChange}
                                      error={!!errors.itinerary?.[index]?.description}
                                      compact={true}
                                    />
                                  </div>
                                </div>
                              )}
                            />
                          </FormField>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FormField
                              label="Elevation Gain (m)"
                              error={errors.itinerary?.[index]?.elevation_gain?.message}
                            >
                              <Input
                                type="number"
                                min="0"
                                {...register(`itinerary.${index}.elevation_gain`, { valueAsNumber: true })}
                                placeholder="0"
                              />
                            </FormField>

                            <FormField
                              label="Distance (km)"
                              error={errors.itinerary?.[index]?.distance?.message}
                            >
                              <Input
                                type="number"
                                min="0"
                                step="0.1"
                                {...register(`itinerary.${index}.distance`, { valueAsNumber: true })}
                                placeholder="0"
                              />
                            </FormField>

                            <FormField
                              label="Accommodation"
                              error={errors.itinerary?.[index]?.accommodation?.message}
                            >
                              <Input
                                {...register(`itinerary.${index}.accommodation`)}
                                placeholder="Hotel, tent, etc."
                              />
                            </FormField>

                            <FormField
                              label="Meals"
                              error={errors.itinerary?.[index]?.meals?.message}
                            >
                              <Input
                                {...register(`itinerary.${index}.meals`)}
                                placeholder="B,L,D"
                              />
                            </FormField>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Pricing & Group Size */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Pricing & Group Size</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Price (USD)"
                  required
                  error={errors.price?.message}
                >
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="1500"
                  />
                </FormField>

                <FormField
                  label="Minimum Group Size"
                  required
                  error={errors.group_size_min?.message}
                >
                  <Input
                    type="number"
                    min="1"
                    {...register("group_size_min", { valueAsNumber: true })}
                  />
                </FormField>

                <FormField
                  label="Maximum Group Size"
                  required
                  error={errors.group_size_max?.message}
                >
                  <Input
                    type="number"
                    min="1"
                    {...register("group_size_max", { valueAsNumber: true })}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Maximum Altitude (m)"
                  required
                  error={errors.max_altitude?.message}
                >
                  <Input
                    type="number"
                    min="0"
                    {...register("max_altitude", { valueAsNumber: true })}
                    placeholder="5500"
                  />
                </FormField>

                <FormField
                  label="Total Distance (km)"
                  error={errors.distance?.message}
                >
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    {...register("distance", { valueAsNumber: true })}
                    placeholder="120"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Best Season */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Best Season</h3>
            </CardHeader>
            <CardContent>
              <FormField
                label="Best Seasons"
                error={errors.best_season?.message}
                description="Select the best times of year for this trek"
              >
                <Controller
                  control={control}
                  name="best_season"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {seasonOptions.map((season) => (
                        <label key={season} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.value?.includes(season) || false}
                            onChange={(e) => {
                              const newSeasons = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...newSeasons, season]);
                              } else {
                                field.onChange(newSeasons.filter(s => s !== season));
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{season}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Requirements</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                label="Fitness Level Required"
                error={errors.fitness_level?.message}
              >
                <Controller
                  control={control}
                  name="fitness_level"
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                      error={!!errors.fitness_level}
                      compact={true}
                      placeholder="Describe the fitness level required for this trek..."
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Experience Required"
                error={errors.experience_required?.message}
              >
                <Controller
                  control={control}
                  name="experience_required"
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                      error={!!errors.experience_required}
                      compact={true}
                      placeholder="Describe any previous trekking or mountaineering experience required..."
                    />
                  )}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Dynamic Lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Includes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Includes</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendInclude("")}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {includesFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Input
                      {...register(`includes.${index}`)}
                      placeholder="What's included"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeInclude(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {includesFields.length === 0 && (
                  <p className="text-sm text-gray-500">No items added yet</p>
                )}
              </CardContent>
            </Card>

            {/* Excludes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Excludes</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendExclude("")}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {excludesFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Input
                      {...register(`excludes.${index}`)}
                      placeholder="What's not included"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeExclude(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {excludesFields.length === 0 && (
                  <p className="text-sm text-gray-500">No items added yet</p>
                )}
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Equipment List</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendEquipment("")}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {equipmentFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Input
                      {...register(`equipment_list.${index}`)}
                      placeholder="Required equipment"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeEquipment(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {equipmentFields.length === 0 && (
                  <p className="text-sm text-gray-500">No items added yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Images</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                label="Featured Image"
                error={errors.featured_image?.message}
                description="Main image that represents this trek"
              >
                <Controller
                  control={control}
                  name="featured_image"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="treks"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Gallery Images"
                error={errors.gallery?.message}
                description="Additional images showcasing the trek"
              >
                <Controller
                  control={control}
                  name="gallery"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="treks"
                      multiple
                      maxFiles={10}
                    />
                  )}
                />
              </FormField>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">SEO Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Meta Title"
                error={errors.meta_title?.message}
                description="Title tag for search engines (recommended: under 70 characters)"
              >
                <Input
                  {...register("meta_title")}
                  placeholder="Amazing Trek Through the Himalayas"
                  maxLength={70}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {(watch("meta_title") || "").length}/70 characters
                </div>
              </FormField>

              <FormField
                label="Meta Description"
                error={errors.meta_description?.message}
                description="Description for search results (recommended: under 160 characters)"
              >
                <Textarea
                  {...register("meta_description")}
                  rows={3}
                  placeholder="Join us on an unforgettable trekking adventure through pristine mountain landscapes..."
                  maxLength={160}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {(watch("meta_description") || "").length}/160 characters
                </div>
              </FormField>

              <FormField
                label="Meta Keywords"
                error={errors.meta_keywords?.message}
                description="Keywords related to this trek (one per line)"
              >
                <Controller
                  control={control}
                  name="meta_keywords"
                  render={({ field }) => (
                    <Textarea
                      value={field.value?.join("\n") || ""}
                      onChange={(e) => field.onChange(
                        e.target.value.split("\n").filter(k => k.trim())
                      )}
                      rows={4}
                      placeholder="himalaya trekking&#10;mountain adventure&#10;nepal trek"
                    />
                  )}
                />
              </FormField>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center space-x-4">
          {Object.keys(errors).length > 0 && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Please fix the errors above</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{mode === "create" ? "Create Trek" : "Update Trek"}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}