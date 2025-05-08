import type { INotification } from "@/types/notification";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: INotification[];
  selectedIds: string[];
  toggleSelection: (id: string) => void;
}

export function NotificationList({
  notifications,
  selectedIds,
  toggleSelection,
}: NotificationListProps) {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          isSelected={selectedIds.includes(notification._id)}
          onToggleSelection={toggleSelection}
        />
      ))}
    </div>
  );
}
