import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SearchGame } from "@/types/game";
import PlatformAutoComplete from "../PlatformAutoComplete";

const formSchema = z.object({
  title: z.string(),
});

const GameManual = ({ selectedGame }: { selectedGame: SearchGame }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  useEffect(() => {
    if (selectedGame) {
      if (selectedGame.name) {
        form.setValue("title", selectedGame.name);
      }
    }
  }, [selectedGame]);

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
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <PlatformAutoComplete />
      {/* {newGame.coverUrl && (
        <div className="flex justify-center mb-2">
          <img
            src={newGame.coverUrl || "/placeholder.svg"}
            alt="Game cover"
            className="h-40 object-cover rounded-md shadow-md"
          />
        </div>
      )}

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={newGame.title || ""}
          onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="platform">Platform</Label>
        <Input
          id="platform"
          value={newGame?.platform || ""}
          onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          value={newGame?.genre || ""}
          onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="year">Release Year</Label>
        <Input
          id="year"
          type="number"
          value={newGame?.releaseYear || ""}
          onChange={(e) =>
            setNewGame({
              ...newGame,
              releaseYear: Number.parseInt(e.target.value),
            })
          }
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={newGame?.status}
          onValueChange={(value) =>
            setNewGame({ ...newGame, status: value as Game["status"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
             {Object.entries(statusConfig).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center">
                          <config.icon className="w-3 h-3 mr-2" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="coverUrl">Cover Image URL (optional)</Label>
        <Input
          id="coverUrl"
          value={newGame?.coverUrl || ""}
          onChange={(e) => setNewGame({ ...newGame, coverUrl: e.target.value })}
          placeholder="/placeholder.svg?height=300&width=200"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={newGame?.notes || ""}
          onChange={(e) => setNewGame({ ...newGame, notes: e.target.value })}
        />
      </div> */}
    </div>
  );
};

export default GameManual;
