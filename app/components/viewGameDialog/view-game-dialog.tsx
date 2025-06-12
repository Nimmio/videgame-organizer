import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { GameWithStatus } from "@/types/game";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { formSchema } from "../addGameDialog/game-manual";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import PlatformAutoComplete from "../PlatformAutoComplete";
import GenresInput from "../addGameDialog/genres-input";
import ClearableDatePicker from "../clearable-date-picker";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { StatusQueryOptions } from "@/lib/server/status";
import { Textarea } from "../ui/textarea";
import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import { useRouteContext } from "@tanstack/react-router";
import { toast } from "sonner";

const updateStatusSchema = z.object({
  userGameId: z.number(),
  userId: z.string(),
  newStatusId: z.number(),
});

const updateStatus = createServerFn({ method: "POST" })
  .validator((d: unknown) => updateStatusSchema.parse(d))
  .handler(async ({ data }) => {
    const { userGameId, userId, newStatusId } = data;
    return await prisma.userGame.update({
      where: {
        userId,
        id: userGameId,
      },
      data: {
        status: {
          connect: {
            id: newStatusId,
          },
        },
      },
    });
  });

const updateGameSchema = z.object({
  title: z.string().min(1),
  platform: z.string().optional(),
  genres: z.array(z.string()),
  releaseDate: z.date().optional(),
  status: z.number(),
  startDate: z.date().optional(),
  finishDate: z.date().optional(),
  coverUrl: z.string().url().or(z.literal("")),
  summary: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string(),
  gameId: z.number(),
});

const updateGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => updateGameSchema.parse(d))
  .handler(async ({ data }) => {
    const {
      title,
      platform,
      genres,
      releaseDate,
      status,
      startDate,
      finishDate,
      coverUrl,
      summary,
      notes,
      userId,
      gameId,
    } = data;

    return await prisma.userGame.update({
      where: {
        id: gameId,
        userId,
      },
      data: {
        title,
        platform,
        genres,
        status: {
          connect: {
            id: status,
          },
        },
        coverUrl,
        summary,
        notes,
        startDate,
        finishDate,
        releaseDate,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  });

const ViewGameDialog = ({ game }: { game: GameWithStatus }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(1);
  const { data: AllStatus } = useSuspenseQuery(StatusQueryOptions());
  const queryClient = useQueryClient();
  const { user } = useRouteContext({ from: "/_authenticated" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: game.title,
      platform: game.platform || undefined,
      genres: game.genres,
      status: game.statusId,
      coverUrl: game.coverUrl || undefined,
      summary: game.summary || undefined,
      notes: game.notes || undefined,
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userGames"],
      });
      queryClient.invalidateQueries({
        queryKey: ["libraryControlOptions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sidebarData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardData"],
      });
      toast("Successfully updated Status");
    },
  });

  const handleStatusChange = (newStatus: number) => {
    updateStatusMutation.mutate({
      data: {
        userGameId: game.id,
        userId: user.id,
        newStatusId: newStatus,
      },
    });
  };

  const updateGameMutation = useMutation({
    mutationFn: updateGame,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userGames"],
      });
      queryClient.invalidateQueries({
        queryKey: ["libraryControlOptions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sidebarData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboardData"],
      });
      toast("Successfully updated Game");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateGameMutation.mutate({
      data: {
        ...values,
        userId: user.id,
        gameId: game.id,
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto min-w-1/2">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditMode ? "Edit Game" : "Game Details"}</span>
            <div className="flex gap-2">
              {!isEditMode && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditMode(true);
                    }}
                  >
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
                      <DropdownMenuItem onClick={() => {}}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Game
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {game && (
          <div className="space-y-6">
            {!isEditMode ? (
              // View Mode
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <img
                    src={game.coverUrl || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge>{game.status.statusTitle}</Badge>
                      <Badge variant="outline">{game.platform}</Badge>
                      <Badge variant="outline">
                        {game.releaseDate
                          ? format(game.releaseDate, "PPP")
                          : ""}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Platform
                      </Label>
                      <p className="text-sm">{game.platform}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Release Year
                      </Label>
                      {game.releaseDate && (
                        <p className="text-sm">
                          {format(game.releaseDate, "PPP")}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status
                      </Label>
                      <p className="text-sm">{game.status.statusTitle}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Genres
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {game.genres.map((genre) => (
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

                  {game.notes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Notes
                      </Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                        {game.notes}
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Quick Actions
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Select
                        value={game.status.id.toString()}
                        onValueChange={(value) => {
                          handleStatusChange(+value);
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AllStatus.map((statusentry) => (
                            <SelectItem
                              key={statusentry.id}
                              value={statusentry.id.toString()}
                            >
                              <div className="flex items-center">
                                {statusentry.statusTitle}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>{" "}
              </div>
            ) : (
              <div className="grid gap-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform (optional)</FormLabel>
                          <FormControl>
                            <PlatformAutoComplete {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="genres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genres</FormLabel>
                          <FormControl>
                            <GenresInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="releaseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Release Date (optional)</FormLabel>
                          <FormControl>
                            <ClearableDatePicker {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={(newValue: string) => {
                              setStatus(+newValue);
                              field.onChange(+newValue);
                            }}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a verified email to display" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {AllStatus.map((status) => (
                                <SelectItem
                                  key={status.id}
                                  value={status.id.toString()}
                                >
                                  {status.statusTitle}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {![1, 7, 8].includes(status) && ( //TODO!
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Started Playing on (optional)</FormLabel>
                            <FormControl>
                              <ClearableDatePicker {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {[4, 5, 6].includes(status) && ( //TODO!
                      <FormField
                        control={form.control}
                        name="finishDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Finished on (optional)</FormLabel>
                            <FormControl>
                              <ClearableDatePicker {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="coverUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image Url (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Cover Url" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Summary (optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Summary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Notes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className="w-full" type="submit">
                      Save changes
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewGameDialog;
