import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { igdbAuthMiddleware } from "@/lib/server/igdb/middleware";
import { fetchFunc } from "@/lib/server/fetch";
import { getUrl } from "@/lib/server/igdb/cover";
import { format, fromUnixTime } from "date-fns";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { SearchGame, SearchGameWithPlatfrom } from "@/types/game";
import { Button } from "../ui/button";

interface GameLookupProps {
  onSelectGame: (data: SearchGameWithPlatfrom) => void;
}

const searchGame = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ search: z.string() }).parse(d))
  .middleware([igdbAuthMiddleware])
  .handler(async ({ data, context }) => {
    const { search } = data;
    const { igdbAccessToken } = context;

    const response = await fetchFunc({
      endpoint: "game",
      fields:
        "name,first_release_date,cover.url,summary,genres.name,genres.checksum,platforms.name,platforms.checksum,checksum",
      token: igdbAccessToken as string,
      search,
      extra: "where version_parent = null;",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

const GameLookup = ({ onSelectGame }: GameLookupProps) => {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue<string>(search, {
    wait: 500,
  });

  const { isPending, data } = useQuery({
    queryKey: ["igdbGameSearch", debouncedSearch],
    queryFn: () => searchGame({ data: { search: debouncedSearch } }),
  });
  return (
    <>
      <div className="text-sm text-muted-foreground mb-4">
        Search for a game to automatically fill in the details. You can edit the
        information before adding it to your library.
      </div>
      <div className="embedded-lookup">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for games by title"
              className="pl-10"
              id="embedded-game-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid gap-4 max-h-[400px] overflow-y-auto p-1">
            {data &&
              data.map((game: SearchGame) => (
                <Card key={game.id} className="overflow-hidden">
                  <CardContent>
                    <div className="flex gap-4">
                      <img
                        src={getUrl(
                          (game.cover?.url as string) || "",
                          "cover_big"
                        )}
                        // alt={game.name}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold text-sm line-clamp-1">
                            {game.name}
                          </h3>
                          {game.first_release_date && (
                            <p className="text-xs text-muted-foreground">
                              {format(
                                fromUnixTime(game.first_release_date),
                                "dd.MM.yyyy"
                              )}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {game.genres &&
                            game.genres.map((genre) => (
                              <Badge
                                key={genre.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {genre.name}
                              </Badge>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {game.summary}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full">
                      <div className="text-xs font-medium text-muted-foreground">
                        Available on:
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {game.platforms.length > 0 &&
                          game.platforms.map((platform) => (
                            <Button
                              key={platform.id}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs justify-start cursor-pointer"
                              onClick={() => {
                                onSelectGame({ ...game, platform });
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              {platform.name}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
          {isPending && <>Loading</>}

          <div className="text-center text-sm text-muted-foreground">
            Click on a game to select it and fill the form
          </div>
        </div>
      </div>
    </>
  );
};

export default GameLookup;
