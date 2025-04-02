import { Skeleton } from "@/components/atoms/skeleton";

export const ContentLoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="mb-6 flex items-center gap-2">
      <Skeleton className="h-6 w-32 rounded-full" />
    </div>
    <Skeleton className="h-10 w-3/4 mb-4" />
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="w-full h-96 rounded-lg mb-8" />
    <div className="space-y-4 mb-10">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="flex items-center justify-between py-4 border-y">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
    <div className="mt-8">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-8 w-20 ml-auto rounded-md" />
        </div>
      </div>
      <div className="space-y-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
