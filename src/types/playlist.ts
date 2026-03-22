import type { Track } from "./track";

export interface Playlist {
  id: number;

  name: string;
  description: string;
  author: string;
  cover: string | null;

  tracks: Track[];

  stars: number;
  alreadyStarred: boolean;
}
