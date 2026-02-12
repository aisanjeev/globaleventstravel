"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Building2, MapPin, Plus, Pencil, Trash2, User, Bell, Shield, Palette, Star, RefreshCw } from "lucide-react";
import { settingsService, type SiteSettings } from "@/services/settings.service";
import { googleReviewsService } from "@/services/google-reviews.service";
import { officeService, type Office } from "@/services/office.service";
import { OfficeFormModal } from "@/components/settings/OfficeFormModal";
import { handleApiError } from "@/lib/api-client";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    tagline: "",
    description: "",
    url: "",
    email: "",
    phone: "",
    address: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
  });
  const [offices, setOffices] = useState<Office[]>([]);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [officeModal, setOfficeModal] = useState<{ open: boolean; office: Office | null }>({
    open: false,
    office: null,
  });
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await settingsService.get();
        setSettings(data);
        setFormData({
          company_name: data.company_name || "",
          tagline: data.tagline || "",
          description: data.description || "",
          url: data.url || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          twitter_url: data.twitter_url || "",
          youtube_url: data.youtube_url || "",
        });
      } catch (e) {
        setError(handleApiError(e).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadOffices() {
      try {
        const list = await officeService.list();
        setOffices(list);
      } catch {
        setOffices([]);
      } finally {
        setOfficesLoading(false);
      }
    }
    loadOffices();
  }, []);

  const handleSaveCompany = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await settingsService.update({
        company_name: formData.company_name || undefined,
        tagline: formData.tagline || null,
        description: formData.description || null,
        url: formData.url || null,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || null,
        facebook_url: formData.facebook_url || null,
        instagram_url: formData.instagram_url || null,
        twitter_url: formData.twitter_url || null,
        youtube_url: formData.youtube_url || null,
      });
      setSettings(updated);
    } catch (e) {
      setError(handleApiError(e).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOffice = async (
    data: import("@/services/office.service").OfficeCreate | import("@/services/office.service").OfficeUpdate
  ) => {
    if (officeModal.office) {
      await officeService.update(officeModal.office.id, data);
    } else {
      await officeService.create(data as Parameters<typeof officeService.create>[0]);
    }
    const list = await officeService.list();
    setOffices(list);
  };

  const handleDeleteOffice = async (id: number) => {
    if (!confirm("Delete this office?")) return;
    await officeService.delete(id);
    setOffices((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSyncGoogleReviews = async () => {
    setSyncLoading(true);
    setSyncMessage(null);
    try {
      const result = await googleReviewsService.sync();
      setSyncMessage(`Successfully synced ${result.synced} reviews.`);
    } catch (e) {
      setSyncMessage(handleApiError(e).message);
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
        breadcrumbs={[{ label: "Settings" }]}
      />

      {/* Company Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Company Information</h2>
            <p className="text-sm text-gray-500">Manage your site-wide company details and social links</p>
          </div>
        </div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData((p) => ({ ...p, company_name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Company name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Adventure Awaits in the Himalayas"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Company description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="info@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="+91 12345 67890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="City, State, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData((p) => ({ ...p, facebook_url: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData((p) => ({ ...p, instagram_url: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData((p) => ({ ...p, twitter_url: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData((p) => ({ ...p, youtube_url: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        )}
        {!loading && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveCompany}
              disabled={saving}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Company Info"}
            </button>
          </div>
        )}
      </div>

      {/* Office Locations */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Office Locations</h2>
              <p className="text-sm text-gray-500">Manage your branch offices shown on the contact page</p>
            </div>
          </div>
          <button
            onClick={() => setOfficeModal({ open: true, office: null })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Office
          </button>
        </div>
        {officesLoading ? (
          <div className="text-sm text-gray-500">Loading offices...</div>
        ) : offices.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No offices yet. Click &quot;Add Office&quot; to add your first location.
          </div>
        ) : (
          <div className="space-y-3">
            {offices.map((office) => (
              <div
                key={office.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{office.name}</h3>
                  <p className="text-sm text-gray-600">
                    {office.address}, {office.city}, {office.state}
                  </p>
                  <p className="text-sm text-gray-500">{office.phone} · {office.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOfficeModal({ open: true, office })}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOffice(office.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {officeModal.open && (
        <OfficeFormModal
          office={officeModal.office}
          onClose={() => setOfficeModal({ open: false, office: null })}
          onSave={handleSaveOffice}
        />
      )}

      {/* Google Reviews Sync */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Google Reviews</h2>
              <p className="text-sm text-gray-500">
                Sync reviews from Google Places API. Run weekly to keep reviews up to date.
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncGoogleReviews}
            disabled={syncLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncLoading ? "animate-spin" : ""}`} />
            {syncLoading ? "Syncing..." : "Sync Now"}
          </button>
        </div>
        {syncMessage && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              syncMessage.startsWith("Success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {syncMessage}
          </div>
        )}
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Profile</h2>
              <p className="text-sm text-gray-500">Manage your profile information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Configure notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email notifications</span>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">New lead alerts</span>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Contact form submissions</span>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Manage your password and security</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Palette className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-500">Customize the dashboard look</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Compact sidebar</span>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Dark mode</span>
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
