import type { PaginatedDto, PlaylistDto, PutPlaylistDto } from "./dto";
import { client } from "./clients";

const mapPlaylist = ({ already_starred, ...rest }: PlaylistDto) => ({
  ...rest,
  alreadyStarred: already_starred,
});

export const playlistApi = {
  getPlaylists: (params?: { limit?: number; offset?: number }) =>
    client
      .get<PaginatedDto<PlaylistDto>>("playlists/", { params })
      .then((res) => ({
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous,
        results: res.data.results.map(mapPlaylist),
      })),
  getTrendingPlaylists: () =>
    client
      .get<PlaylistDto[]>("playlists/trending/")
      .then((res) => res.data.map(mapPlaylist)),
  getPlaylist: (id: string) =>
    client.get<PlaylistDto>(`playlists/${id}`).then((res) => {
      const { already_starred, ...rest } = res.data;
      return { ...rest, alreadyStarred: already_starred };
    }),

  upvotePlaylist: (id: string) =>
    client
      .patch<{
        stars: number;
        already_starred: boolean;
      }>(`playlists/${id}/upvote/`)
      .then((res) => ({
        stars: res.data.stars,
        alreadyStarred: res.data.already_starred,
      })),

  createPlaylist: (name: string, description: string, cover?: File | null) => {
    const form = new FormData();
    form.append("name", name);
    form.append("description", description);
    if (cover) form.append("cover", cover);
    return client.post<PlaylistDto>("playlists/", form).then((res) => res.data);
  },

  putPlaylist: (id: number, dto: PutPlaylistDto, cover?: File | null) => {
    const form = new FormData();
    form.append("name", dto.name);
    form.append("description", dto.description ?? "");
    dto.tracks.forEach((trackId) => form.append("tracks", String(trackId)));
    if (cover) form.append("cover", cover);
    return client.put(`playlists/${id}/`, form);
  },

  deletePlaylist: (id: number) => client.delete(`playlists/${id}/`),
};
