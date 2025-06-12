import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { userMiddleware } from "./middleware";

const CreateUserGameSchema = z.object({
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

export const createUserGame = createServerFn({ method: "POST" })
  .middleware([userMiddleware])
  .validator((d: unknown) => CreateUserGameSchema.parse(d))
  .handler(async ({ data, context }) => {
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
    } = data;

    const { user } = context;

    return await prisma.userGame.create({
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
            id: user?.id,
          },
        },
      },
    });
  });

const deleteUserGameSchema = z.object({
  userGameId: z.number(),
});

export const deleteUserGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => deleteUserGameSchema.parse(d))
  .middleware([userMiddleware])

  .handler(async ({ data, context }) => {
    const { userGameId } = data;
    const { user } = context;

    return await prisma.userGame.delete({
      where: {
        userId: user.id,
        id: userGameId,
      },
    });
  });

const updateStatusSchema = z.object({
  userGameId: z.number(),
  newStatusId: z.number(),
});

export const updateStatus = createServerFn({ method: "POST" })
  .validator((d: unknown) => updateStatusSchema.parse(d))
  .middleware([userMiddleware])
  .handler(async ({ data, context }) => {
    const { userGameId, newStatusId } = data;
    const { user } = context;

    return await prisma.userGame.update({
      where: {
        userId: user.id,
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

export const getCountAllGames = createServerFn({ method: "GET" })
  .middleware([userMiddleware])
  .handler(async ({ context }) => {
    const { user } = context;
    return await prisma.userGame.count({
      where: {
        userId: user.id,
      },
    });
  });

export const getCountCompletedGames = createServerFn({ method: "GET" })
  .middleware([userMiddleware])
  .handler(async ({ context }) => {
    const { user } = context;
    return await prisma.userGame.count({
      where: {
        userId: user.id,
        status: {
          group: "FINISHED",
        },
      },
    });
  });

export const getCountPlayingGames = createServerFn({ method: "GET" })
  .middleware([userMiddleware])
  .handler(async ({ context }) => {
    const { user } = context;
    return await prisma.userGame.count({
      where: {
        userId: user.id,
        status: {
          group: "PLAYING",
        },
      },
    });
  });
