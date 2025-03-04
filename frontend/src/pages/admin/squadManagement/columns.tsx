import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Squad } from "@/types/squad";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const columns = (toggleSquadStatus: (id: string) => void): ColumnDef<Squad>[] => [
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
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const squadLogo = row.getValue("logo") as string;
      return (
        <img
          src={squadLogo || "https://avatar.iran.liara.run/public"}
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
    accessorKey: "category",
    header: () => <div className="text-center w-full">Category</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "members",
    header: () => <div className="text-center w-full">Members</div>,
    cell: ({ row }) => {
      const members = row.getValue("members") as string[];
      return <div className="text-center">{members?.length || 0}</div>;
    },
  },
  {
    accessorKey: "isPremium",
    header: () => <div className="text-center w-full">Type</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant={row.getValue("isPremium") ? "default" : "outline"}>
          {row.getValue("isPremium") ? "Premium" : "Free"}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value: string[]) => {
      const isPremium = row.getValue(id) as boolean;
      return value.includes(isPremium ? "Premium" : "Free");
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center w-full">Status</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge
          variant={row.getValue("isActive") ? "default" : "outline"}
          onClick={() => toggleSquadStatus(row.original._id)}
          className="cursor-pointer"
        >
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value: string[]) => {
      const isActive = row.getValue(id) as boolean;
      return value.includes(isActive.toString());
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
