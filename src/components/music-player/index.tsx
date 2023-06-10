import { useCallback } from "react";

import { useMusicPlayer } from "@react/player";

import * as styles from "./styles.css";


export const MusicPlayer = () => {

  const { currentTrack, isPlaying, play, pause, chooseTrack } = useMusicPlayer();
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (!file) return;
    chooseTrack({ file });
  }, [chooseTrack]);

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        Choose a music file
      </label>
      <input id="music-file" type="file" onChange={handleFileChange} accept="audio/*" className={styles.fileInput} />
      {/* TODO: 現在再生時間の表示 */}
      {/* TODO: 全体の再生時間の表示 */}
      {/* TODO: 再生時間のシークバー */}
      {/* <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeekChange}
        className={styles.seekBar}
      /> */}
      {currentTrack ? (
        <button onClick={isPlaying ? pause : play} className={styles.playPauseButton}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      ) : (
        <p>No track selected</p>
      )}
    </div>
  );
};
