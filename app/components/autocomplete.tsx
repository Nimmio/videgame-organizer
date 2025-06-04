import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useRouteContext } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlatformQueryOptions } from "@/lib/server/platform";

interface PlatformAutoCompleteProps {
  onChange: (newValue: string) => void;
}

const PlatformAutoComplete = ({ onChange }: PlatformAutoCompleteProps) => {
  const [value, setValue] = useState("second");

  const { user } = useRouteContext({ from: "/_authenticated" });
  const { data } = useSuspenseQuery(
    PlatformQueryOptions({ userId: user.id, search: value })
  );

  return (
    <div>
      <Label htmlFor="platform">Platform</Label>
      <div className="space-y-2">
        <div className="relative">
          <Input
            id="platform"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowPlatformSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => {
              setPlatformSuggestions(platforms);
              setShowPlatformSuggestions(true);
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowPlatformSuggestions(false), 200);
            }}
            placeholder="Type to search platforms or add new..."
          />
          {showPlatformSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {platformSuggestions.length > 0 && (
                <>
                  {platformSuggestions.map((platform) => (
                    <div
                      key={platform}
                      className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                      onClick={() => {
                        setNewGame({ ...newGame, platform });
                        setShowPlatformSuggestions(false);
                      }}
                    >
                      {platform}
                    </div>
                  ))}
                  {newGame.platform &&
                    !platforms.includes(newGame.platform) &&
                    newGame.platform.trim().length > 0 && (
                      <div className="border-t">
                        <div
                          className="px-3 py-2 hover:bg-accent cursor-pointer text-sm font-medium text-primary"
                          onClick={() => {
                            const newPlatform = newGame.platform?.trim();
                            if (newPlatform) {
                              setNewGame({ ...newGame, platform: newPlatform });
                              setShowPlatformSuggestions(false);
                            }
                          }}
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Add "{newGame.platform}" as new platform
                        </div>
                      </div>
                    )}
                </>
              )}
              {platformSuggestions.length === 0 &&
                newGame.platform &&
                newGame.platform.trim().length > 0 && (
                  <div
                    className="px-3 py-2 hover:bg-accent cursor-pointer text-sm font-medium text-primary"
                    onClick={() => {
                      const newPlatform = newGame.platform?.trim();
                      if (newPlatform) {
                        setNewGame({ ...newGame, platform: newPlatform });
                        setShowPlatformSuggestions(false);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add "{newGame.platform}" as new platform
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformAutoComplete;
