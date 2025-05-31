import React from "react";
import { LibraryUserGame } from "@/types/game";
import GameCard from "./gameCard/game-card";
import { Platform, UserGame } from "@/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserGame } from "@/lib/server/game";
import { useRouteContext } from "@tanstack/react-router";

interface GameLibraryProps {
  userGames: LibraryUserGame[];
}

const GameLibrary = ({ userGames }: GameLibraryProps) => {
  const { user } = useRouteContext({ from: "/_authenticated" });
  const queryClient = useQueryClient();
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

  const handleStatusChange = (gameId: UserGame["id"], newStatus: Status) => {
    console.log("statusChange", gameId);
  };

  const handlePlatformChange = (
    gameId: UserGame["id"],
    newPlatform: Platform
  ) => {
    console.log("delete", gameId);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {userGames.length > 0 ? (
          userGames.map((userGame) => (
            <GameCard
              key={userGame.id}
              userGame={userGame}
              onDelete={handleDelete}
              onPlatformChange={handlePlatformChange}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">
              No games found matching your filters.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default GameLibrary;
