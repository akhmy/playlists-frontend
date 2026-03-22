import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>PLAYLISTS</span>
      <span className={styles.copy}>
        © {new Date().getFullYear()} Все права не защищены
      </span>
    </footer>
  );
};
