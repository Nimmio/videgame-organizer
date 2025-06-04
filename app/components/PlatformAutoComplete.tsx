import React, { useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { igdbAuthMiddleware } from "@/lib/server/igdb/middleware";
import { fetchFunc } from "@/lib/server/fetch";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";

const searchPlatform = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ search: z.string() }).parse(d))
  .middleware([igdbAuthMiddleware])
  .handler(async ({ data, context }) => {
    const { search } = data;
    const { igdbAccessToken } = context;

    const response = await fetchFunc({
      endpoint: "platform",
      fields: "name",
      token: igdbAccessToken as string,
      search,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

interface PlatformAutoCompleteProps {
  value?: string;
  onChange: (newValue: string) => void;
}

const PlatformAutoComplete = ({
  value,
  onChange,
}: PlatformAutoCompleteProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue<string>(search, {
    wait: 300,
  });
  const {
    isPending,
    data = [],
    error,
  } = useQuery({
    queryKey: ["igdbPlatformSearch", debouncedSearch],
    queryFn: () => searchPlatform({ data: { search: debouncedSearch } }),
    enabled: debouncedSearch !== "",
  });

  const isLoading = search !== "" && (isPending || search !== debouncedSearch);

  const handleChange = (newPlatform: string) => {
    onChange(newPlatform);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between")}
        >
          {value ? value : "Select Platform"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search users..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            )}

            {error && (
              <div className="py-6 text-center text-sm text-destructive">
                Error loading Platforms
              </div>
            )}

            {!isLoading && !error && data.length === 0 && value && (
              <CommandEmpty>No platform found.</CommandEmpty>
            )}

            {!isLoading && !error && (!data || data.length === 0) && !value && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Start typing to search platform
              </div>
            )}

            {!isLoading && !error && data && data.length > 0 && (
              <CommandGroup>
                {data.map((platform) => (
                  <CommandItem
                    key={platform.id}
                    value={platform.name.toString()}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === value ? "" : currentValue;
                      handleChange(newValue);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{platform.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PlatformAutoComplete;
