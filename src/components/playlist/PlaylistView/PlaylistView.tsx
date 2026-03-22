import type { Playlist } from "@/types/playlist";
import styles from "./PlaylistView.module.css";
import { Clock, Pencil, Star } from "lucide-react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { EditPlaylistModal } from "@/components/playlist/EditPlaylistModal/EditPlaylistModal";

interface PlaylistViewProps {
  playlist: Playlist;
  onUpvote: () => void;
  onRefresh: () => void;
}

export const PlaylistView = ({ playlist, onUpvote, onRefresh }: PlaylistViewProps) => {
  const { user } = useAuth();
  const isAuthor = user?.username === playlist.author;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalClose = () => setEditModalOpen(false);

  return (
    <div className={styles.playlistContainer}>
      <div className={styles.hero}>
        <div className={styles.coverWrapper}>
          <img
            src={playlist.cover ?? "/assets/playlist-cover-placeholder.webp"}
            alt={playlist.name}
            className={styles.cover}
          />
        </div>

        <div className={styles.meta}>
          <span className={styles.label}>{isAuthor && "Ваш "}Плейлист</span>
          <h1 className={styles.title}>{playlist.name}</h1>
          <div className={styles.subMeta}>
            <Link to={`/profiles/${playlist.author}`} className={styles.author}>
              {playlist.author}
            </Link>
            <span>{playlist.tracks?.length ?? "0"} треков</span>
          </div>
          <div className={styles.buttonsContainer}>
            <button
              className={`${styles.starButton}${playlist.alreadyStarred ? ` ${styles.starred}` : ""}`}
              onClick={() => onUpvote()}
            >
              <Star size={14} fill="currentColor" color="currentColor" />
              <span>{playlist.stars}</span>
            </button>
            {isAuthor && (
              <button
                className={styles.starButton}
                onClick={() => setEditModalOpen(true)}
              >
                <Pencil size={14} />
                <span>Изменить</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <span>{playlist.description}</span>
      <div className={styles.tracklist}>
        <div className={clsx(styles.tracklistRow, styles.tracklistHeader)}>
          <span className={styles.trackNumber}>#</span>
          <span>Название</span>
          <div className={styles.iconWrapper}>
            <Clock size={14} className={styles.trackDuration} />
          </div>
        </div>
        <div className={styles.divider} />
        {playlist.tracks.map((t, i) => (
          <div key={t.id} className={styles.tracklistRowWrapper}>
            <Link className={styles.tracklistRow} to={`/tracks/${t.id}`}>
              <span className={styles.trackNum}>{i + 1}</span>
              <div className={styles.trackInfo}>
                <span className={styles.trackName}>{t.name}</span>
                <span className={styles.trackArtist}>{t.artists ?? ""}</span>
              </div>
              <span className={styles.trackDuration}>—/—</span>
            </Link>
          </div>
        ))}
      </div>

      {editModalOpen && (
        <EditPlaylistModal onClose={handleEditModalClose} onSave={onRefresh} playlist={playlist} />
      )}
    </div>
  );
};
