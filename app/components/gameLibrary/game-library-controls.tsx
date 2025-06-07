import React, { useEffect, useState } from "react";
import { Filter, Grid, List, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { StatusQueryOptions } from "@/lib/server/status";
import { useRouteContext } from "@tanstack/react-router";
import { userGameQueryOptions } from "@/lib/userGames";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { libraryViewMode } from "./game-library";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import AddGameDialog from "../addGameDialog/add-game-dialog";
import { Label } from "../ui/label";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface GameLibraryControlsProps {
  mode: libraryViewMode;
  onModeChange: (newMode: libraryViewMode) => void;
  onPageChange: (newPage: number) => void;
  limit: number;
  onLimitChange: (number) => void;
  page: number;
}

const getPlatformAndGenreOptions = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { userId } = data;

    const platforms = (
      await prisma.userGame.findMany({
        distinct: ["platform"],
        where: {
          userId: userId,
        },
        select: {
          platform: true,
        },
      })
    ).map((platformResult) => platformResult.platform);

    const genres = [
      ...new Set(
        (
          await prisma.userGame.findMany({
            distinct: ["genres"],
            select: { genres: true },
            where: { userId: userId },
          })
        ).flatMap((genre) => genre.genres)
      ),
    ];

    return {
      platforms,
      genres,
    };
  });

const GameLibraryControls = ({
  mode,
  onModeChange,
  onPageChange,
  limit,
  onLimitChange,
  page,
}: GameLibraryControlsProps) => {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue<string>(searchValue, {
    wait: 300,
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatuses] = useState<string[]>([]);

  const { data: StatusOptions } = useSuspenseQuery(StatusQueryOptions());

  const LimitOptions = [5, 20, 50, 100];

  const { data } = useSuspenseQuery({
    queryKey: ["libraryControlOptions", user.id],
    queryFn: () => getPlatformAndGenreOptions({ data: { userId: user.id } }),
  });
  const { platforms, genres } = data;
  useQuery(
    userGameQueryOptions({
      userId: user.id,
      search: debouncedSearch,
      platforms: selectedPlatforms,
      genres: selectedGenres,
      status: selectedStatus,
      limit,
      page,
    })
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["userGames"] });
  }, [
    debouncedSearch,
    limit,
    selectedPlatforms,
    selectedGenres,
    selectedStatus,
    page,
  ]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search games..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <div className="p-2">
                <Label className="text-xs font-semibold">Platforms</Label>
                {platforms.map((platform: string) => (
                  <DropdownMenuCheckboxItem
                    key={platform}
                    checked={selectedPlatforms.includes(platform)}
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform]);
                      } else {
                        setSelectedPlatforms(
                          selectedPlatforms.filter((p) => p !== platform)
                        );
                      }
                    }}
                  >
                    {platform}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
              <div className="p-2 border-t">
                <Label className="text-xs font-semibold">Genres</Label>
                {genres.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre}
                    checked={selectedGenres.includes(genre)}
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedGenres([...selectedGenres, genre]);
                      } else {
                        setSelectedGenres(
                          selectedGenres.filter((g) => g !== genre)
                        );
                      }
                    }}
                  >
                    {genre}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
              <div className="p-2 border-t">
                <Label className="text-xs font-semibold">Status</Label>
                {StatusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status.id}
                    checked={selectedStatus.includes(status.statusTitle)}
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStatuses([
                          ...selectedStatus,
                          status.statusTitle,
                        ]);
                      } else {
                        setSelectedStatuses(
                          selectedStatus.filter((s) => s !== status.statusTitle)
                        );
                      }
                    }}
                  >
                    {status.statusTitle}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onModeChange(mode === "grid" ? "list" : "grid")}
          >
            {mode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid className="w-4 h-4" />
            )}
          </Button>
          <AddGameDialog />
        </div>
      </div>
      <div className="flex items-center justify-end mt-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Games per page:</Label>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              onLimitChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LimitOptions.map((limitOption) => (
                <SelectItem
                  key={`limit_${limitOption}`}
                  value={limitOption.toString()}
                >
                  {limitOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default GameLibraryControls;
