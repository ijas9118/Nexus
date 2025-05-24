import type React from "react";

import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { toast } from "sonner";
import { useSquadManagement } from "./squadManagement/hooks/use-squad-management";
import SquadTable from "./squadManagement/components/squad-table";
import SquadPagination from "./squadManagement/components/squad-pagination";

export default function AdminSquadManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    squads,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handleSearch,
    handleToggleStatus,
  } = useSquadManagement();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  if (error) {
    toast.error("Failed to load squads. Please try again.");
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Squad Management</h1>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="text"
          placeholder="Search squads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <SquadTable squads={squads} onToggleStatus={handleToggleStatus} />

          {pagination && (
            <SquadPagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.limit)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
