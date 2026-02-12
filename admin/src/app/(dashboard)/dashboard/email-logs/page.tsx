"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { emailLogService, type EmailLogItem, type EmailLogListParams } from "@/services/emailLog.service";
import { useUIStore } from "@/store/ui.store";
import { formatDate } from "@/lib/utils";
import { Mail, RefreshCw, CheckCircle, Eye } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "lead_notification", label: "Lead Notification" },
  { value: "contact_notification", label: "Contact Notification" },
  { value: "itinerary", label: "Itinerary" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "sent", label: "Sent" },
  { value: "delivered", label: "Delivered" },
  { value: "opened", label: "Opened" },
  { value: "bounced", label: "Bounced" },
  { value: "error", label: "Error" },
];

export default function EmailLogsPage() {
  const { addToast } = useUIStore();

  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 15;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: EmailLogListParams = {
        skip: (page - 1) * limit,
        limit,
      };
      if (typeFilter) params.email_type = typeFilter as any;
      if (statusFilter) params.status = statusFilter as any;

      const data = await emailLogService.list(params);
      setLogs(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch email logs:", error);
      addToast({ type: "error", message: "Failed to load email logs" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, typeFilter, statusFilter]);

  const totalPages = Math.ceil(total / limit) || 1;

  const statusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "info" | "default" | "danger"> = {
      sent: "warning",
      delivered: "info",
      opened: "success",
      bounced: "default",
      error: "danger",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div>
      <PageHeader
        title="Email Logs"
        description="Monitor sent emails, delivery status, and open tracking."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Email Logs" },
        ]}
      />

      <Card className="mb-6">
        <CardContent className="py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 py-2 px-3 text-sm"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 py-2 px-3 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No email logs yet.</p>
              <p className="text-sm mt-1">Logs appear when leads submit forms and emails are sent.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Recipient</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Attempted at</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Delivered</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Opened</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{log.recipient_email}</td>
                      <td className="py-3 px-4 text-sm max-w-xs truncate">{log.subject}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="capitalize">{log.email_type.replace("_", " ")}</span>
                      </td>
                      <td className="py-3 px-4">{statusBadge(log.status)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600" title={log.status === "error" ? "Attempt failed" : undefined}>
                        {log.status === "error" ? (
                          <span className="text-red-600">{formatDate(log.sent_at)} (failed)</span>
                        ) : (
                          formatDate(log.sent_at)
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {log.delivered_at ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            {formatDate(log.delivered_at)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {log.opened_at ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <Eye className="h-4 w-4" />
                            {formatDate(log.opened_at)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
