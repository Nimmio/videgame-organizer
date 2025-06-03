import React, { useEffect } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { igdbAuthMiddleware } from "@/lib/server/igdb/middleware";
import { fetchFunc } from "@/lib/server/fetch";

import { Button } from "../ui/button";
import { ExternalLink, Plus, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { UserGame } from "@/generated/prisma";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { getUrl } from "@/lib/server/igdb/cover";
import { format, fromUnixTime } from "date-fns";

const searchGame = createServerFn({ method: "POST" })
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
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

const AddGameDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [newGame, setNewGame] = useState<Partial<UserGame>>({});
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue<string>(search, {
    wait: 500,
  });
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["igdbGameSearch", debouncedSearch],
    queryFn: () => searchGame({ data: { search: debouncedSearch } }),
  });

  useEffect(() => {
    console.log("igdbGames", data);
    console.log("error", error);
  }, [debouncedSearch]);

  const handleAddGame = () => {};
  return (
    <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="lookup">Game Lookup</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 py-4">
            <div className="grid gap-4">
              {newGame.coverUrl && (
                <div className="flex justify-center mb-2">
                  <img
                    src={newGame.coverUrl || "/placeholder.svg"}
                    alt="Game cover"
                    className="h-40 object-cover rounded-md shadow-md"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newGame.title || ""}
                  onChange={(e) =>
                    setNewGame({ ...newGame, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  value={newGame?.platform || ""}
                  onChange={(e) =>
                    setNewGame({ ...newGame, platform: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={newGame?.genre || ""}
                  onChange={(e) =>
                    setNewGame({ ...newGame, genre: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="year">Release Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newGame?.releaseYear || ""}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      releaseYear: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newGame?.status}
                  onValueChange={(value) =>
                    setNewGame({ ...newGame, status: value as Game["status"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {Object.entries(statusConfig).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center">
                          <config.icon className="w-3 h-3 mr-2" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coverUrl">Cover Image URL (optional)</Label>
                <Input
                  id="coverUrl"
                  value={newGame?.coverUrl || ""}
                  onChange={(e) =>
                    setNewGame({ ...newGame, coverUrl: e.target.value })
                  }
                  placeholder="/placeholder.svg?height=300&width=200"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newGame?.notes || ""}
                  onChange={(e) =>
                    setNewGame({ ...newGame, notes: e.target.value })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lookup" className="py-4">
            <div className="text-sm text-muted-foreground mb-4">
              Search for a game to automatically fill in the details. You can
              edit the information before adding it to your library.
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
                  {/* Mock search results for demonstration */}

                  {data &&
                    data.map((game) => (
                      <Card
                        key={game.id}
                        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleGameLookupSelect(game)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={getUrl(
                                (game.cover?.url as string) || "",
                                "cover_big"
                              )}
                              alt={game.name}
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
                      </Card>
                    ))}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Click on a game to select it and fill the form
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetNewGameForm();
              setIsAddDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddGame}
            disabled={!newGame?.title || !newGame?.platform || !newGame?.genre}
          >
            Add to Library
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGameDialog;
