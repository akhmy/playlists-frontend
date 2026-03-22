import { Helmet } from "react-helmet-async";
import styles from "./AboutPage.module.css";

export const About = () => {
  return (
    <>
      <Helmet>
        <title>О проекте</title>
      </Helmet>
      <div>
        <h1>О проекте</h1>
        <p>Тут какая-то информация о проекте</p>
        <div className={styles.links}>
          <a href="http://localhost:8000/admin/">Админ-панель</a>
          <a href="http://localhost:8000/api/v1/redoc/">Документация API</a>
        </div>
      </div>
    </>
  );
};
