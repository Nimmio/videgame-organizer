import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

interface GameCardDeleteButtonProps {
  gameName: string;
  onDelete: () => void;
}

const GameCardDeleteButton = ({
  gameName,
  onDelete,
}: GameCardDeleteButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-black/50 hover:bg-black/70 text-destructive border-0 backdrop-blur-sm hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 pb-0">
          <div className="font-medium">Delete Game</div>
          <div className="text-sm text-muted-foreground mt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{gameName}</span>? This action
            cannot be undone.
          </div>
        </div>
        <div className="flex border-t p-3 gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GameCardDeleteButton;
