import { memo } from "react";

import { MusicPlayer } from "@components/music-player";
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
          <MusicPlayer />
        </main>
        <footer className={styles.footer}>
          <div>Twitter: @remark_tzi</div>
          <a
            target="_blank"
            href="https://icons8.com/icon/QzlN7P7hnRxs/1-%E5%9B%9E%E3%83%AA%E3%83%94%E3%83%BC%E3%83%88"
            rel="noreferrer"
          >
            1 回リピート
          </a>{" "}
          icon by{" "}
          <a target="_blank" href="https://icons8.com" rel="noreferrer">
            Icons8
          </a>
          <a
            target="_blank"
            href="https://icons8.com/icon/ap6cKY4uRpJj/%E7%B9%B0%E3%82%8A%E8%BF%94%E3%81%99"
            rel="noreferrer"
          >
            繰り返す
          </a>{" "}
          icon by{" "}
          <a target="_blank" href="https://icons8.com" rel="noreferrer">
            Icons8
          </a>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default memo(App);
