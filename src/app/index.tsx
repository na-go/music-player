import { memo } from "react";

import { ThemeProvider } from "@theme/provider";

import * as styles from "./styles.css";

const App = () => {
  return (
    <ThemeProvider>
      <div className={styles.root}>
        <header className={styles.header}></header>
        <main className={styles.main}>
          <section>
            <h1>Music Player</h1>
          </section>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </ThemeProvider>
  );
};

export default memo(App);
