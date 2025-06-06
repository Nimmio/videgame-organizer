import React, { Suspense, useState } from "react";
import { Platform, Status, UserGame } from "@/generated/prisma";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  deleteUserGame,
  updatePlatform,
  updateStatus,
} from "@/lib/server/game";
import { useRouteContext } from "@tanstack/react-router";
import GameLibraryControls from "./game-library-controls";
import { userGameQueryOptions } from "@/lib/userGames";
import GameLibraryGrid from "./game-library-grid";
import GameLibraryList from "./game-library-list";
import { Separator } from "../ui/separator";

export type libraryViewMode = "grid" | "list";

const GameLibrary = () => {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<libraryViewMode>("grid");

  const userGameQuery = useSuspenseQuery(
    userGameQueryOptions({ userId: user.id })
  );

  const deleteUserGameMutation = useMutation({
    mutationFn: deleteUserGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    },
  });

  const handleDelete = (gameId: UserGame["id"]) => {
    deleteUserGameMutation.mutate({
      data: {
        userGameId: gameId,
        userId: user.id,
      },
    });
  };

  return (
    <>
      <Suspense fallback={"Loading"}>
        <GameLibraryControls mode={mode} onModeChange={setMode} />
      </Suspense>
      <Separator className="mb-4 mt-4" />
      {mode === "grid" && (
        <GameLibraryGrid games={userGameQuery.data} onDelete={handleDelete} />
      )}
      {mode == "list" && (
        <GameLibraryList games={userGameQuery.data} onDelete={handleDelete} />
      )}
    </>
  );
};

export default GameLibrary;
