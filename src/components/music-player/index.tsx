import { useCallback } from "react";

import { useMusicPlayer } from "@react/player";
import { translateNumberToDate } from "@utils/translate-number-to-date";

import * as styles from "./styles.css";


export const MusicPlayer = () => {

  const { currentTrack, currentTime, isPlaying, currentTrackInfo ,play, pause, chooseTrack } = useMusicPlayer();
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (!file) return;
    chooseTrack({ file });
  }, [chooseTrack]);

  const handleSeekChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(event.target.value);
  }, []);

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        Choose a music file
      </label>
        <label id="music-info" className={styles.musicInfo}>
          <span>{currentTrackInfo.title}</span>
        </label>
        <label id="music-info" className={styles.musicInfo}>
          <span>{translateNumberToDate(currentTime)} / {translateNumberToDate(currentTrackInfo.duration)}</span>
        </label>
      <input id="music-file" type="file" onChange={handleFileChange} accept="audio/*" className={styles.fileInput} />
      {/* TODO: 現在再生時間の表示 */}
      {/* TODO: 再生時間のシークバー */}
      <input
        type="range"
        min={0}
        max={currentTrackInfo.duration}
        value={currentTime}
        onChange={handleSeekChange} // TODO: 再生時間を変更する関数を入れるhandleSeekChange
        className={styles.seekBar}
      />
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
