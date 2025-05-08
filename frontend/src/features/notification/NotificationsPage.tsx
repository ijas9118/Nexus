import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import NotificationService from "@/services/notificationService";
import { NotificationHeader } from "./components/notification-header";
import { NotificationFilters } from "./components/notification-filters";
import { BulkActions } from "./components/bulk-actions";
import { LoadingState } from "./components/loading-state";
import { ErrorState } from "./components/error-state";
import { EmptyState } from "./components/empty-state";
import { NotificationList } from "./components/notification-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function NotificationsPage() {
  // Current user ID - in a real app, this would come from auth context
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id as string;

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Fetch notifications with React Query
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "notifications",
      userId,
      statusFilter === "read"
        ? true
        : statusFilter === "unread"
          ? false
          : undefined,
    ],
    queryFn: () =>
      NotificationService.getUserNotifications(
        userId,
        statusFilter === "read"
          ? true
          : statusFilter === "unread"
            ? false
            : undefined,
      ),
  });

  // Filter notifications based on search and type
  const filteredNotifications = notifications
    .filter((notification) => {
      // Type filter
      if (
        typeFilter !== "all" &&
        notification.notificationTypeId._id !== typeFilter
      ) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          notification.heading.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  console.log(filteredNotifications);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n._id));
    }
  };

  // Toggle selection of a notification
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col space-y-6">
        <NotificationHeader
          unreadCount={unreadCount}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          userId={userId}
        />

        {isFilterOpen && (
          <NotificationFilters
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {filteredNotifications.length > 0 && (
          <BulkActions
            selectedIds={selectedIds}
            filteredNotifications={filteredNotifications}
            handleSelectAll={handleSelectAll}
          />
        )}

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            onRetry={() =>
              queryClient.invalidateQueries({ queryKey: ["notifications"] })
            }
          />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
          />
        ) : (
          <NotificationList
            notifications={filteredNotifications}
            selectedIds={selectedIds}
            toggleSelection={toggleSelection}
          />
        )}
      </div>
    </div>
  );
}
