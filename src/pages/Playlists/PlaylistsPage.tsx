import { playlistApi } from "@/api/playlists";
import type { Playlist } from "@/types/playlist";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlaylistGrid } from "@/components/playlist/PlaylistGrid/PlaylistGrid";
import { CreatePlaylistModal } from "@/components/playlist/CreatePlaylistModal/CreatePlaylistModal";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import styles from "./PlaylistsPage.module.css";

const LIMIT = 16;

export const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    playlistApi.getPlaylists({ limit: LIMIT, offset }).then((data) => {
      setPlaylists(data.results);
      setCount(data.count);
    });
  }, [offset]);

  const totalPages = Math.ceil(count / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <>
      <Helmet>
        <title>Плейлисты</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Все плейлисты</h1>
          {user && (
            <button
              className={styles.createButton}
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={16} />
              Создать
            </button>
          )}
        </div>
        <PlaylistGrid playlists={playlists} />
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => setOffset(offset - LIMIT)}
            >
              ←
            </button>
            <span className={styles.pageInfo}>
              {currentPage} / {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setOffset(offset + LIMIT)}
            >
              →
            </button>
          </div>
        )}
      </div>
      {createOpen && (
        <CreatePlaylistModal onClose={() => setCreateOpen(false)} />
      )}
    </>
  );
};
