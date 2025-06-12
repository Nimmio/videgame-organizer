import { createMiddleware } from "@tanstack/react-start";
import { auth } from "./auth";
import { getHeaders } from "@tanstack/react-start/server";

export const userMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await getHeaders(),
  });
  if (!session) {
    throw new Error("no Session");
  }
  return next({
    context: {
      user: session.user,
    },
  });
});
