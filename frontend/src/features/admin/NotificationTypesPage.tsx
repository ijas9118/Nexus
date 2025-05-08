import { Skeleton } from "@/components/atoms/skeleton";
import { Suspense } from "react";
import NotificationTypeManagement from "./notification-type/NotificationTypeManagement";

export default function NotificationTypesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-bold mb-6">Notification Types Management</h1>
      <Suspense fallback={<NotificationTypesSkeleton />}>
        <NotificationTypeManagement />
      </Suspense>
    </div>
  );
}

function NotificationTypesSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
