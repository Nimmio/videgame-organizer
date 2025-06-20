import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import GameLookup from "./game-lookup";
import GameManual from "./game-manual";
import { SearchGame, SearchGameWithPlatfrom } from "@/types/game";

const AddGameDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [selectedLookupGame, setSelectedLookupGame] = useState<
    undefined | SearchGameWithPlatfrom
  >(undefined);
  const handleAddGame = () => {};
  const handleSelectLookupGame = (lookupGame: SearchGameWithPlatfrom) => {
    setSelectedLookupGame(lookupGame);
    setActiveTab("manual");
  };
  return (
    <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl min-w-1/2">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="lookup">Game Lookup</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 py-4">
            <GameManual selectedGame={selectedLookupGame} />
          </TabsContent>

          <TabsContent value="lookup" className="py-4">
            <GameLookup onSelectGame={(game) => handleSelectLookupGame(game)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddGameDialog;
