import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import AdminUserService from "@/services/admin/userManagement";
import { UserManagementData } from "@/types/admin/user";
import { UseMutationResult } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const getUserTableColumns = (
  blockMutation: UseMutationResult<any, unknown, string>,
  unblockMutation: UseMutationResult<any, unknown, string>,
): ColumnDef<UserManagementData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "profilePic",
    header: "Profile",
    cell: ({ row }) => {
      const profilePic = row.getValue("profilePic") as string;
      return (
        <img
          src={profilePic || "https://avatar.iran.liara.run/public"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "postsCount",
    header: "Posts",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("postsCount")}</div>
    ),
  },
  {
    accessorKey: "joinedSquadsCount",
    header: "Joined Squads",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("joinedSquadsCount")}</div>
    ),
  },
  {
    accessorKey: "isBlocked",
    header: "Status",
    cell: ({ row }) => {
      const isBlocked = row.getValue("isBlocked") as boolean;
      return (
        <Badge
          variant={isBlocked ? "destructive" : "secondary"}
          className="text-xs"
        >
          {isBlocked ? "Blocked" : "Active"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const userId = row.original.id;
      const isBlocked = row.original.isBlocked;

      const handleBlockUnblock = () => {
        if (isBlocked) {
          unblockMutation.mutate(userId);
        } else {
          blockMutation.mutate(userId);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("View", userId)}>
              View user
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleBlockUnblock}>
              {isBlocked ? "Unblock" : "Block"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
