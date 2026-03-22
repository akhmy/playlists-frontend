import type { Track } from "@/types/track";

export interface PaginatedDto<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PlaylistDto {
  id: number;
  name: string;
  description: string;
  author: string;
  cover: string | null;
  tracks: Track[];
  stars: number;
  already_starred: boolean;
}

export interface UserDto {
  username: string;
  avatar: string;
  bio: string;
  is_staff: string;

  stars: number;
}

export interface PutPlaylistDto {
  name: string;
  description: string;
  cover: string | null;
  tracks: number[];
}
