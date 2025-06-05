import prisma from "@/lib/prisma";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
  userId: z.string(),
});

export const createUserGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => CreateUserGameSchema.parse(d))
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
    } = data;

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
            id: userId,
          },
        },
      },
    });
  });

const deleteUserGameSchema = z.object({
  userGameId: z.number(),
  userId: z.string(),
});

export const deleteUserGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => deleteUserGameSchema.parse(d))
  .handler(async ({ data }) => {
    const { userGameId, userId } = data;
    return await prisma.userGame.delete({
      where: {
        userId,
        id: userGameId,
      },
    });
  });

const updateStatusSchema = z.object({
  userGameId: z.number(),
  userId: z.string(),
  newStatusId: z.number(),
});

export const updateStatus = createServerFn({ method: "POST" })
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

export const getCountAllGames = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return await prisma.userGame.count({
      where: {
        userId: data.userId,
      },
    });
  });

export const getCountCompletedGames = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return await prisma.userGame.count({
      where: {
        userId: data.userId,
        status: {
          group: "FINISHED",
        },
      },
    });
  });

export const getCountPlayingGames = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ userId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return await prisma.userGame.count({
      where: {
        userId: data.userId,
        status: {
          group: "PLAYING",
        },
      },
    });
  });
