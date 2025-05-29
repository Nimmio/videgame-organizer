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
