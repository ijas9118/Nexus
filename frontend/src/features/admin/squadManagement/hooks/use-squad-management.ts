import { useState, useEffect, useCallback } from "react";
import AdminSquadService from "@/services/admin/squadService";
import { toast } from "sonner";
import { Squad } from "@/types/squad";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
}

export function useSquadManagement() {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const fetchSquads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AdminSquadService.getAllSquads({
        page: currentPage,
        limit,
        search: searchTerm,
      });

      setSquads(response.data || []);

      if (response.meta) {
        setPagination({
          page: response.meta.page,
          limit: response.meta.limit,
          total: response.meta.total,
        });
      }
    } catch (err) {
      setError(err as Error);
      console.error("Failed to fetch squads:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm]);

  useEffect(() => {
    fetchSquads();
  }, [fetchSquads]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await AdminSquadService.toggleStatus(id);
      toast.success("Squad status updated successfully");
      fetchSquads();
    } catch (err) {
      console.error("Failed to toggle squad status:", err);
      toast.error("Failed to update squad status");
      throw err;
    }
  };

  return {
    squads,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handleSearch,
    handleToggleStatus,
  };
}
