import { useCallback, useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

import * as styles from './styles.css';

const playerStateSubject = new BehaviorSubject({
  isPlaying: false,
  currentTrack: null as File | null,
});

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<File | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // BehaviorSubjectからの新しい値を購読
    const subscription = playerStateSubject.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.currentTrack);
      if(state.currentTrack) {
        const audioEl = new Audio(URL.createObjectURL(state.currentTrack));
        setAudio(audioEl);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePlayPauseClick = useCallback(async() => {
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
    if (event.target.files) {
      const file = event.target.files[0];
      playerStateSubject.next({ currentTrack: file, isPlaying: false });
    }
  }, []);

  return (
      <div className={styles.playerContainer}>
    <label htmlFor="music-file" className={styles.fileInputLabel}>
      Select Music
    </label>
    <input
      id="music-file"
      type="file"
      onChange={handleFileChange}
      accept="audio/*"
      className={styles.fileInput}
    />
    <button
      onClick={handlePlayPauseClick}
      className={styles.playPauseButton}
      disabled={currentTrack === null}
    >
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  </div>
  );
};
