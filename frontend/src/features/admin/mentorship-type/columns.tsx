import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { motion } from "framer-motion";
import { MentorshipTypeData } from "@/types/mentor";

interface ColumnActionsProps {
  onEdit: (type: MentorshipTypeData) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onRestore,
}: ColumnActionsProps): ColumnDef<MentorshipTypeData>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div
          className="max-w-[300px] truncate"
          title={row.getValue("description")}
        >
          {row.getValue("description")}
        </div>
      );
    },
  },
  {
    accessorKey: "defaultPrice",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("defaultPrice") as number;
      return <div className="w-[100px]">₹{price.toLocaleString("en-IN")}</div>;
    },
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Badge
            variant={isActive ? "default" : "destructive"}
            className="font-medium"
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </motion.div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const type = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(type)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {type.isActive ? (
              <DropdownMenuItem onClick={() => onDelete(type._id as string)}>
                <Trash className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onRestore(type._id as string)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Restore
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
