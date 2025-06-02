import React from "react";
import { useTheme } from "@/components/theme-provider";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ThemeModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Label className="mb-4">Theme</Label>
      <Select
        value={theme}
        onValueChange={(newValue) => setTheme(newValue as typeof theme)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
