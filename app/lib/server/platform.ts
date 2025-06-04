import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "../prisma";
import { queryOptions } from "@tanstack/react-query";

const getPlatformsSchema = z.object({
  userId: z.string(),
  search: z.string().optional(),
});

export const getPlatforms = createServerFn({ method: "POST" })
  .validator((d: unknown) => getPlatformsSchema.parse(d))
  .handler(async ({ data }) => {
    const { userId, search } = data;
    return prisma.platform.findMany({
      where: {
        userGames: {
          some: {
            userId,
          },
        },
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  });

interface PlatformQueryOptionsParams {
  userId: string;
  search?: string;
}

export const PlatformQueryOptions = ({
  userId,
  search = "",
}: PlatformQueryOptionsParams) =>
  queryOptions({
    queryKey: ["platforms"],
    queryFn: () => getPlatforms({ data: { userId, search } }),
  });
