"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { contactService, type ContactListParams } from "@/services/contact.service";
import type { ContactMessageListItem, ContactStatus } from "@/types/api";
import { useUIStore } from "@/store/ui.store";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, RefreshCw, MessageSquare } from "lucide-react";

const STATUS_OPTIONS: { value: ContactStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

export default function ContactListPage() {
  const { addToast } = useUIStore();

  const [contacts, setContacts] = useState<ContactMessageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [search, setSearch] = useState("");
  const limit = 10;

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params: ContactListParams = {
        skip: (page - 1) * limit,
        limit,
        status: statusFilter,
      };
      const data = await contactService.list(params);
      let items = data.items;
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(
          (c) =>
            c.name.toLowerCase().includes(s) ||
            c.email.toLowerCase().includes(s) ||
            c.subject.toLowerCase().includes(s)
        );
      }
      setContacts(items);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch contact messages:", error);
      addToast({ type: "error", message: "Failed to load contact messages" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, search]);

  const totalPages = Math.ceil(total / limit) || 1;

  const statusBadgeVariant = (status: ContactStatus) => {
    switch (status) {
      case "unread":
        return "warning";
      case "read":
        return "info";
      case "replied":
        return "success";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        description="View messages submitted from your contact form."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Contact Messages" },
        ]}
      />

      <Card className="mb-6">
        <CardContent className="py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ContactStatus | "all");
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      Loading contact messages...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No contact messages found.
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {contact.subject}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant(contact.status)}>
                          {contact.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(contact.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span>View in detail page (coming soon)</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-xs text-gray-600">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} messages
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-xs text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

