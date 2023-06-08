import { useCallback, useEffect, useState } from "react";

import { useAudioPlayer } from "./hooks";
import * as styles from "./styles.css";

export const MusicPlayer = () => {
  const { isPlaying$, handleFileChange } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const subscription = isPlaying$.subscribe((playing) => setIsPlaying(playing));

    return () => {
      subscription.unsubscribe();
    };
  }, [isPlaying$]);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      isPlaying$.next(false);
      const files = e.target.files;
      if (files) {
        handleFileChange(files[0]);
      }
    },
    [handleFileChange, isPlaying$]
  );

  const handleTogglePlay = useCallback(() => {
    isPlaying$.next(!isPlaying$.value);
  }, [isPlaying$]);

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
      <button onClick={handleTogglePlay} className={styles.playPauseButton}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};
