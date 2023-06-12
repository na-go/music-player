import { useCallback } from "react";

import { useMusicPlayer } from "@react/player";
import { translateNumberToDate } from "@utils/translate-number-to-date";

import * as styles from "./styles.css";

export const MusicPlayer = () => {
  const { currentTrack, currentTime, currentVolume, isPlaying, currentTrackInfo, play, pause, chooseTrack, seek, seekMouseDown, seekMouseUp, volume } = useMusicPlayer();
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if (!file) return;
      chooseTrack(file);
    },
    [chooseTrack]
  );

  const handleSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseInt(event.target.value, 10);
    if (Number.isNaN(seekTo)) return;
    seek(seekTo);
  }, [seek]);

  const handleSeekMouseUp = useCallback(async () => {
    await seekMouseUp();
  }, [seekMouseUp]);

  const handleSeekMouseDown = useCallback(() => {
    seekMouseDown();
  }, [seekMouseDown]);

  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const volumeTo = parseInt(event.target.value, 10);
    if (Number.isNaN(volumeTo)) return;
    volume(volumeTo / 100);
  }, [volume]);

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        楽曲ファイルを選択してね
      </label>
      <input id="music-file" type="file" onChange={handleFileChange} accept="audio/*" className={styles.fileInput} />
      <div id="music-info" className={styles.musicInfo}>
        <span>{currentTrackInfo.title}</span>
      </div>
      <div id="seek-bar-box" className={styles.seekBarBox}>
        <div id="current-time" className={styles.musicInfo}>
          <span>
            {translateNumberToDate(currentTime)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={currentTrackInfo.duration}
          value={currentTime ?? 0}
          className={styles.seekBar}
          onChange={handleSeek}
          onMouseDown={handleSeekMouseDown}
          onMouseUp={handleSeekMouseUp}
        />
        <span className={styles.duration}>
          {translateNumberToDate(currentTrackInfo.duration)}
        </span>
      </div>
      {currentTrack ? (
        <button onClick={isPlaying ? pause : play} className={styles.playPauseButton}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      ) : (
        <p>No track selected</p>
      )}
      {/* TODO: assets/icons/volume-down.svgとassets/icons/volume-up.svgでinputを挟む */}
      <div className={styles.volumeContainer}>
        <img
          className={styles.volumeIcon}
          src='src/assets/icons/volume-down.png'
          alt="volume-down"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={currentVolume*100}
          className={styles.volumeBar}
          onChange={handleVolumeChange}
        />
        <img
          className={styles.volumeIcon}
          src='src/assets/icons/volume-up.png'
          alt="volume-down"
        />
      </div>
    </div>
  );
};
