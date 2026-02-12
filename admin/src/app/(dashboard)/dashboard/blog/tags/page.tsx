"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { tagService } from "@/services/tag.service";
import { useUIStore } from "@/store/ui.store";
import { slugify } from "@/lib/utils";
import type { BlogTag } from "@/types/api";
import { Plus, Trash2, Tags, X, Pencil, Check } from "lucide-react";

export default function TagsPage() {
  const { addToast } = useUIStore();
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const fetchTags = async () => {
    try {
      const data = await tagService.list();
      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    try {
      await tagService.create({ name: name.trim(), slug: slug.trim() });
      addToast({ type: "success", message: "Tag created successfully" });
      setName("");
      setSlug("");
      setShowForm(false);
      fetchTags();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to create tag",
      });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (tag: BlogTag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditSlug(tag.slug);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  };

  const handleEditNameChange = (value: string) => {
    setEditName(value);
    setEditSlug(slugify(value));
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim() || !editSlug.trim()) return;

    setEditSaving(true);
    try {
      await tagService.update(id, {
        name: editName.trim(),
        slug: editSlug.trim(),
      });
      addToast({ type: "success", message: "Tag updated successfully" });
      cancelEdit();
      fetchTags();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to update tag",
      });
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      await tagService.delete(id);
      addToast({ type: "success", message: "Tag deleted successfully" });
      fetchTags();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to delete tag",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Tags"
        description="Manage tags for cross-category content organization"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog Posts", href: "/dashboard/blog" },
          { label: "Tags" },
        ]}
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                New Tag
              </>
            )}
          </Button>
        }
      />

      {/* Quick Create Form */}
      {showForm && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-4">
              <FormField label="Name" className="flex-1">
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter tag name"
                />
              </FormField>
              <FormField label="Slug" className="flex-1">
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="tag-slug"
                />
              </FormField>
              <Button type="submit" loading={saving}>
                Create Tag
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        {loading ? (
          <CardContent className="py-12 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </CardContent>
        ) : tags.length === 0 ? (
          <CardContent className="py-12 text-center">
            <Tags className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No tags yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4" />
              Create your first tag
            </Button>
          </CardContent>
        ) : (
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="group flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm transition-colors hover:bg-gray-200"
                >
                  <span className="font-medium text-gray-700">{tag.name}</span>
                  <span className="text-gray-500">({tag.post_count || 0})</span>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="ml-1 rounded-full p-0.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                    title="Delete"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        )}

        {/* Tags Table */}
        {tags.length > 0 && (
          <div className="border-t border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Posts
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {editingId === tag.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => handleEditNameChange(e.target.value)}
                          className="max-w-[200px]"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">
                          {tag.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === tag.id ? (
                        <Input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="max-w-[200px]"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {tag.slug}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {tag.post_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === tag.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleUpdate(tag.id)}
                            disabled={editSaving}
                            className="rounded p-1.5 text-green-600 hover:bg-green-50"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(tag)}
                            className="rounded p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id)}
                            className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
