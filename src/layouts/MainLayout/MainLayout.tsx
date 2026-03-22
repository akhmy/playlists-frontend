import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      <div className={styles.scrollableWrapper}>
        <div className={styles.scrollableContent}>
          <div className={styles.mainWrapper}>
            <main>
              <Outlet />
            </main>
          </div>
          <div className={styles.footerWrapper}>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};
