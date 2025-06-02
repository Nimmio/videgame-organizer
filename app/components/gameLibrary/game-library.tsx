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

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    },
  });

  const updatePlatformMutation = useMutation({
    mutationFn: updatePlatform,
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

  const handleStatusChange = (gameId: UserGame["id"], newStatus: Status) => {
    updateStatusMutation.mutate({
      data: {
        userGameId: gameId,
        userId: user.id,
        newStatusId: newStatus.id,
      },
    });
  };

  const handlePlatformChange = (
    gameId: UserGame["id"],
    newPlatform: Platform
  ) => {
    updatePlatformMutation.mutate({
      data: {
        userGameId: gameId,
        userId: user.id,
        newPlatformId: newPlatform.id,
      },
    });
  };
  return (
    <>
      <Suspense fallback={"Loading"}>
        <GameLibraryControls mode={mode} onModeChange={setMode} />
      </Suspense>
      {mode === "grid" && (
        <GameLibraryGrid
          games={userGameQuery.data}
          onDelete={handleDelete}
          onPlatformChange={handlePlatformChange}
          onStatusChange={handleStatusChange}
        />
      )}
      {mode == "list" && (
        <GameLibraryList
          games={userGameQuery.data}
          onDelete={handleDelete}
          onPlatformChange={handlePlatformChange}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default GameLibrary;
