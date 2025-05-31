import { SearchGame } from "@/types/game";
import GameGridEntry from "./game-grid-entry";

interface AddGameGridProps {
  games: SearchGame[];
  onClick: (selectedGame: SearchGame) => void;
}

const AddGameGrid = ({ games, onClick }: AddGameGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game: SearchGame) => (
        <GameGridEntry
          key={game.id}
          game={game}
          onClick={() => {
            onClick(game);
          }}
        />
      ))}
    </div>
  );
};

export default AddGameGrid;
