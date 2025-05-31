import { LibraryUserGame } from "@/types/game";
import React from "react";
import GameCard from "./gameCard/game-card";

interface GameLibraryProps {
  userGames: LibraryUserGame[];
}

const GameLibrary = ({ userGames }: GameLibraryProps) => {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {userGames.length > 0 ? (
          userGames.map((userGame) => (
            <GameCard key={userGame.id} userGame={userGame} />
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
