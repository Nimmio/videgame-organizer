import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import prisma from "./prisma";
import { User } from "better-auth";
import z from "zod";

const fetchUserGames = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.string().parse(d))
  .handler(async ({ data: userId }) => {
    return await prisma.userGame.findMany({
      where: { userId: userId },
      include: {
        game: {
          include: {
            genres: true,
            platforms: true,
          },
        },
        status: true,
      },
    });
  });

export const userGameQueryOptions = ({ userId }: { userId: string }) =>
  queryOptions({
    queryKey: ["userGames"],
    queryFn: () =>
      fetchUserGames({
        data: userId,
      }),
  });
