import { useCallback, useEffect, useRef, useState } from "react";
import { BehaviorSubject, fromEvent } from "rxjs";

import * as styles from "./styles.css";

interface PlayerState {
  isPlaying: boolean;
  currentTrack: File | null;
  currentTime: number;
  duration: number;
}

const initialPlayerState: PlayerState = {
  isPlaying: false,
  currentTrack: null,
  currentTime: 0,
  duration: 0,
};

const playerStateSubject = new BehaviorSubject(initialPlayerState);

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElement = useRef<HTMLAudioElement>(new Audio());
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

  useEffect(() => {
    const { currentTrack, isPlaying } = playerStateSubject.value;

    if (currentTrack) {
      audioElement.current.src = URL.createObjectURL(currentTrack);

      if (isPlaying) {
        audioElement.current.play().catch(() => audioElement.current.pause());
      } else {
        audioElement.current.pause();
      }

      const timeUpdateSubscription = fromEvent(audioElement.current, "timeupdate").subscribe(() => {
        const { currentTime } = audioElement.current;
        playerStateSubject.next({ ...playerStateSubject.value, currentTime });
      });

      const loadedMetadataSubscription = fromEvent(audioElement.current, "loadedmetadata").subscribe(() => {
        const { duration } = audioElement.current;
        playerStateSubject.next({ ...playerStateSubject.value, duration });
      });

      return () => {
        timeUpdateSubscription.unsubscribe();
        loadedMetadataSubscription.unsubscribe();
      };
    }
  }, [currentTrack, isPlaying]);

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

  const handleSeekChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTime = Number(event.target.value);
    audioElement.current.currentTime = currentTime;
    playerStateSubject.next({ ...playerStateSubject.value, currentTime });
  }, []);

  const { duration, currentTime } = playerStateSubject.value;

  return (
    <div className={styles.playerContainer}>
      <label htmlFor="music-file" className={styles.fileInputLabel}>
        {currentTrackName}
      </label>
      <input id="music-file" type="file" onChange={handleFileChange} accept="audio/*" className={styles.fileInput} />
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeekChange}
        className={styles.seekBar}
      />
      <button onClick={handlePlayPauseClick} className={styles.playPauseButton} disabled={currentTrack === null}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};
