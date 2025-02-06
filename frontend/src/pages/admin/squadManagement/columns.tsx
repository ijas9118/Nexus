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
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export interface Squad {
  _id: string;
  name: string;
  category: string;
  membersCount: number;
  isActive: boolean;
}

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
    accessorKey: "membersCount",
    header: () => <div className="text-center w-full">Members</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("membersCount")}</div>,
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
