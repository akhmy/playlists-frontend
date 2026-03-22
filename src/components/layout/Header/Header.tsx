import { Link } from "react-router-dom";
import { links } from "./links";
import styles from "./Header.module.css";
import { ListMusic } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/api/authApi";

export const Header = () => {
  const { user, setUser } = useAuth();

  const handleSignOut = () => {
    authApi.signOut().then(() => setUser(null));
  };

  return (
    <div className={styles.header}>
      <Link to="/" className={clsx(styles.logo, "subtleLink")}>
        <ListMusic size={32} />
        <span className={styles.title}>PLAYLISTS</span>
      </Link>
      <nav className={styles.nav}>
        {links.map((l) => (
          <Link to={l.href}>{l.label}</Link>
        ))}
      </nav>
      {user ? (
        <div className={styles.userData}>
          <img
            src={user.avatar ?? "/assets/profile-avatar-placeholder.webp"}
            className={styles.avatar}
          ></img>
          <Link to={`/profiles/${user.username}`} className={styles.link}>
            {user.username}
          </Link>
          <span>/</span>
          <Link to={"/"} className={styles.link} onClick={handleSignOut}>
            Выйти
          </Link>
        </div>
      ) : (
        <Link to={"/sign-in"} className={styles.link}>
          Войти
        </Link>
      )}
    </div>
  );
};
