import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import prisma from "./prisma";
import z from "zod";

const fetchUserGamesSchema = z.object({
  userId: z.string(),
  search: z.string().optional(),
  platform: z.literal("all").optional().or(z.number().optional()),
  status: z.literal("all").optional().or(z.number().optional()),
  limit: z.number(),
});

const fetchUserGames = createServerFn({ method: "GET" })
  .validator((d: unknown) => fetchUserGamesSchema.parse(d))
  .handler(async ({ data }) => {
    const {
      userId,
      search = "",
      platform: platformFilter = "all",
      status: statusFilter = "all",
      limit,
    } = data;

    const platformWhere =
      platformFilter !== "all"
        ? {
            id: platformFilter as number,
          }
        : {};

    const statusWhere =
      statusFilter !== "all"
        ? {
            id: statusFilter as number,
          }
        : {};

    return await prisma.userGame.findMany({
      where: {
        userId: userId,
        title: { contains: search, mode: "insensitive" },
        platform: platformWhere,
        status: statusWhere,
      },
      include: {
        status: true,
        platform: true,
      },
      take: limit,
    });
  });

interface userGameQueryOptionsParams {
  userId: string;
  search?: string;
  platform?: "all" | number;
  status?: "all" | number;
  limit?: number;
}

export const userGameQueryOptions = ({
  userId,
  search,
  platform,
  status,
  limit = 20,
}: userGameQueryOptionsParams) =>
  queryOptions({
    queryKey: ["userGames"],
    queryFn: () =>
      fetchUserGames({
        data: { userId, search, platform, status, limit },
      }),
  });
