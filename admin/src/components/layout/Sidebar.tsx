"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image,
  Mountain,
  Map,
  Settings,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Blog",
    icon: FileText,
    children: [
      {
        name: "Posts",
        href: "/dashboard/blog",
        icon: FileText,
      },
      {
        name: "Categories",
        href: "/dashboard/blog/categories",
        icon: FolderTree,
      },
      {
        name: "Tags",
        href: "/dashboard/blog/tags",
        icon: Tags,
      },
    ],
  },
  {
    name: "Treks",
    icon: Mountain,
    children: [
      {
        name: "All Treks",
        href: "/dashboard/treks",
        icon: Mountain,
      },
      {
        name: "Categories",
        href: "/dashboard/treks/categories",
        icon: Map,
      },
    ],
  },
  {
    name: "Media",
    href: "/dashboard/media",
    icon: Image,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["Blog", "Treks"]));

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (item: NavigationItem): boolean => {
    if (item.href) {
      return pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    }
    // For parent items, check if any child is active
    return item.children?.some(child => isActive(child)) || false;
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const active = isActive(item);
    const expanded = expandedItems.has(item.name);

    if (item.children && item.children.length > 0) {
      // Parent item with children
      return (
        <li key={item.name}>
          <div>
            <button
              onClick={() => toggleExpanded(item.name)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                level > 0 && "ml-4"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {expanded ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </>
              )}
            </button>
            {sidebarOpen && expanded && (
              <ul className="mt-1 space-y-1 pl-6">
                {item.children.map((child) => renderNavigationItem(child, level + 1))}
              </ul>
            )}
          </div>
        </li>
      );
    } else {
      // Leaf item
      return (
        <li key={item.name}>
          <Link
            href={item.href!}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white",
              level > 0 && "ml-4"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>{item.name}</span>}
          </Link>
        </li>
      );
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gray-900 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
            <Mountain className="h-6 w-6 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-semibold text-white">Admin</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              !sidebarOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => renderNavigationItem(item))}
        </ul>
      </nav>

      {/* Settings at bottom */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white",
            pathname === "/dashboard/settings" && "bg-gray-800 text-white"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}


