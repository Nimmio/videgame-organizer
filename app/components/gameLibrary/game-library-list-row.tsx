import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { LibraryUserGame } from "@/types/game";
import { getUrl } from "@/lib/server/igdb/cover";
import GameCardStatusBadge from "./gameCard/game-card-status-badge";
import GameCardPlatformDropdown from "./gameCard/game-card-platform-dropdown";
import { Platform } from "@/generated/prisma";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import GameCardDeleteButton from "./gameCard/game-card-delete-button";

interface GameLibraryListRowProps {
  userGame: LibraryUserGame;
}

const GameLibraryListRow = ({ userGame }: GameLibraryListRowProps) => {
  const { game } = userGame;
  return (
    <TableRow key={game.id}>
      <TableCell>
        <img
          src={getUrl((game.coverUrl as string) || "", "cover_big")}
          alt={`${game.name} cover`}
          className="h-16 w-12 object-cover rounded-sm"
        />
      </TableCell>
      <TableCell className="font-medium">{game.name}</TableCell>
      <TableCell>
        <GameCardStatusBadge
          currentStatus={userGame.status}
          onStatusChange={(newStatus) => {
            //   onStatusChange(game.id, newStatus);
          }}
        />
      </TableCell>
      <TableCell>
        <GameCardPlatformDropdown
          currentPlatform={userGame.platform as Platform}
          onChange={(newPlatform: Platform) => {
            // onPlatformChange(game.id, newPlatform);
          }}
          platformOptions={game.platforms}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 px-2 gap-1">
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Button>

          <GameCardDeleteButton
            gameName={game.name}
            onDelete={() => {
              //   onDelete(game.id);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GameLibraryListRow;
