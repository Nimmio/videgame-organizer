import { SearchGame } from "@/types/game";
import React from "react";
import GameListItem from "./add-game-list-item";

interface AddGameListProps {
  games: SearchGame[];
  onClick: (selectedGame: SearchGame) => void;
}

const AddGameList = ({ games, onClick }: AddGameListProps) => {
  return (
    <div className="space-y-2">
      {games.map((game) => (
        <GameListItem key={game.id} game={game} onClick={() => onClick(game)} />
      ))}
    </div>
  );
};

export default AddGameList;
