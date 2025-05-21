import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">Admin User</div>
          <div className="text-sm text-muted-foreground">admin@example.com</div>
        </div>
      </div>
    </div>
  );
}
