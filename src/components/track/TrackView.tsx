import type { Track } from "@/types/track";
import styles from "./TrackView.module.css";

interface TrackViewProps {
  track: Track;
}

export const TrackView = ({ track }: TrackViewProps) => {
  return (
    <div className={styles.trackContainer}>
      <div className={styles.coverWrapper}>
        <img
          className={styles.cover}
          src={track.cover ?? "/assets/track-cover-placeholder.webp"}
          alt={track.name}
        />
      </div>

      <div className={styles.meta}>
        <span className={styles.label}>Трек</span>
        <h1 className={styles.title}>{track.name}</h1>
        <span className={styles.artists}>{track.artists}</span>
        <div className={styles.genres}>
          {track.genres.map((g) => (
            <span key={g.id} className={styles.genre}>
              {g.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
