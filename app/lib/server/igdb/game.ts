import prisma from "@/lib/prisma";
import { SearchGameSchema } from "@/types/game";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getUrl } from "./cover";
import { fromUnixTime } from "date-fns";

const CreateUserGameSchema = z.object({
  statusId: z.number(),
  igdbGame: SearchGameSchema,
  userId: z.string(),
});

export const createUserGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => CreateUserGameSchema.parse(d))
  .handler(async ({ data }) => {
    const { igdbGame, statusId, userId } = data;
    await prisma.userGame.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        game: {
          connectOrCreate: {
            where: {
              igdbId: igdbGame.id,
            },
            create: {
              igdbId: igdbGame.id,
              coverUrl: igdbGame.cover?.url || undefined,
              first_release_date:
                fromUnixTime(igdbGame.first_release_date) || undefined,
              name: igdbGame.name,
              genres: {
                connectOrCreate: igdbGame.genres.map((genre) => {
                  return {
                    where: { igdbId: genre.id },
                    create: {
                      name: genre.name,
                      igdbId: genre.id,
                    },
                  };
                }),
              },
              platforms: {
                connectOrCreate: igdbGame.platforms.map((platform) => {
                  return {
                    where: { igdbId: platform.id },
                    create: {
                      name: platform.name,
                      igdbId: platform.id,
                    },
                  };
                }),
              },
            },
          },
        },
        status: {
          connect: {
            id: statusId,
          },
        },
      },
    });
  });
