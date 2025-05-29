import { UserGame } from "@/generated/prisma";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createUserGameSchema = z.object({
    statusId: z.number()
    
})

const createUserGame = createServerFn({ method: "POST" }).validator((d:UserGame) => )
);



export const createEmailLogin = createServerFn({ method: "POST" })
  .validator((d: unknown) => EmailPasswordSchema.parse(d))
  .handler(async ({ data }) => {
    const { data: signupData, error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.email,
    });
    return { data: signupData, error };
  });