import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playlistApi } from "@/api/playlists";
import { CoverPicker } from "@/components/playlist/CoverPicker/CoverPicker";
import styles from "./CreatePlaylistModal.module.css";

interface CreatePlaylistModalProps {
  onClose: () => void;
}

export const CreatePlaylistModal = ({ onClose }: CreatePlaylistModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name.trim()) return;
    playlistApi.createPlaylist(name, description, cover).then((data) => {
      onClose();
      navigate(`/playlists/${data.id}`);
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Новый плейлист</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className={styles.body}>
          <CoverPicker current={null} file={cover} onChange={setCover} />
          <div className={styles.field}>
            <span className={styles.label}>Название</span>
            <input
              className={styles.input}
              type="text"
              placeholder="Мой плейлист"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Описание</span>
            <textarea
              className={styles.textarea}
              placeholder="Необязательно"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Отмена
          </button>
          <button
            className={styles.createButton}
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};
