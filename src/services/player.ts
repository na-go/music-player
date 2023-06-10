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
  getCurrentTime: () => Observable<number>;
  getIsPlaying: Observable<boolean>;
  getVolume: Observable<number>;
  setTrack: (track: Track) => Observable<TrackInfo>;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

export const createMusicPlayer = (): MusicPlayer => {
  const audio = new Audio();

  const currentTrackSubject = new BehaviorSubject<HTMLAudioElement | null>(null);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);
  const volumeSubject = new BehaviorSubject<number>(1);

  return {
    getCurrentTrack: currentTrackSubject,
    getCurrentTime: () => {
      return fromEvent(audio, "timeupdate").pipe(map(() => audio.currentTime));
    },
    getVolume: volumeSubject,
    getIsPlaying: isPlayingSubject,
    play: async () => {
      await audio.play();
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
        switchMap(() =>
          fromEvent(audio, "loadedmetadata").pipe(
            take(1),
            map(() => ({
              title: track.file.name,
              duration: audio.duration,
            }))
          )
        )
      );
    },
    seek: (time) => {
      audio.currentTime = time;
      fromEvent(audio, "timeupdate").pipe(map(() => audio.currentTime))
    },
    setVolume: (volume) => {
      audio.volume = volume;
      fromEvent(audio, "volumechange").pipe(map(() => audio.volume))
      volumeSubject.next(audio.volume);
    }
  };
};
