import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authClient } from "../auth-client";
import { auth } from "./auth";

const EmailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

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

export const emailLogin = createServerFn({ method: "POST" })
  .validator((d: unknown) => EmailPasswordSchema.parse(d))
  .handler(async ({ data }) => {
    const { email, password } = data;
    const { user } = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return { data: user, error: !user ? "User not Found" : null };
  });
