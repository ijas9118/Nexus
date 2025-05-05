import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardFooter } from "@/components/molecules/card";

import TargetAudienceService, {
  type TargetAudienceData,
} from "@/services/targetAudienceService";
import { toast } from "sonner";
import { PageHeader } from "./target-audience/page-header";
import { SearchFilterBar } from "./target-audience/search-filter-bar";
import { EmptyState } from "./target-audience/empty-state";
import { AudienceTable } from "./target-audience/audience-table";
import { AudienceFormDialog } from "./target-audience/audience-form-dialog";
import { ConfirmationDialog } from "./target-audience/confirmation-dialog";

export default function TargetAudiencesPage() {
  const [targetAudiences, setTargetAudiences] = useState<TargetAudienceData[]>(
    [],
  );
  const [filteredAudiences, setFilteredAudiences] = useState<
    TargetAudienceData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const [currentAudience, setCurrentAudience] =
    useState<TargetAudienceData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch target audiences
  const fetchTargetAudiences = async () => {
    setLoading(true);
    try {
      const data = await TargetAudienceService.getAll(includeInactive);
      setTargetAudiences(data);
      setFilteredAudiences(data);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch target audiences",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTargetAudiences();
  }, [includeInactive]);

  // Filter audiences based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAudiences(targetAudiences);
    } else {
      const filtered = targetAudiences.filter((audience) =>
        audience.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredAudiences(filtered);
    }
  }, [searchQuery, targetAudiences]);

  // Handle create audience
  const handleCreateAudience = async (formData: {
    name: string;
    isActive: boolean;
  }) => {
    if (!formData.name.trim()) {
      toast.error("Validation Error", {
        description: "Name is required",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await TargetAudienceService.create({
        name: formData.name,
        isActive: formData.isActive,
      });

      toast.success("Success", {
        description: "Target audience created successfully",
      });

      setIsCreateDialogOpen(false);
      fetchTargetAudiences();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create target audience",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update audience
  const handleUpdateAudience = async (formData: {
    name: string;
    isActive: boolean;
  }) => {
    if (!currentAudience || !formData.name.trim()) {
      toast.error("Validation Error", {
        description: "Name is required",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await TargetAudienceService.update(currentAudience._id, {
        name: formData.name,
        isActive: formData.isActive,
      });

      toast.success("Success", {
        description: "Target audience updated successfully",
      });

      setIsEditDialogOpen(false);
      setCurrentAudience(null);
      fetchTargetAudiences();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update target audience",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete audience
  const handleDeleteAudience = async () => {
    if (!currentAudience) return;

    setIsSubmitting(true);
    try {
      await TargetAudienceService.softDelete(currentAudience._id);

      toast.success("Success", {
        description: "Target audience deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setCurrentAudience(null);
      fetchTargetAudiences();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete target audience",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle restore audience
  const handleRestoreAudience = async () => {
    if (!currentAudience) return;

    setIsSubmitting(true);
    try {
      await TargetAudienceService.restore(currentAudience._id);

      toast.success("Success", {
        description: "Target audience restored successfully",
      });

      setIsRestoreDialogOpen(false);
      setCurrentAudience(null);
      fetchTargetAudiences();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to restore target audience",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (audience: TargetAudienceData) => {
    setCurrentAudience(audience);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (audience: TargetAudienceData) => {
    setCurrentAudience(audience);
    setIsDeleteDialogOpen(true);
  };

  // Open restore dialog
  const openRestoreDialog = (audience: TargetAudienceData) => {
    setCurrentAudience(audience);
    setIsRestoreDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-stone-50 to-white">
        <PageHeader
          title="Target Audiences"
          description="Manage your target audience segments"
          action={
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Audience
            </Button>
          }
        />
        <CardContent>
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showInactive={includeInactive}
            onShowInactiveChange={setIncludeInactive}
            searchPlaceholder="Search audiences..."
            toggleLabel="Show inactive audiences"
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
            </div>
          ) : filteredAudiences.length === 0 ? (
            <EmptyState
              message="No target audiences found"
              action={{
                label: "Create your first target audience",
                onClick: () => setIsCreateDialogOpen(true),
              }}
            />
          ) : (
            <AudienceTable
              audiences={filteredAudiences}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onRestore={openRestoreDialog}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground border-t py-4 mt-4">
          <p>Total: {filteredAudiences.length} audiences</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </CardFooter>
      </Card>

      {/* Create/Edit Dialog */}
      <AudienceFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAudience}
        isSubmitting={isSubmitting}
        mode="create"
      />

      <AudienceFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateAudience}
        audience={currentAudience}
        isSubmitting={isSubmitting}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAudience}
        title="Confirm Deletion"
        description={
          <>
            Are you sure you want to deactivate the target audience "
            {currentAudience?.name}"? This action can be reversed later.
          </>
        }
        confirmText="Deactivate"
        confirmingText="Deactivating..."
        isSubmitting={isSubmitting}
        variant="danger"
      />

      {/* Restore Confirmation Dialog */}
      <ConfirmationDialog
        open={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
        onConfirm={handleRestoreAudience}
        title="Confirm Restoration"
        description={
          <>
            Are you sure you want to restore the target audience "
            {currentAudience?.name}"?
          </>
        }
        confirmText="Restore"
        confirmingText="Restoring..."
        isSubmitting={isSubmitting}
        variant="success"
      />
    </div>
  );
}
