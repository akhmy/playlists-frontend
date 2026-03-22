import type { Playlist } from "@/types/playlist";
import { PlaylistGridItem } from "../PlaylistGridItem/PlaylistGridItem";
import styles from "./PlaylistGrid.module.css";
import { Link } from "react-router-dom";
import clsx from "clsx";

interface PlaylistGridProps {
  playlists: Playlist[];
}

export const PlaylistGrid = ({ playlists }: PlaylistGridProps) => {
  return (
    <div className={styles.grid}>
      {playlists.map((p) => (
        <Link
          to={`/playlists/${p.id}`}
          className={clsx(styles.link, "subtleLink")}
        >
          <PlaylistGridItem playlist={p} />
        </Link>
      ))}
    </div>
  );
};
