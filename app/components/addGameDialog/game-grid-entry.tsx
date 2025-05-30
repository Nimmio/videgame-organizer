import { Card } from "../ui/card";
import { format, fromUnixTime } from "date-fns";
import { SearchGame } from "@/types/game";
import { getUrl } from "@/lib/server/igdb/cover";

interface GameGridEntryProps {
  game: SearchGame;
  onClick: () => void;
}

const GameGridEntry = (props: GameGridEntryProps) => {
  const { game, onClick } = props;
  const { name, first_release_date } = game;
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md group p-0 max-h-[360px]"
      onClick={onClick}
    >
      <div className="aspect-[3/4] relative">
        <img
          className="object-cover w-full max-h-[360px]"
          src={getUrl((game.cover?.url as string) || "", "cover_big")}
          alt={name}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <p className="text-sm text-white/90">
            {first_release_date
              ? format(fromUnixTime(first_release_date), "dd.MM.yyyy")
              : "Release date unknown"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GameGridEntry;
