import { UserGame } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { useRouteContext } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CreateUserGameSchema = z.object({
  statusId: z.number(),
  gameId: z.number(),
  userId: z.string(),
});

export const createUserGame = createServerFn({ method: "POST" })
  .validator((d: unknown) => CreateUserGameSchema.parse(d))
  .handler(async ({ data }) => {
    const { gameId, statusId, userId } = data;

    console.log("gameId", gameId);

    console.log("statusId", statusId);

    console.log("userId", userId);
    // const {} = await prisma.userGame.create({
    //   data:{
    //     statusId
    //   }
    // })
  });
