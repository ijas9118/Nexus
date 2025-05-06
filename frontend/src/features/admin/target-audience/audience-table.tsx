import { format } from "date-fns";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/table";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import type { TargetAudienceData } from "@/services/targetAudienceService";

interface AudienceTableProps {
  audiences: TargetAudienceData[];
  onEdit: (audience: TargetAudienceData) => void;
  onDelete: (audience: TargetAudienceData) => void;
  onRestore: (audience: TargetAudienceData) => void;
}

export function AudienceTable({
  audiences,
  onEdit,
  onDelete,
  onRestore,
}: AudienceTableProps) {
  console.log(audiences);
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audiences.map((audience) => (
            <TableRow key={audience._id} className="hover:bg-muted-50/50">
              <TableCell className="font-medium">{audience.name}</TableCell>
              <TableCell>
                {audience.isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-pink-500 border-pink-300"
                  >
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(audience.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(audience)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4 text-teal-700" />
                    <span className="sr-only">Edit</span>
                  </Button>

                  {audience.isActive ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(audience)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-pink-600" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRestore(audience)}
                      className="h-8 w-8"
                    >
                      <RefreshCw className="h-4 w-4 text-emerald-600" />
                      <span className="sr-only">Restore</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
