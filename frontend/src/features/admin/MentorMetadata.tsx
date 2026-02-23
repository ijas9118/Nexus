import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { Loader2, Plus } from "lucide-react";
import MetadataForm from "./mentor-metada/metadata-form";
import FilterBar from "./mentor-metada/filter-bar";
import MentorMetadataService, {
  type MentorMetadataData,
} from "@/services/mentorMetadataService";
import { toast } from "sonner";
import MetadataTable from "./mentor-metada/metadata-table";
import { Button } from "@/components/atoms/button";

export default function MentorMetadataPage() {
  const [metadata, setMetadata] = useState<MentorMetadataData[]>([]);
  const [filteredMetadata, setFilteredMetadata] = useState<
    MentorMetadataData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMetadata, setEditingMetadata] =
    useState<MentorMetadataData | null>(null);

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const response = await MentorMetadataService.getAll(showInactive);
      setMetadata(response);
      setFilteredMetadata(response);
    } catch {
      toast.error("Error fetching metadata", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, [showInactive]);

  useEffect(() => {
    if (selectedType) {
      setFilteredMetadata(
        metadata.filter((item) => item.type === selectedType),
      );
    } else {
      setFilteredMetadata(metadata);
    }
  }, [selectedType, metadata]);

  const handleFilter = (type: string | null, includeInactive: boolean) => {
    setSelectedType(type);
    setShowInactive(includeInactive);
  };

  const handleEdit = (item: MentorMetadataData) => {
    setEditingMetadata(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await MentorMetadataService.softDelete(id);
      toast.success("Metadata deleted", {
        description: "The metadata has been successfully deleted",
      });
      fetchMetadata();
    } catch {
      toast.error("Error deleting metadata", {
        description: "An unexpected error occurred",
      });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await MentorMetadataService.restore(id);
      toast.success("Metadata restored", {
        description: "The metadata has been successfully restored",
      });
      fetchMetadata();
    } catch {
      toast.error("Error restoring metadata", {
        description: "An unexpected error occurred",
      });
    }
  };

  const handleFormSubmit = async (data: Partial<MentorMetadataData>) => {
    if (editingMetadata) {
      await MentorMetadataService.update(editingMetadata._id, data);
    } else {
      await MentorMetadataService.create(data);
    }
    setEditingMetadata(null);
    fetchMetadata();
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          Mentor Metadata Management
        </h1>
        <p className="text-muted-foreground">
          Manage experience levels, expertise areas, and technologies for
          mentors
        </p>
      </div>

      <div className="flex justify-between items-center my-6">
        <FilterBar onFilter={handleFilter} />
        <Button
          onClick={() => {
            setEditingMetadata(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Add New Metadata</span>
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b border-border px-6 py-3">
            <TabsList>
              <TabsTrigger value="all">All Metadata</TabsTrigger>
              <TabsTrigger value="experienceLevel">
                Experience Levels
              </TabsTrigger>
              <TabsTrigger value="expertiseArea">Expertise Areas</TabsTrigger>
              <TabsTrigger value="technology">Technologies</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <MetadataTable
                data={filteredMetadata}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            )}
          </TabsContent>

          <TabsContent value="experienceLevel" className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <MetadataTable
                data={metadata.filter(
                  (item) => item.type === "experienceLevel",
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            )}
          </TabsContent>

          <TabsContent value="expertiseArea" className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <MetadataTable
                data={metadata.filter((item) => item.type === "expertiseArea")}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            )}
          </TabsContent>

          <TabsContent value="technology" className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <MetadataTable
                data={metadata.filter((item) => item.type === "technology")}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {isFormOpen && (
        <MetadataForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMetadata(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingMetadata}
        />
      )}
    </div>
  );
}
