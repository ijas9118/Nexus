import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/atoms/button";
import { columns } from "./mentorship-type/columns";
import { DataTable } from "./mentorship-type/data-table";
import { MentorshipTypeDialog } from "./mentorship-type/mentorship-type-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MentorshipTypeService from "@/services/mentorshipTypeService";
import { MentorshipTypeData } from "@/types/mentor";

export default function MentorshipTypesPage() {
  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState<MentorshipTypeData | null>(
    null,
  );

  const queryClient = useQueryClient();

  const {
    data: mentorshipTypes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["mentorshipTypes"],
    queryFn: () => MentorshipTypeService.getAllTypes(true),
  });

  const handleCreateNew = () => {
    setEditingType(null);
    setOpen(true);
  };

  const handleEdit = (type: MentorshipTypeData) => {
    setEditingType(type);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await MentorshipTypeService.softDelete(id);
    queryClient.invalidateQueries({ queryKey: ["mentorshipTypes"] });
  };

  const handleRestore = async (id: string) => {
    await MentorshipTypeService.restore(id);
    queryClient.invalidateQueries({ queryKey: ["mentorshipTypes"] });
  };

  const handleSave = async (type: MentorshipTypeData) => {
    console.log(type, editingType);
    if (editingType) {
      await MentorshipTypeService.update(editingType._id as string, type);
    } else {
      await MentorshipTypeService.create(type);
    }

    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["mentorshipTypes"] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8"
    >
      <div className="flex justify-between items-center mb-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Mentorship Types
          </h1>
          <p className="text-muted-foreground">
            Manage the types of mentorship offered on the platform.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add New Type</span>
          </Button>
        </motion.div>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground py-10">
          <p>Loading mentorship types...</p>
        </div>
      )}

      {/* 👇 Error State */}
      {isError && (
        <div className="text-center text-destructive py-10">
          <p>Failed to load mentorship types. Something broke somewhere.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* 👇 Data Table */}
      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {mentorshipTypes.length > 0 ? (
            <DataTable
              columns={columns({
                onEdit: handleEdit,
                onDelete: handleDelete,
                onRestore: handleRestore,
              })}
              data={mentorshipTypes}
            />
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <p>No mentorship types found. Time to add some magic! ✨</p>
            </div>
          )}
        </motion.div>
      )}

      <MentorshipTypeDialog
        open={open}
        setOpen={setOpen}
        initialData={editingType}
        onSave={handleSave}
      />
    </motion.div>
  );
}
