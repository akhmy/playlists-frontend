import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 — Страница не найдена</title>
      </Helmet>
      <div className={styles.container}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Страница не найдена</h1>
        <Link to="/" className={styles.link}>На главную</Link>
      </div>
    </>
  );
};
