import { playlistApi } from "@/api/playlists";
import { PlaylistGrid } from "@/components/playlist/PlaylistGrid/PlaylistGrid";
import type { Playlist } from "@/types/playlist";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./TrendingPage.module.css";

export const TrendingPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  useEffect(() => {
    playlistApi.getTrendingPlaylists().then(setPlaylists);
  }, []);

  return (
    <>
      <Helmet>
        <title>Playlists</title>
      </Helmet>
      <div className={styles.home}>
        <h1>Плейлисты недели</h1>
        <PlaylistGrid playlists={playlists}></PlaylistGrid>
      </div>
    </>
  );
};
