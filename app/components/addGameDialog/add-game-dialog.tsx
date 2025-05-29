import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { igdbAuthMiddleware } from "@/lib/server/igdb/middleware";
import { fetchFunc } from "@/lib/server/fetch";
import { useQuery } from "@tanstack/react-query";

const searchGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ search: z.string() }).parse(d))
  .middleware([igdbAuthMiddleware])
  .handler(async ({ data, context }) => {
    const { search } = data;
    const { igdbAccessToken } = context;

    const response = await fetchFunc({
      endpoint: "game",
      fields: "name",
      token: igdbAccessToken as string,
      search,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

interface addGameDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddGameDialog = ({ open, onClose }: addGameDialogProps) => {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue<string>(search, {
    wait: 300,
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["addGame", debouncedSearch],
    queryFn: () => searchGame({ data: { search: debouncedSearch } }),
  });

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a game to your collection</DialogTitle>
          <Input
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          {debouncedSearch}
          {isLoading ? "isLoading" : "!isLoading"}
          {isError ? "isError" + error : "!isError"}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddGameDialog;
