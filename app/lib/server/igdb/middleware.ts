import { createMiddleware } from "@tanstack/react-start";
import { getAuthentication } from "./auth";

export const igdbAuthMiddleware = createMiddleware().server(
  async ({ next }) => {
    return next({
      context: {
        igdbAccessToken: (await getAuthentication()).access_token,
      },
    });
  }
);
