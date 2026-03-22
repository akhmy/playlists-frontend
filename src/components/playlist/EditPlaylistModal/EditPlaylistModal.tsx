import type { Playlist } from "@/types/playlist";
import type { Track } from "@/types/track";
import styles from "./EditPlaylistModal.module.css";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { playlistApi } from "@/api/playlists";
import { trackApi } from "@/api/tracks";
import { useNavigate } from "react-router-dom";
import type { PutPlaylistDto } from "@/api/dto";
import { CoverPicker } from "@/components/playlist/CoverPicker/CoverPicker";

interface EditPlaylistModalProps {
  onClose: () => void;
  onSave: () => void;
  playlist: Playlist;
}

export const EditPlaylistModal = ({
  onClose,
  onSave,
  playlist,
}: EditPlaylistModalProps) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description ?? "");
  const [tracks, setTracks] = useState(playlist.tracks);
  const [cover, setCover] = useState<File | null>(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  const navigate = useNavigate();

  const removeTrack = (id: number) =>
    setTracks((prev) => prev.filter((t) => t.id !== id));

  const addTrack = (track: Track) => {
    if (tracks.some((t) => t.id === track.id)) return;
    setTracks((prev) => [...prev, track]);
    setSearch("");
    setSearchResults([]);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value.trim()) { setSearchResults([]); return; }
    trackApi.searchTracks(value).then(setSearchResults);
  };

  const handleDeletePlaylist = () =>
    playlistApi.deletePlaylist(playlist.id).then(() => navigate("/"));

  const handleSave = () =>
    playlistApi
      .putPlaylist(playlist.id, {
        name,
        description,
        tracks: tracks.map((t) => t.id),
        cover: playlist.cover,
      } as PutPlaylistDto, cover)
      .then(() => { onClose(); onSave(); });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Изменить плейлист</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className={styles.body}>
          <CoverPicker current={playlist.cover} file={cover} onChange={setCover} />
          <div className={styles.field}>
            <span className={styles.label}>Название</span>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Описание</span>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <span className={styles.sectionTitle}>Треки</span>

          <div className={styles.tracklist}>
            {tracks.map((track, i) => (
              <div key={track.id} className={styles.trackRow}>
                <span className={styles.trackIndex}>{i + 1}</span>
                <div className={styles.trackInfo}>
                  <span className={styles.trackName}>{track.name}</span>
                  {track.artists && (
                    <span className={styles.trackArtist}>{track.artists}</span>
                  )}
                </div>
                <button className={styles.removeButton} onClick={() => removeTrack(track.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.searchWrapper}>
            <div className={styles.field}>
              <span className={styles.label}>Добавить трек</span>
              <div className={styles.searchInputWrapper}>
                <Plus size={14} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Поиск по названию..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            {searchResults.length > 0 && (
              <div className={styles.searchResults}>
                {searchResults.map((track) => (
                  <button
                    key={track.id}
                    className={styles.searchResultRow}
                    onClick={() => addTrack(track)}
                  >
                    <div className={styles.trackInfo}>
                      <span className={styles.trackName}>{track.name}</span>
                      {track.artists && (
                        <span className={styles.trackArtist}>{track.artists}</span>
                      )}
                    </div>
                    <Plus size={14} className={styles.addIcon} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.deleteButton} onClick={handleDeletePlaylist}>
            Удалить плейлист
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
