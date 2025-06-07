import React from "react";
import { Button } from "../ui/button";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

interface GameLibraryPaginationControlsProps {
  page: number;
  onPageChange: (newPage: number) => void;
  totalPages: number;
}

const GameLibraryPaginationControls = ({
  page,
  onPageChange,
  totalPages,
}: GameLibraryPaginationControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (page <= 3) {
            pageNumber = i + 1;
          } else if (page >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
          } else {
            pageNumber = page - 2 + i;
          }

          return (
            <Button
              key={pageNumber}
              variant={page === pageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className="w-8 h-8 p-0"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next
      </Button>

      <div className="text-sm text-muted-foreground ml-4">
        Page {page} of {totalPages}
      </div>
    </div>
  );
};

export default GameLibraryPaginationControls;
