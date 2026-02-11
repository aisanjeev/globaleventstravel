"use client";

import { useState, useEffect } from "react";
import type { Office, OfficeCreate, OfficeUpdate } from "@/services/office.service";

interface OfficeFormModalProps {
  office?: Office | null;
  onClose: () => void;
  onSave: (data: OfficeCreate | OfficeUpdate) => Promise<void>;
}

const initialFormData: OfficeCreate = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  landmarks: "",
  phone: "",
  email: "",
  lat: 0,
  lng: 0,
  mapUrl: "",
  image: "",
};

export function OfficeFormModal({ office, onClose, onSave }: OfficeFormModalProps) {
  const [formData, setFormData] = useState<OfficeCreate>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!office;

  useEffect(() => {
    if (office) {
      setFormData({
        name: office.name,
        address: office.address,
        city: office.city,
        state: office.state,
        pincode: office.pincode,
        landmarks: office.landmarks || "",
        phone: office.phone,
        email: office.email,
        lat: office.coordinates.lat,
        lng: office.coordinates.lng,
        mapUrl: office.mapUrl,
        image: office.image || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [office]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...formData,
        landmarks: formData.landmarks || undefined,
        image: formData.image || undefined,
      };
      if (isEdit) {
        await onSave({
          name: payload.name,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          landmarks: payload.landmarks,
          phone: payload.phone,
          email: payload.email,
          lat: payload.lat,
          lng: payload.lng,
          mapUrl: payload.mapUrl,
          image: payload.image,
        });
      } else {
        await onSave(payload as OfficeCreate);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save office");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Office" : "Add Office Location"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. Manali Office"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <input
              type="text"
              required
              value={formData.pincode}
              onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Landmarks (optional)</label>
            <input
              type="text"
              value={formData.landmarks}
              onChange={(e) => setFormData((p) => ({ ...p, landmarks: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Near main market"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
              <input
                type="number"
                required
                step="any"
                value={formData.lat || ""}
                onChange={(e) => setFormData((p) => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="32.2396"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
              <input
                type="number"
                required
                step="any"
                value={formData.lng || ""}
                onChange={(e) => setFormData((p) => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="77.1887"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL *</label>
            <input
              type="url"
              required
              value={formData.mapUrl}
              onChange={(e) => setFormData((p) => ({ ...p, mapUrl: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://maps.google.com/..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Update Office" : "Add Office"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
