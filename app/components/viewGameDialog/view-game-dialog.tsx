import { Dialog } from "@radix-ui/react-dialog";
import React, { useState } from "react";

const ViewGameDialog = () => {
  return (
    <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditMode ? "Edit Game" : "Game Details"}</span>
            <div className="flex gap-2">
              {!isEditMode ? (
                <>
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          selectedGameForDetails &&
                          deleteGame(selectedGameForDetails.id)
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Game
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveGameEdits}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {selectedGameForDetails && (
          <div className="space-y-6">
            {!isEditMode ? (
              // View Mode
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <img
                    src={selectedGameForDetails.coverUrl || "/placeholder.svg"}
                    alt={selectedGameForDetails.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedGameForDetails.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge
                        className={`${
                          statusConfig[selectedGameForDetails.status].color
                        } text-white`}
                      >
                        {React.createElement(
                          statusConfig[selectedGameForDetails.status].icon,
                          {
                            className: "w-3 h-3 mr-1",
                          }
                        )}
                        {statusConfig[selectedGameForDetails.status].label}
                      </Badge>
                      <Badge variant="outline">
                        {selectedGameForDetails.platform}
                      </Badge>
                      <Badge variant="outline">
                        {selectedGameForDetails.releaseYear}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Platform
                      </Label>
                      <p className="text-sm">
                        {selectedGameForDetails.platform}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Release Year
                      </Label>
                      <p className="text-sm">
                        {selectedGameForDetails.releaseYear}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status
                      </Label>
                      <p className="text-sm">
                        {statusConfig[selectedGameForDetails.status].label}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Genres
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedGameForDetails.genres.map((genre) => (
                          <Badge
                            key={genre}
                            variant="secondary"
                            className="text-xs"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedGameForDetails.notes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Notes
                      </Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                        {selectedGameForDetails.notes}
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Quick Actions
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Select
                        value={selectedGameForDetails.status}
                        onValueChange={(value) => {
                          updateGameStatus(
                            selectedGameForDetails.id,
                            value as Game["status"]
                          );
                          setSelectedGameForDetails({
                            ...selectedGameForDetails,
                            status: value as Game["status"],
                          });
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(
                            ([status, config]) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center">
                                  <config.icon className="w-3 h-3 mr-2" />
                                  {config.label}
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-cover">Cover Image URL</Label>
                      <Input
                        id="edit-cover"
                        value={editingGame.coverUrl || ""}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            coverUrl: e.target.value,
                          })
                        }
                        placeholder="/placeholder.svg?height=300&width=200"
                      />
                    </div>
                    <img
                      src={editingGame.coverUrl || "/placeholder.svg"}
                      alt={editingGame.title || "Game cover"}
                      className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editingGame.title || ""}
                      onChange={(e) =>
                        setEditingGame({
                          ...editingGame,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-platform">Platform</Label>
                      <Input
                        id="edit-platform"
                        value={editingGame.platform || ""}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            platform: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-year">Release Year</Label>
                      <Input
                        id="edit-year"
                        type="number"
                        value={editingGame.releaseYear || ""}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            releaseYear: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingGame.status}
                      onValueChange={(value) =>
                        setEditingGame({
                          ...editingGame,
                          status: value as Game["status"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(
                          ([status, config]) => (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center">
                                <config.icon className="w-3 h-3 mr-2" />
                                {config.label}
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-genres">Genres</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="edit-genres"
                          value={newGenreInput}
                          onChange={(e) => setNewGenreInput(e.target.value)}
                          placeholder="Enter a genre"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addEditGenre();
                            }
                          }}
                        />
                        <Button type="button" onClick={addEditGenre} size="sm">
                          Add
                        </Button>
                      </div>
                      {editingGame.genres && editingGame.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {editingGame.genres.map((genre) => (
                            <Badge
                              key={genre}
                              variant="secondary"
                              className="text-xs"
                            >
                              {genre}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-1"
                                onClick={() => removeEditGenre(genre)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Textarea
                      id="edit-notes"
                      value={editingGame.notes || ""}
                      onChange={(e) =>
                        setEditingGame({
                          ...editingGame,
                          notes: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewGameDialog;
