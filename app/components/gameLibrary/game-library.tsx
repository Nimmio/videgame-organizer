import { LibraryUserGame } from "@/types/game";
import React from "react";
import GameCard from "./gameCard/game-card";

interface GameLibraryProps {
  games: LibraryUserGame[];
}

const GameLibrary = ({ games }: GameLibraryProps) => {
  return (
    <>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </>
  );
};

export default GameLibrary;
