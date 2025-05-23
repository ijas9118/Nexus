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
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const columns = (): ColumnDef<any>[] => [
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const { thumbnailUrl, title } = row.original;
      return (
        <div className="flex items-center space-x-2">
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            className="w-10 h-10 rounded-md object-cover"
          />
          <span>{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const { name, profilePic } = row.original.author;
      return (
        <div className="flex items-center space-x-2">
          <img
            src={profilePic || "https://avatar.iran.liara.run/public"}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant={row.original.contentType === "Blog" ? "default" : "outline"}
      >
        {row.original.contentType}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "status", // Change from accessorKey to id
    header: "Status",
    accessorFn: (row) => (row.isPremium ? "Premium" : "Free"), // Explicitly derive status
    cell: ({ row }) => (
      <Badge variant={row.original.isPremium ? "default" : "outline"}>
        {row.original.isPremium ? "Premium" : "Free"}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) => {
      const status = row.getValue(id) as string;
      return value.includes(status);
    },
  },
  {
    id: "verified", // New column for isVerified
    header: "Verified",
    accessorFn: (row) => (row.isVerified ? "Verified" : "Not Verified"), // Explicitly derive verified status
    cell: ({ row }) => (
      <Badge
        variant={row.original.isVerified ? "default" : "outline"}
        className={
          row.original.isVerified
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" // Verified
            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100" // Not Verified
        }
      >
        {row.original.isVerified ? "Verified" : "Not Verified"}
      </Badge>
    ),
    filterFn: (row, id, value: string[]) => {
      const verifiedStatus = row.getValue(id) as string;
      return value.includes(verifiedStatus);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log(category._id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Toggle Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
