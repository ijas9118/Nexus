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
import { Button } from "@/components/atoms/button";
import { MoreHorizontal, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog";
import type { NotificationTypeData } from "@/types/notification";
import { DynamicIcon } from "./dynamic-icon";

interface NotificationTypeListProps {
  notificationTypes: NotificationTypeData[];
  onEdit: (notificationType: NotificationTypeData) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export default function NotificationTypeList({
  notificationTypes,
  onEdit,
  onToggleActive,
}: NotificationTypeListProps) {
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<boolean | null>(null);

  const handleToggleClick = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    setTogglingStatus(currentStatus);
    setToggleDialogOpen(true);
  };

  const confirmToggle = () => {
    if (togglingId && togglingStatus !== null) {
      onToggleActive(togglingId, togglingStatus);
      setToggleDialogOpen(false);
      setTogglingId(null);
      setTogglingStatus(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notificationTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No notification types found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              notificationTypes.map((type) => (
                <TableRow key={type._id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {type.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="h-8 w-8 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: `${type.iconColor}20` }}
                      >
                        <DynamicIcon
                          name={type.icon}
                          color={type.iconColor}
                          size={16}
                        />
                      </div>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {type.icon}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {type.roles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={type.isActive ? "default" : "secondary"}>
                      {type.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(type)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleClick(type._id, type.isActive)
                          }
                          className={
                            type.isActive
                              ? "text-destructive focus:text-destructive"
                              : "text-green-600 focus:text-green-600"
                          }
                        >
                          {type.isActive ? (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {togglingStatus ? "deactivate" : "activate"} this notification
              type? This will affect how notifications are sent for this type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggle}
              className={
                togglingStatus
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {togglingStatus ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
