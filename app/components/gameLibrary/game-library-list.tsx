import React from "react";
import GameCard from "./gameCard/game-card";
import { LibraryUserGame } from "@/types/game";
import { Platform, Status, UserGame } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import GameCardPlatformDropdown from "./gameCard/game-card-platform-dropdown";
import GameLibraryListRow from "./game-library-list-row";

interface GameLibraryListProps {
  games: LibraryUserGame[];
  onDelete: (userGameId: UserGame["id"]) => void;
  onPlatformChange: (userGameId: UserGame["id"], newPlatform: Platform) => void;
  onStatusChange: (userGameId: UserGame["id"], newStatus: Status) => void;
}

const GameLibraryList = ({
  games,
  onDelete,
  onPlatformChange,
  onStatusChange,
}: GameLibraryListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Cover</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.length > 0 ? (
            games.map((game) => (
              <GameLibraryListRow userGame={game} key={game.id} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No games found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GameLibraryList;
