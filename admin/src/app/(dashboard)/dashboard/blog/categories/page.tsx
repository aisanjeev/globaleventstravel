"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { categoryService } from "@/services/category.service";
import { useUIStore } from "@/store/ui.store";
import { slugify } from "@/lib/utils";
import type { BlogCategoryTree, BlogCategory } from "@/types/api";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function CategoriesPage() {
  const { addToast } = useUIStore();
  const [categories, setCategories] = useState<BlogCategoryTree[]>([]);
  const [flatCategories, setFlatCategories] = useState<
    Array<BlogCategory & { level: number; fullPath: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: null as number | null,
    display_order: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getTree();
      setCategories(data);
      setFlatCategories(categoryService.flattenTree(data));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingCategory ? formData.slug : slugify(name),
    });
  };

  const openCreateModal = (parentId: number | null = null) => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      parent_id: parentId,
      display_order: 0,
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parent_id: category.parent_id || null,
      display_order: category.display_order,
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        addToast({ type: "success", message: "Category updated successfully" });
      } else {
        await categoryService.create(formData);
        addToast({ type: "success", message: "Category created successfully" });
      }
      setShowModal(false);
      fetchCategories();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to save category",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoryService.delete(id);
      addToast({ type: "success", message: "Category deleted successfully" });
      fetchCategories();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to delete category",
      });
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderCategory = (category: BlogCategoryTree, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <div key={category.id}>
        <div
          className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 border-b border-gray-100"
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 rounded hover:bg-gray-200"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <FolderTree className="h-5 w-5 text-gray-400" />
            <div>
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({category.post_count} posts)
              </span>
            </div>
            {!category.is_active && (
              <Badge variant="warning">Inactive</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openCreateModal(category.id)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              title="Add child category"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => openEditModal(category)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your blog content with hierarchical categories"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog Posts", href: "/dashboard/blog" },
          { label: "Categories" },
        ]}
        actions={
          <Button onClick={() => openCreateModal()}>
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        }
      />

      <Card>
        {loading ? (
          <CardContent className="py-12 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </CardContent>
        ) : categories.length === 0 ? (
          <CardContent className="py-12 text-center">
            <FolderTree className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No categories yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => openCreateModal()}
            >
              <Plus className="h-4 w-4" />
              Create your first category
            </Button>
          </CardContent>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((category) => renderCategory(category))}
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? "Edit Category" : "Create Category"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name" required>
            <Input
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Category name"
            />
          </FormField>

          <FormField label="Slug" required>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="category-slug"
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional description"
              rows={3}
            />
          </FormField>

          <FormField label="Parent Category">
            <Select
              value={formData.parent_id?.toString() || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parent_id: e.target.value ? parseInt(e.target.value) : null,
                })
              }
            >
              <option value="">No parent (root category)</option>
              {flatCategories
                .filter((c) => c.id !== editingCategory?.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.fullPath}
                  </option>
                ))}
            </Select>
          </FormField>

          <FormField label="Display Order">
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
            />
          </FormField>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <Switch
              checked={formData.is_active}
              onChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


