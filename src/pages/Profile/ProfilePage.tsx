import styles from "./ProfilePage.module.css";
import { Helmet } from "react-helmet-async";
import type { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { Star } from "lucide-react";

export const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!username) return;
    authApi
      .getUser(username)
      .then(setUser)
      .catch(() => navigate("/404"));
  }, [username]);

  if (!username || !user) return null;

  return (
    <>
      <Helmet>
        <title>{user.username}</title>
      </Helmet>
      <div className={styles.profileContainer}>
        <div className={styles.avatarWrapper}>
          <img
            src={user.avatar ?? "/assets/profile-avatar-placeholder.webp"}
            className={styles.avatar}
          />
        </div>
        <div className={styles.meta}>
          <span className={styles.label}>
            {user.role === "admin" ? "Администратор" : "Пользователь"}
          </span>
          <h1 className={styles.title}>{user.username}</h1>
          {user.bio && <span className={styles.bio}>{user.bio}</span>}
          <div className={styles.stats}>
            <span className={styles.stat}>
              <Star size={14} color="currentColor" fill="currentColor" />
              {user.stars}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
