import { useCallback } from "react";

import { useMusicPlayer } from "@react/player";
import { translateNumberToDate } from "@utils/translate-number-to-date";

import * as styles from "./styles.css";

export const MusicPlayer = () => {
  const { currentTrack, currentTime, isPlaying, currentTrackInfo, play, pause, chooseTrack, seek, seekMouseDown, seekMouseUp } = useMusicPlayer();
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if (!file) return;
      chooseTrack({ file });
    },
    [chooseTrack]
  );

  const handleSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseInt(event.target.value, 10);
    if (Number.isNaN(seekTo)) return;
    seek(seekTo);
  }, [seek]);

  const handleSeekMouseUp = useCallback(() => {
    seekMouseUp();
  }, [seekMouseUp]);

  const handleSeekMouseDown = useCallback(() => {
    seekMouseDown();
  }, [seekMouseDown]);

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        楽曲ファイルを選択してね
      </label>
      <label id="music-info" className={styles.musicInfo}>
        <span>{currentTrackInfo.title}</span>
      </label>
      <label id="music-info" className={styles.musicInfo}>
        <span>
          {translateNumberToDate(currentTime)} / {translateNumberToDate(currentTrackInfo.duration)}
        </span>
      </label>
      <input id="music-file" type="file" onChange={handleFileChange} accept="audio/*" className={styles.fileInput} />
      <input
        type="range"
        min={0}
        max={currentTrackInfo.duration}
        value={currentTime}
        className={styles.seekBar}
        onChange={handleSeek}
        onMouseDown={handleSeekMouseDown}
        onMouseUp={handleSeekMouseUp}
      />
      {currentTrack ? (
        <button onClick={isPlaying ? pause : play} className={styles.playPauseButton}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      ) : (
        <p>No track selected</p>
      )}
    </div>
  );
};
