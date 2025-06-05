import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SearchGameWithPlatfrom } from "@/types/game";
import PlatformAutoComplete from "../PlatformAutoComplete";
import GenresInput from "./genres-input";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { StatusQueryOptions } from "@/lib/server/status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { getUrl } from "@/lib/server/igdb/cover";
import { createUserGame } from "@/lib/server/game";
import { useRouteContext } from "@tanstack/react-router";
import ClearableDatePicker from "../clearable-date-picker";
import { fromUnixTime } from "date-fns";

const formSchema = z.object({
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
});

const GameManual = ({
  selectedGame,
}: {
  selectedGame?: SearchGameWithPlatfrom;
}) => {
  const queryClient = useQueryClient();
  const { user } = useRouteContext({ from: "/_authenticated" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      platform: "",
      genres: [],
      status: 1,
      coverUrl: "",
      summary: "",
      notes: "",
    },
  });

  const createGameMutation = useMutation({
    mutationFn: createUserGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createGameMutation.mutate({ data: { ...values, userId: user.id } });
  }

  useEffect(() => {
    if (selectedGame !== undefined) form.reset();
    if (selectedGame) {
      if (selectedGame.name) {
        form.setValue("title", selectedGame.name);
      }
      if (selectedGame.platform) {
        form.setValue("platform", selectedGame.platform.name);
      }
      if (selectedGame.genres) {
        form.setValue(
          "genres",
          selectedGame.genres.map((genre) => genre.name)
        );
      }
      if (selectedGame.cover?.url) {
        form.setValue(
          "coverUrl",
          getUrl((selectedGame.cover?.url as string) || "", "cover_big")
        );
      }
      if (selectedGame.summary) {
        form.setValue("summary", selectedGame.summary);
      }
      if (selectedGame.first_release_date) {
        form.setValue(
          "releaseDate",
          fromUnixTime(selectedGame.first_release_date)
        );
      }
    }
  }, [selectedGame]);

  const { data: AllStatus } = useSuspenseQuery(StatusQueryOptions());
  const [status, setStatus] = useState<number>(1);

  useEffect(() => {}, [form.getValues("status")]);

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <SelectItem key={status.id} value={status.id.toString()}>
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
            Add to Library
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GameManual;
