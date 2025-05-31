import React, { useEffect, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { StatusQueryOptions } from "@/lib/server/status";
import { PlatformQueryOptions } from "@/lib/server/platform";
import { useRouteContext } from "@tanstack/react-router";
import { userGameQueryOptions } from "@/lib/userGames";
import { useDebouncedValue } from "@tanstack/react-pacer";

const GameLibraryControls = () => {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue<string>(searchValue, {
    wait: 300,
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [mode, setMode] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState<number>(20);

  const { data: StatusOptions } = useSuspenseQuery(StatusQueryOptions());
  const { data: PlatformOptions } = useSuspenseQuery(
    PlatformQueryOptions({ userId: user.id })
  );

  const LimitOptions = [5, 20, 50, 100];

  useQuery(
    userGameQueryOptions({
      userId: user.id,
      search: debouncedSearch,
      platform: platformFilter !== "all" ? +platformFilter : "all",
      status: statusFilter !== "all" ? +statusFilter : "all",
      limit,
    })
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["userGames"] });
  }, [debouncedSearch, platformFilter, statusFilter, limit]);

  return (
    <div className="grid gap-4 mb-6 md:grid-cols-5">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search games..."
          className="pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(newStatus) => setStatusFilter(newStatus)}
        defaultValue="all"
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={"all"} value={"all"}>
            All
          </SelectItem>
          {StatusOptions.map((status) => (
            <SelectItem key={status.id.toString()} value={status.id.toString()}>
              {status.statusTitle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={platformFilter} onValueChange={setPlatformFilter}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={"all"} value={"all"}>
            All
          </SelectItem>
          {PlatformOptions.map((platform) => (
            <SelectItem key={platform.id} value={platform.id.toString()}>
              {platform.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={mode}
        onValueChange={(value: "grid" | "list") => setMode(value)}
      >
        <SelectTrigger id="view-mode" className="w-full">
          <SelectValue placeholder="View Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="grid">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Grid View</span>
            </div>
          </SelectItem>
          <SelectItem value="list">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Table View</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={limit.toString()}
        onValueChange={(newLimit: string) => setLimit(+newLimit)}
      >
        <SelectTrigger id="display-limit" className="w-full">
          <SelectValue placeholder="Display Limit" />
        </SelectTrigger>
        <SelectContent>
          {LimitOptions.map((limit: number) => (
            <SelectItem key={limit} value={limit.toString()}>
              {limit.toString() === "all" ? "Show All" : `Show ${limit}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameLibraryControls;
