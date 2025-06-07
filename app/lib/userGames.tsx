import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import prisma from "./prisma";
import z from "zod";

const fetchUserGamesSchema = z.object({
  userId: z.string(),
  search: z.string().optional(),
  platforms: z.array(z.string()),
  status: z.array(z.string()),
  genres: z.array(z.string()),
  limit: z.number(),
  page: z.number(),
});

const fetchUserGames = createServerFn({ method: "GET" })
  .validator((d: unknown) => fetchUserGamesSchema.parse(d))
  .handler(async ({ data }) => {
    const {
      userId,
      search = "",
      status,
      platforms,
      genres,
      limit,
      page,
    } = data;

    const platformWhere = [
      ...platforms.map((platform) => ({
        platform: platform,
      })),
    ];

    const genresWhere = [
      ...genres.map((genre) => ({
        genres: {
          has: genre,
        },
      })),
    ];

    const statusWhere = [
      ...status.map((statusEntry) => ({
        status: {
          statusTitle: statusEntry,
        },
      })),
    ];

    const AND: Array<object> = [];

    if (platformWhere.length > 0) AND.push({ OR: platformWhere });
    if (genresWhere.length > 0) AND.push({ OR: genresWhere });
    if (statusWhere.length > 0) AND.push({ OR: statusWhere });

    return await prisma.$transaction([
      prisma.userGame.findMany({
        where: {
          userId: userId,
          title: { contains: search, mode: "insensitive" },
          AND,
        },

        include: {
          status: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
        skip: limit * (page - 1),
      }),
      prisma.userGame.count({
        where: {
          userId: userId,
          title: { contains: search, mode: "insensitive" },
          AND,
        },
      }),
    ]);
  });

interface userGameQueryOptionsParams {
  userId: string;
  search?: string;
  platforms?: string[];
  genres?: string[];
  status?: string[];
  limit?: number;
  page?: number;
}

export const userGameQueryOptions = ({
  userId,
  search,
  platforms = [],
  genres = [],
  status = [],
  limit = 20,
  page = 1,
}: userGameQueryOptionsParams) =>
  queryOptions({
    queryKey: ["userGames"],
    queryFn: () =>
      fetchUserGames({
        data: { userId, search, platforms, genres, status, limit, page },
      }),
  });
