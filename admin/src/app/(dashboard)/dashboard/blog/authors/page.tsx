"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { blogService } from "@/services/blog.service";
import { useUIStore } from "@/store/ui.store";
import type { BlogAuthor } from "@/types/api";
import {
  Plus,
  Trash2,
  Users,
  X,
  Pencil,
  Check,
} from "lucide-react";

interface AuthorForm {
  name: string;
  role: string;
  bio: string;
}

const emptyForm: AuthorForm = { name: "", role: "", bio: "" };

export default function AuthorsPage() {
  const { addToast } = useUIStore();
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AuthorForm>(emptyForm);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AuthorForm>(emptyForm);
  const [editSaving, setEditSaving] = useState(false);

  const fetchAuthors = async () => {
    try {
      const data = await blogService.getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      await blogService.createAuthor({
        name: form.name.trim(),
        role: form.role.trim() || undefined,
        bio: form.bio.trim() || undefined,
      });
      addToast({ type: "success", message: "Author created successfully" });
      setForm(emptyForm);
      setShowForm(false);
      fetchAuthors();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to create author",
      });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (author: BlogAuthor) => {
    setEditingId(author.id);
    setEditForm({
      name: author.name,
      role: author.role || "",
      bio: author.bio || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleUpdate = async (id: number) => {
    if (!editForm.name.trim()) return;

    setEditSaving(true);
    try {
      await blogService.updateAuthor(id, {
        name: editForm.name.trim(),
        role: editForm.role.trim() || undefined,
        bio: editForm.bio.trim() || undefined,
      });
      addToast({ type: "success", message: "Author updated successfully" });
      cancelEdit();
      fetchAuthors();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to update author",
      });
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    try {
      await blogService.deleteAuthor(id);
      addToast({ type: "success", message: "Author deleted successfully" });
      fetchAuthors();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Failed to delete author",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Authors"
        description="Manage blog post authors"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog Posts", href: "/dashboard/blog" },
          { label: "Authors" },
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
                New Author
              </>
            )}
          </Button>
        }
      />

      {/* Create Form */}
      {showForm && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Name" required>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Author name"
                  />
                </FormField>
                <FormField label="Role">
                  <Input
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                    placeholder="e.g. Head Guide, Trek Leader"
                  />
                </FormField>
              </div>
              <FormField label="Bio">
                <Input
                  value={form.bio}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                  placeholder="Short bio"
                />
              </FormField>
              <div className="flex justify-end">
                <Button type="submit" loading={saving}>
                  Create Author
                </Button>
              </div>
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
        ) : authors.length === 0 ? (
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No authors yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4" />
              Create your first author
            </Button>
          </CardContent>
        ) : (
          <div className="divide-y divide-gray-200">
            {authors.map((author) => (
              <div key={author.id} className="px-6 py-5 hover:bg-gray-50">
                {editingId === author.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField label="Name">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              name: e.target.value,
                            })
                          }
                        />
                      </FormField>
                      <FormField label="Role">
                        <Input
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              role: e.target.value,
                            })
                          }
                        />
                      </FormField>
                    </div>
                    <FormField label="Bio">
                      <Input
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bio: e.target.value,
                          })
                        }
                      />
                    </FormField>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        loading={editSaving}
                        onClick={() => handleUpdate(author.id)}
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {author.name}
                      </h3>
                      {author.role && (
                        <p className="text-sm text-primary-600">
                          {author.role}
                        </p>
                      )}
                      {author.bio && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {author.bio}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(author)}
                        className="rounded p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
                        className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
