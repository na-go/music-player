import { BehaviorSubject, type Observable } from "rxjs";

export interface Track {
  file: Blob;
}

export interface MusicPlayer {
  getCurrentTrack: Observable<Track | null>;
  getIsPlaying: Observable<boolean>;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
	setTrack: (track: Track) => void;
}

export const createMusicPlayer = (): MusicPlayer => {
  const audioElement = new Audio();

  const currentTrackSubject = new BehaviorSubject<Track | null>(null);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  return {
    getCurrentTrack: currentTrackSubject.asObservable(),
    getIsPlaying: isPlayingSubject.asObservable(),
    playTrack: (track) => {
      const url = URL.createObjectURL(track.file);
      audioElement.src = url;
      void audioElement.play().then(() => {
        currentTrackSubject.next(track);
        isPlayingSubject.next(true);
      });
    },
    pauseTrack: () => {
      audioElement.pause();
      isPlayingSubject.next(false);
    },
		setTrack: (track) => {
			currentTrackSubject.next({ file: track.file });
		}
  };
};
