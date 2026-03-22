import type { Playlist } from "@/types/playlist";
import styles from "./PlaylistGridItem.module.css";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PlaylistGridItemProps {
  playlist: Playlist;
}

export const PlaylistGridItem = ({ playlist }: PlaylistGridItemProps) => {
  console.log(playlist);
  const { user } = useAuth();

  return (
    <div className={styles.item}>
      <div className={styles.coverWrapper}>
        <img
          src={playlist.cover ?? "/assets/playlist-cover-placeholder.webp"}
          className={styles.cover}
          alt={playlist.name}
        />
        <div className={styles.overlay}>
          {/* <button className={styles.playButton}>
            <Play size={48} />
          </button> */}
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.nameAuthor}>
          <span className={styles.name}>{playlist.name}</span>
          <span className={styles.author}>{playlist.author}</span>
        </div>
        <div
          className={`${styles.stars}${user && playlist.alreadyStarred ? ` ${styles.starred}` : ""}`}
        >
          <Star size={14} fill="currentColor" color="currentColor" />
          <span>{playlist.stars}</span>
        </div>
      </div>
    </div>
  );
};
