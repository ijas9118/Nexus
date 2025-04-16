import React, { Suspense, lazy, useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/table";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { MentorshipConfig } from "@/types/mentor";
import { useMentorshipConfigs } from "./mentorship-config/useMentorshipConfigs";

// Lazy load the form component for code splitting
const MentorshipConfigForm = lazy(
  () => import("./mentorship-config/mentorshipConfigForm"),
);

const MentorshipConfigManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<MentorshipConfig | null>(
    null,
  );

  const {
    configs,
    isLoading,
    handleCreateConfig,
    handleUpdateConfig,
    handleDeleteConfig,
  } = useMentorshipConfigs();

  const handleEdit = (config: MentorshipConfig) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingConfig(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Mentorship Configuration Management
        </h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Configuration
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <MentorshipConfigForm
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          editingConfig={editingConfig}
          onCreate={handleCreateConfig}
          onUpdate={handleUpdateConfig}
        />
      </Suspense>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config._id}>
                <TableCell>{config.category}</TableCell>
                <TableCell>{config.value}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      config.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {config.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(config.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(config)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConfig(config._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MentorshipConfigManagement;
