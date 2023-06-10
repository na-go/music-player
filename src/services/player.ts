import { BehaviorSubject, type Observable } from "rxjs";

export interface Track {
  file: Blob;
}

export interface MusicPlayer {
  getCurrentTrack: Observable<Track | null>;
  getIsPlaying: Observable<boolean>;
  play: (track: Track) => void;
  pause: () => void;
	setTrack: (track: Track) => void;
}

export const createMusicPlayer = (): MusicPlayer => {
  const audioElement = new Audio();

  const currentTrackSubject = new BehaviorSubject<Track | null>(null);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  return {
    getCurrentTrack: currentTrackSubject,
    getIsPlaying: isPlayingSubject,
    play: (track) => {
      const url = URL.createObjectURL(track.file);
      audioElement.src = url;
      void audioElement.play().then(() => {
        currentTrackSubject.next(track);
        isPlayingSubject.next(true);
      });
    },
    pause: () => {
      audioElement.pause();
      isPlayingSubject.next(false);
    },
		setTrack: (track) => {
			currentTrackSubject.next({ file: track.file });
		},
  };
};
