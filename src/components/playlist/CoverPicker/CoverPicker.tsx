import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import styles from "./CoverPicker.module.css";

interface CoverPickerProps {
  current: string | null;
  file: File | null;
  onChange: (file: File) => void;
}

export const CoverPicker = ({ current, file, onChange }: CoverPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : current;

  return (
    <div className={styles.wrapper} onClick={() => inputRef.current?.click()}>
      {preview ? (
        <img src={preview} className={styles.preview} alt="cover" />
      ) : (
        <div className={styles.placeholder}>
          <ImagePlus size={24} />
          <span>Добавить обложку</span>
        </div>
      )}
      {preview && (
        <div className={styles.overlay}>
          <ImagePlus size={20} />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
        }}
      />
    </div>
  );
};
