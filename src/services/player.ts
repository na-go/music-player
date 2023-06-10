import { BehaviorSubject, fromEvent, take, type Observable, switchMap, map } from "rxjs";

export interface Track {
  file: Blob;
}

export interface TrackInfo {
  title: string;
  duration: number;
}

export interface MusicPlayer {
  getCurrentTrack: Observable<HTMLAudioElement | null>;
  getCurrentTIme: () => Observable<number>;
  getIsPlaying: Observable<boolean>;
  play: () => void;
  pause: () => void;
	setTrack: (track: Track) => Observable<TrackInfo>;
}

export const createMusicPlayer = (): MusicPlayer => {
  const audio = new Audio();

  const currentTrackSubject = new BehaviorSubject<HTMLAudioElement | null>(null);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);

  return {
    getCurrentTrack: currentTrackSubject,
    getCurrentTIme: () => {
      return fromEvent(audio, "timeupdate").pipe(
        map(() => audio.currentTime),
      );
    },
    getIsPlaying: isPlayingSubject,
    play: async () => {
      await audio.play()
      isPlayingSubject.next(true);
    },
    pause: () => {
      audio.pause();
      isPlayingSubject.next(false);
    },
		setTrack: (track) => {
      const url = URL.createObjectURL(track.file);
      audio.src = url;
			currentTrackSubject.next(audio);
      isPlayingSubject.next(false);

      return currentTrackSubject.pipe(
      switchMap(() => fromEvent(audio, "loadedmetadata").pipe(
        take(1),
        map(() => ({
          title: track.file.name,
          duration: audio.duration,
        }))
      ))
    )
		},
  };
};
