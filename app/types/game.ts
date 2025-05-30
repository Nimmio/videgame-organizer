import { IGDBGame, UserGame } from "@/generated/prisma";
import { Status } from "better-auth";
import { z } from "zod";

export interface SearchGame {
  name: string;
  first_release_date: number;
  id: number;
  cover?: {
    url: string;
  };
  summary?: string;
  genres: {
    name: string;
    id: number;
  }[];
  platforms: {
    name: string;
    id: number;
  }[];
}

export const SearchGameSchema = z.object({
  name: z.string(),
  first_release_date: z.number(),
  id: z.number(),
  cover: z
    .object({
      url: z.string(),
    })
    .optional(),
  summary: z.string().optional(),
  genres: z.array(
    z.object({
      name: z.string(),
      id: z.number(),
    })
  ),
  platforms: z.array(
    z.object({
      name: z.string(),
      id: z.number(),
    })
  ),
});

export interface LibraryUserGame extends UserGame {
  game: {...IGDBGame,};
  status: Status;
}
