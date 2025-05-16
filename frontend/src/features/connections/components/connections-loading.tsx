import { Skeleton } from "@/components/atoms/skeleton";

export default function ConnectionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <div className="grid gap-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-10 w-[100px]" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
