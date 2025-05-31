import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "../prisma";
import { queryOptions } from "@tanstack/react-query";

const getPlatformsSchema = z.object({
  userId: z.string(),
});

export const getPlatforms = createServerFn({ method: "POST" })
  .validator((d: unknown) => getPlatformsSchema.parse(d))
  .handler(async ({ data }) => {
    const { userId } = data;
    return prisma.platform.findMany({
      where: {
        userGames: {
          some: {
            userId,
          },
        },
      },
      include: {
        userGames: true,
      },
    });
  });

export const PlatformQueryOptions = ({ userId }: { userId: string }) =>
  queryOptions({
    queryKey: ["platforms"],
    queryFn: () => getPlatforms({ data: { userId } }),
  });
