import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Platform } from "@/generated/prisma";
import { ChevronDown } from "lucide-react";

interface GameCardPlatformDropdownProps {
  currentPlatform: Platform;
  platformOptions: Platform[];
  onChange: (newPlatform: Platform) => void;
  style?: "default" | "white";
}

const GameCardPlatformDropdown = ({
  currentPlatform,
  platformOptions,
  onChange,
  style = "default",
}: GameCardPlatformDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center gap-1 text-sm ${
          style === "white"
            ? "text-white/80 hover:text-white cursor-pointer drop-shadow-lg"
            : ""
        }`}
      >
        {currentPlatform.name}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {platformOptions.map((platform: Platform) => (
          <DropdownMenuItem
            key={platform.id}
            onClick={() => onChange(platform)}
            className={platform.id === currentPlatform.id ? "font-bold" : ""}
          >
            {platform.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GameCardPlatformDropdown;
