import React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { igdbAuthMiddleware } from "@/lib/server/igdb/middleware";
import { fetchFunc } from "@/lib/server/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchGame } from "@/types/game";
import GameDetails from "./add.game-details";
import { useRouteContext } from "@tanstack/react-router";
import { createUserGame } from "@/lib/server/game";
import { toast } from "sonner";
import AddGameGrid from "./add-game-grid";
import AddGameList from "./add-game-list";
import ModeButton from "../mode-button";

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
  const [mode, setMode] = useState<"grid" | "list">("grid");
  const { data } = useQuery({
    queryKey: ["addGame", debouncedSearch],
    queryFn: () => searchGame({ data: { search: debouncedSearch } }),
  });

  const { user } = useRouteContext({ from: "/_authenticated" });
  const queryClient = useQueryClient();
  const addGameMutation = useMutation({
    mutationFn: createUserGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    },
  });

  const handleClose = () => {
    onClose();
    setSearch("");
    setSelectedGame(undefined);
    setMode("grid");
  };

  const handleAdd = async ({
    selectedStatus,
    selectedPlatform,
  }: {
    selectedStatus: number;
    selectedPlatform: number;
  }) => {
    if (selectedGame)
      await addGameMutation.mutate({
        data: {
          statusId: selectedStatus,
          igdbGame: selectedGame,
          userId: user.id,
          platformId: selectedPlatform,
        },
      });
    toast("Added Game!");
    handleClose();
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
            onAddGame={(selectedStatus, selectedPlatform) => {
              handleAdd({ selectedStatus, selectedPlatform });
            }}
          />
        )}
        {!selectedGame && (
          <Input
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        )}
        {!selectedGame && data && search !== "" && data.length > 0 && (
          <>
            <div className="flex justify-end mb-4">
              <ModeButton
                currentMode={mode}
                onChange={(newMode) => setMode(newMode)}
              />
            </div>
            {mode === "grid" ? (
              <AddGameGrid
                games={data}
                onClick={(selectedGame) => setSelectedGame(selectedGame)}
              />
            ) : (
              <AddGameList
                games={data}
                onClick={(selectedGame) => setSelectedGame(selectedGame)}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddGameDialog;
