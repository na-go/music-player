import { useCallback, useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

import * as styles from "./styles.css";

interface PlayerState {
  isPlaying: boolean;
  currentTrack: File | null;
}

const initialPlayerState: PlayerState = {
  isPlaying: false,
  currentTrack: null,
};

const playerStateSubject = new BehaviorSubject(initialPlayerState);

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<File | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTrackName, setCurrentTrackName] = useState<string>("Select Music"); // ここを追加

  useEffect(() => {
    const subscription = playerStateSubject.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.currentTrack);
      if (state.currentTrack) {
        const audioEl = new Audio(URL.createObjectURL(state.currentTrack));
        setAudio(audioEl);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePlayPauseClick = useCallback(async () => {
    if (audio) {
      if (!isPlaying) {
        await audio.play();
      } else {
        audio.pause();
      }
      playerStateSubject.next({ ...playerStateSubject.value, isPlaying: !isPlaying });
    }
  }, [audio, isPlaying]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      playerStateSubject.next({ ...playerStateSubject.value, currentTrack: file });
      setCurrentTrackName(file.name);
    }
  }, []);

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        {currentTrackName}
      </label>
      <input id="music-file" type="file" onChange={handleFileChange} accept="audio/*" className={styles.fileInput} />
      <button onClick={handlePlayPauseClick} className={styles.playPauseButton} disabled={currentTrack === null}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};
