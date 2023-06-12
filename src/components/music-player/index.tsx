import { useCallback } from "react";

import repeatOff from "@assets/icons/repeat-off.svg";
import repeatOnOnce from "@assets/icons/repeat-on-once.svg";
import volumeDown from "@assets/icons/volume-down.svg";
import volumeUp from "@assets/icons/volume-up.svg";
import { useMusicPlayer } from "@react/player";
import { translateNumberToDate } from "@utils/translate-number-to-date";

import * as styles from "./styles.css";

import type { TrackInfo } from "@services/player";
import type { FC } from "react";

interface TracksListProps {
  isPlaying:boolean
  trackInfos: TrackInfo[];
  currentTrackInfo: TrackInfo;
  setTrack: (track: Blob) => void;
}

const TracksList: FC<TracksListProps> = ({ isPlaying, trackInfos, currentTrackInfo, setTrack }) => {

  return (
    <>
      <div>再生リスト</div>
      <ul>
        {trackInfos.map((trackInfo) => (
          <li key={trackInfo.url}>
            {/* <button onClick={handleSetTrack}>{trackInfo.title}</button> */}
            {trackInfo.title}
            {!isPlaying && trackInfo.title === currentTrackInfo.title && <span>currently selected</span>}
            {(isPlaying && trackInfo.title === currentTrackInfo.title) ? <span>Now Playing</span> : null}
          </li>
        ))}
      </ul>
    </>
  );
}

export const MusicPlayer:FC = () => {
  const {
    currentTrack,
    currentTime,
    currentVolume,
    isPlaying,
    isRepeat,
    tracks,
    currentTrackInfo,
    play,
    pause,
    setTrack,
    seek,
    seekMouseDown,
    seekMouseUp,
    volume,
    toggleRepeat: repeat,
    registerTrack,
  } = useMusicPlayer();
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if (!file) return;
      registerTrack({ file });
    },
    [registerTrack]
  );

  const handleSeek = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const seekTo = parseInt(event.target.value, 10);
      if (Number.isNaN(seekTo)) return;
      seek(seekTo);
    },
    [seek]
  );

  const handleSeekMouseUp = useCallback(async () => {
    await seekMouseUp();
  }, [seekMouseUp]);

  const handleSeekMouseDown = useCallback(() => {
    seekMouseDown();
  }, [seekMouseDown]);

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const volumeTo = parseInt(event.target.value, 10);
      if (Number.isNaN(volumeTo)) return;
      volume(volumeTo / 100);
    },
    [volume]
  );

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        楽曲ファイルを選択してね
      </label>
      <input id="music-file" type="file" onChange={handleFileChange} accept="audio/*" className={styles.fileInput} />
      <div id="music-info" className={styles.musicInfo}>
        <span>{currentTrackInfo.title}</span>
      </div>
      <div id="seek-bar-box" className={styles.seekBarContainer}>
        <div id="current-time" className={styles.musicInfo}>
          <span>{translateNumberToDate(currentTime)}</span>
        </div>
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
        <span className={styles.duration}>{translateNumberToDate(currentTrackInfo.duration)}</span>
      </div>
      {currentTrack ? (
        <button onClick={isPlaying ? pause : play} className={styles.playPauseButton}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      ) : (
        <p>No track selected</p>
      )}
      <div className={styles.volumeContainer}>
        <img className={styles.volumeIcon} src={volumeDown} alt="volume-down" />
        <input
          type="range"
          min={0}
          max={100}
          value={currentVolume * 100}
          className={styles.volumeBar}
          onChange={handleVolumeChange}
        />
        <img className={styles.volumeIcon} src={volumeUp} alt="volume-down" />
      </div>
      <div className={styles.optionContainer}>
        <button onClick={repeat} className={styles.repeatButton}>
          {isRepeat ? (
            <img className={styles.repeatIcon} src={repeatOnOnce} alt="repeat" />
          ) : (
            <img className={styles.repeatIcon} src={repeatOff} alt="repeat" />
          )}
        </button>
      </div>
      <TracksList isPlaying={isPlaying} trackInfos={tracks} currentTrackInfo={currentTrackInfo} setTrack={setTrack} />
    </div>
  );
};
