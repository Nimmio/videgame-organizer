import React from "react";
import GameCard from "./gameCard/game-card";
import { GameWithStatus } from "@/types/game";
import { UserGame } from "@/generated/prisma";

interface GameLibraryGridProps {
  games: GameWithStatus[];
  onDelete: (userGameId: UserGame["id"]) => void;
}

const GameLibraryGrid = ({ games, onDelete }: GameLibraryGridProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 ">
      {games.length > 0 ? (
        games.map((userGame) => (
          <GameCard key={userGame.id} userGame={userGame} onDelete={onDelete} />
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
