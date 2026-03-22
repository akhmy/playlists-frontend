import type { Track } from "@/types/track";
import { client } from "./clients";

export const trackApi = {
  getTrack: (id: string) =>
    client.get<Track>(`tracks/${id}`).then((res) => res.data),

  searchTracks: (search: string) =>
    client
      .get<Track[]>(`tracks/`, { params: { search } })
      .then((res) => res.data),
};
