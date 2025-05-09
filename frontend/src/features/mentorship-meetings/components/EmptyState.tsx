import { Calendar } from "lucide-react";

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="rounded-full bg-muted p-6 mb-4">
      <Calendar className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium mb-2">No meetings found</h3>
    <p className="text-muted-foreground max-w-sm">{message}</p>
  </div>
);
