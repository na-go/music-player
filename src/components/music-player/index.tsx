import axios from "axios";
import React, { useCallback } from "react";

import repeatOff from "@assets/icons/repeat-off.svg";
import repeatOnOnce from "@assets/icons/repeat-on-once.svg";
import volumeDown from "@assets/icons/volume-down.svg";
import volumeUp from "@assets/icons/volume-up.svg";
import { useMusicPlayer } from "@react/player";
import { translateNumberToDate } from "@utils/view/translate-number-to-date";

import * as styles from "./styles.css";

import type { Track } from "@services/types";
import type { FC } from "react";

interface TracksListProps {
  isPlaying: boolean;
  trackInfos: Track[];
  currentTrackInfo: Track;
  onChange: (id: string) => void;
}

interface FileUploadAreaProps {
  onFileUpload: (files: File[]) => void;
}

const FileUploadArea: FC<FileUploadAreaProps> = ({ onFileUpload }) => {
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const files = Array.from(event.dataTransfer.files);

      onFileUpload(files);
    },
    [onFileUpload]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files === null) return;
      const files = Array.from(event.target.files);

      onFileUpload(files);
    },
    [onFileUpload]
  );

  return(
    <div className={styles.fileUploadArea} onDrop={handleDrop} onDragOver={handleDragOver}>
      <input type="file" id="file-upload" multiple onChange={handleFileSelect} className={styles.fileInput}/>
      <label htmlFor="file-upload" className={styles.fileUploadText}>楽曲ファイルを選択してね！</label>
    </div>
  )
}

const TracksList: FC<TracksListProps> = ({ isPlaying, trackInfos, currentTrackInfo, onChange }) => {
  const handleSetTrack = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const id = event.currentTarget.dataset.title;
      const trackInfoId = trackInfos.find((trackInfo) => trackInfo.title === id)?.id;
      if (trackInfoId === undefined) return;
      onChange(trackInfoId);
    },
    [trackInfos, onChange]
  );

  return (
    <div className={styles.trackListContainer}>
      <div className={styles.trackListTitle}>再生リスト</div>
      <ul className={styles.trackList}>
        {trackInfos.map((trackInfo) => (
          <li key={trackInfo.url} className={styles.trackListItem}>
            {trackInfo.id !== currentTrackInfo.id && (
              <button onClick={handleSetTrack} data-title={trackInfo.title} className={styles.trackListItemButton}>
                この曲にする！
              </button>
            )}
            {isPlaying && trackInfo.id === currentTrackInfo.id ? (
              <button className={styles.trackListItemButtonPlaying}>🎵 Now Playing</button>
            ) : null}
            {!isPlaying && trackInfo.id === currentTrackInfo.id && (
              <button className={styles.trackListItemButtonSelected}>💖 currently selected</button>
            )}
            <div className={styles.trackListItemTextContainer}>
              <span className={styles.trackListItemText}>{trackInfo.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const MusicPlayer: FC = () => {
  const {
    currentTime,
    currentVolume,
    isPlaying,
    isRepeat,
    tracks,
    currentTrackInfo,
    currentTrackId,
    play,
    pause,
    setTrack,
    seek,
    seekMouseDown,
    seekMouseUp,
    volume,
    toggleRepeatOnce,
    registerTrack,
    nextTrack,
    prevTrack,
  } = useMusicPlayer();



  const handleFilesUpload = useCallback(
    async (files: File[]) => {
      await Promise.all(files.map((file) => registerTrack(file)));
    },
    [registerTrack]
  );

  const handleSeek = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const seekTo = parseInt(event.target.value, 10);
      if (Number.isNaN(seekTo)) return;
      await seek(seekTo);
    },
    [seek]
  );

  const handleSeekMouseUp = useCallback(async () => {
    await seekMouseUp();
  }, [seekMouseUp]);

  const handleSeekMouseDown = useCallback(async () => {
    await seekMouseDown();
  }, [seekMouseDown]);

  const handleVolumeChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const volumeTo = parseInt(event.target.value, 10);
      if (Number.isNaN(volumeTo)) return;
      await volume(volumeTo / 100);
    },
    [volume]
  );

  const handleNext = useCallback(async () => {
    if (currentTrackId === null) return;
    await nextTrack(currentTrackId);
  }, [currentTrackId, nextTrack]);

  const handlePrevious = useCallback(async () => {
    if (currentTrackId === null) return;
    await prevTrack(currentTrackId);
  }, [currentTrackId, prevTrack]);

  const handleGetUser = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8787/api/user/1')
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }, [])

  const handlePostUser = useCallback(async () => {
    const newUser = {
      name: 'nago-local',
      email: 'potaku-local@example.com',
      password: 'mayusuki'
    }
    try {
      const res = await axios.post('http://127.0.0.1:8787/api/user', newUser)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <div className={styles.playerContainer}>
      <FileUploadArea onFileUpload={handleFilesUpload}/>
      <div id="music-info" className={styles.musicInfo}>
        <span>{currentTrackInfo.title === "" ? "曲が選ばれてないよ" : `🎵なうぷれ🎵${currentTrackInfo.title}`}</span>
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
      {currentTrackId !== null ? (
        <div className={styles.buttonContainer}>
          <button onClick={handlePrevious} className={styles.previousButton}>前の曲</button>
        <button onClick={isPlaying ? pause : play} className={styles.playPauseButton}>
          {isPlaying ? "Stop" : "Play"}
        </button>
        <button onClick={handleNext} className={styles.nextButton}>次の曲</button>
        </div>
      ) : null}
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
        <button onClick={toggleRepeatOnce} className={styles.repeatButton}>
          {isRepeat ? (
            <img className={styles.repeatIcon} src={repeatOnOnce} alt="repeat" />
          ) : (
            <img className={styles.repeatIcon} src={repeatOff} alt="repeat" />
          )}
        </button>
        <button onClick={handleGetUser} >Get User</button>
        <button onClick={handlePostUser} >Post User</button>
      </div>
      <TracksList isPlaying={isPlaying} trackInfos={tracks} currentTrackInfo={currentTrackInfo} onChange={setTrack} />
    </div>
  );
};
