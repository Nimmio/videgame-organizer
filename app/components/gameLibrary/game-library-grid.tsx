import React from "react";
import GameCard from "./gameCard/game-card";
import { LibraryUserGame } from "@/types/game";
import { Platform, Status, UserGame } from "@/generated/prisma";

interface GameLibraryGridProps {
  games: LibraryUserGame[];
  onDelete: (userGameId: UserGame["id"]) => void;
  onPlatformChange: (userGameId: UserGame["id"], newPlatform: Platform) => void;
  onStatusChange: (userGameId: UserGame["id"], newStatus: Status) => void;
}

const GameLibraryGrid = ({
  games,
  onDelete,
  onPlatformChange,
  onStatusChange,
}: GameLibraryGridProps) => {
  console.log("games", games);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {games.length > 0 ? (
        games.map((userGame) => (
          <GameCard
            key={userGame.id}
            userGame={userGame}
            onDelete={onDelete}
            onPlatformChange={onPlatformChange}
            onStatusChange={onStatusChange}
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
  );
};

export default GameLibraryGrid;
