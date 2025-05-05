import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { Badge } from "@/components/atoms/badge";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { Input } from "@/components/atoms/input";
import type { MentorMetadataData } from "@/services/mentorMetadataService";

interface MetadataTableProps {
  data: MentorMetadataData[];
  onEdit: (item: MentorMetadataData) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export default function MetadataTable({
  data,
  onEdit,
  onDelete,
  onRestore,
}: MetadataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof MentorMetadataData>("label");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof MentorMetadataData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "experienceLevel":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "expertiseArea":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "technology":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "experienceLevel":
        return "Experience Level";
      case "expertiseArea":
        return "Expertise Area";
      case "technology":
        return "Technology";
      default:
        return type;
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search metadata..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className=" cursor-pointer "
                onClick={() => handleSort("label")}
              >
                <div className="flex items-center space-x-1 ">
                  <span>Label</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer "
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No metadata found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow
                  key={item._id}
                  className={!item.isActive ? "opacity-60" : ""}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getTypeColor(item.type)}
                    >
                      {getTypeLabel(item.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-destructive/10 text-destructive border-destructive/20"
                      >
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {item.isActive ? (
                          <DropdownMenuItem
                            onClick={() => onDelete(item._id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onRestore(item._id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
