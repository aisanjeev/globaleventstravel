"use client";

import { useEffect, useState } from "react";
import { trekService } from "@/services/trek.service";
import type { TrekBatch, TrekBatchCreate } from "@/types/api";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

interface BatchManagerProps {
  trekId: number;
}

const emptyForm = (): TrekBatchCreate => ({
  start_date: "",
  end_date: "",
  total_seats: 20,
  booked_seats: 0,
  price_override: undefined,
  is_active: true,
  notes: "",
});

export default function BatchManager({ trekId }: BatchManagerProps) {
  const [batches, setBatches] = useState<TrekBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TrekBatchCreate>(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await trekService.getBatches(trekId);
      setBatches(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [trekId]);

  const validateForm = (): string | null => {
    if (!form.start_date || !form.end_date) return "Start and end dates are required.";
    if (form.end_date <= form.start_date) return "End date must be after start date.";
    if ((form.booked_seats ?? 0) > form.total_seats) return "Booked seats cannot exceed total seats.";
    return null;
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (batch: TrekBatch) => {
    setEditingId(batch.id);
    setForm({
      start_date: batch.start_date,
      end_date: batch.end_date,
      total_seats: batch.total_seats,
      booked_seats: batch.booked_seats,
      price_override: batch.price_override,
      is_active: batch.is_active,
      notes: batch.notes ?? "",
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price_override: form.price_override || undefined,
        notes: form.notes || undefined,
      };
      if (editingId !== null) {
        await trekService.updateBatch(trekId, editingId, payload);
      } else {
        await trekService.createBatch(trekId, payload);
      }
      await load();
      closeForm();
    } catch (e: any) {
      setFormError(e?.message ?? "Failed to save batch.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (batchId: number) => {
    if (!window.confirm("Delete this batch? This cannot be undone.")) return;
    try {
      await trekService.deleteBatch(trekId, batchId);
      setBatches((prev) => prev.filter((b) => b.id !== batchId));
    } catch {
      alert("Failed to delete batch.");
    }
  };

  const fmtDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  if (loading) {
    return <div className="text-sm text-gray-500 py-4">Loading batches…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {batches.length === 0 ? "No batches yet." : `${batches.length} batch${batches.length !== 1 ? "es" : ""}`}
        </p>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Batch
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="border border-primary-200 rounded-xl bg-primary-50 p-5 space-y-4">
          <h4 className="font-semibold text-gray-800">{editingId ? "Edit Batch" : "New Batch"}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date *</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date *</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Total Seats *</label>
              <input
                type="number"
                min={1}
                max={500}
                value={form.total_seats}
                onChange={(e) => setForm({ ...form, total_seats: parseInt(e.target.value) || 1 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Booked Seats</label>
              <input
                type="number"
                min={0}
                value={form.booked_seats ?? 0}
                onChange={(e) => setForm({ ...form, booked_seats: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Price Override <span className="text-gray-400">(leave blank to use trek price)</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price_override ?? ""}
                onChange={(e) =>
                  setForm({ ...form, price_override: e.target.value ? parseFloat(e.target.value) : undefined })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>
            <div className="flex items-center gap-3 mt-5">
              <label className="text-xs font-medium text-gray-600">Active</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                className={`relative w-10 h-6 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <input
              type="text"
              maxLength={500}
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional notes for this batch"
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving…" : editingId ? "Update" : "Add Batch"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Batches Table */}
      {batches.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Date Range</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center">Booked</th>
                <th className="px-4 py-3 text-center">Available</th>
                <th className="px-4 py-3 text-center">Price</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map((batch) => (
                <tr
                  key={batch.id}
                  className={batch.is_sold_out ? "bg-red-50" : "bg-white hover:bg-gray-50"}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {fmtDate(batch.start_date)} – {fmtDate(batch.end_date)}
                  </td>
                  <td className="px-4 py-3 text-center">{batch.total_seats}</td>
                  <td className="px-4 py-3 text-center">{batch.booked_seats}</td>
                  <td className="px-4 py-3 text-center">
                    {batch.is_sold_out ? (
                      <span className="text-red-600 font-semibold">Sold Out</span>
                    ) : (
                      <span className="text-green-600 font-semibold">{batch.available_seats}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {batch.price_override ? `₹${batch.price_override.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        batch.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {batch.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(batch)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(batch.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
