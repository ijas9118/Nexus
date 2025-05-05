import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  const [pageSizeInput, setPageSizeInput] = useState(
    table.getState().pagination.pageSize,
  );

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      table.setPageSize(newSize);
      onPageSizeChange?.(newSize);
      setPageSizeInput(newSize);
    }
  };
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Input
            type="number"
            value={pageSizeInput}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="h-8 w-[70px]"
            min={1}
          />
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0);
              onPageChange?.(0);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.previousPage();
              onPageChange?.(table.getState().pagination.pageIndex - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage();
              onPageChange?.(table.getState().pagination.pageIndex + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
              onPageChange?.(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
