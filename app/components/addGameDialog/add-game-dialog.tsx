import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { igdbAuthMiddleware } from "@/lib/server/igdb/middleware";
import { fetchFunc } from "@/lib/server/fetch";
import { useQuery } from "@tanstack/react-query";
import { SearchGame } from "@/types/game";
import GameGridEntry from "./game-grid-entry";
import GameDetails from "./add.game-details";
import { createUserGame } from "@/lib/server/igdb/game";
import { useRouteContext } from "@tanstack/react-router";

const searchGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ search: z.string() }).parse(d))
  .middleware([igdbAuthMiddleware])
  .handler(async ({ data, context }) => {
    const { search } = data;
    const { igdbAccessToken } = context;

    const response = await fetchFunc({
      endpoint: "game",
      fields:
        "name,first_release_date,cover.url,summary,genres.name,platforms.name",
      token: igdbAccessToken as string,
      search,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

interface addGameDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddGameDialog = ({ open, onClose }: addGameDialogProps) => {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue<string>(search, {
    wait: 300,
  });
  const [selectedGame, setSelectedGame] = useState<SearchGame | undefined>(
    undefined
  );
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["addGame", debouncedSearch],
    queryFn: () => searchGame({ data: { search: debouncedSearch } }),
  });

  const { user } = useRouteContext({ from: "/_authenticated" });

  const handleClose = async () => {
    onClose();
    setSearch("");
    setSelectedGame(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="min-w-3/4 max-h-full overflow-scroll">
        <DialogHeader>
          <DialogTitle>Add a game to your collection</DialogTitle>
        </DialogHeader>
        {selectedGame && (
          <GameDetails
            game={selectedGame}
            onBack={() => {
              setSelectedGame(undefined);
            }}
            onAddGame={(selectedStatus) => {
              console.log("selectedStatus", selectedStatus);

              createUserGame({
                data: {
                  statusId: selectedStatus,
                  gameId: selectedGame.id,
                  userId: user.id,
                },
              });
            }}
          />
        )}
        {!selectedGame && (
          <Input
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        )}
        {!selectedGame && data && search !== "" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((entry: SearchGame) => (
              <GameGridEntry
                key={entry.id}
                game={entry}
                onClick={() => {
                  setSelectedGame(entry);
                }}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddGameDialog;
