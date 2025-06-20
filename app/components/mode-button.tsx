import React from "react";
import { Grid, List } from "lucide-react";
import { Button } from "./ui/button";

type mode = "grid" | "list";

interface ModeButtonProps {
  currentMode: mode;
  onChange: (newMode: mode) => void;
}

const ModeButton = ({ currentMode, onChange }: ModeButtonProps) => {
  return (
    <div className="flex border rounded-md">
      <Button
        variant={currentMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("grid")}
        className="rounded-r-none"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={currentMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("list")}
        className="rounded-l-none"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ModeButton;
