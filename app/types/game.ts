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
  checksum: string;
}

export type SearchGameWithPlatfrom = SearchGame & {
  platform: SearchGame["platforms"][0];
};

export const SearchGameSchema = z.object({
  name: z.string(),
  first_release_date: z.number().optional(),
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
      checksum: z.string().uuid(),
    })
  ),
  platforms: z.array(
    z.object({
      name: z.string(),
      id: z.number(),
      checksum: z.string().uuid(),
    })
  ),
  checksum: z.string().uuid(),
});
