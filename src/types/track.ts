export interface Track {
  id: number;
  name: string;
  artists: string;
  genres: { id: number; name: string }[];
  cover: string | null;
}
