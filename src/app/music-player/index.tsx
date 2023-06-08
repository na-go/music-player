import { useSubscription } from "observable-hooks";
import { useCallback, useState } from "react";

import { useAudioPlayer } from "./hooks";
import * as styles from "./styles.css";

export const MusicPlayer = () => {
  const { isPlaying$, handleFileChange } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  useSubscription(isPlaying$, setIsPlaying);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFileChange(files[0]);
      }
    },
    [handleFileChange]
  );

  const onButtonClick = useCallback(() => {
    isPlaying$.next(!isPlaying);
  }, [isPlaying, isPlaying$]);

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        Choose a music file
      </label>
      <input id="music-file" type="file" onChange={onFileChange} accept="audio/*" className={styles.fileInput} />
      {/* 現在再生時間と全体の再生時間の表示は後で実装します */}
      {/* <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeekChange}
        className={styles.seekBar}
      /> */}
      <button onClick={onButtonClick} className={styles.playPauseButton}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};
