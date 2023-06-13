import { BehaviorSubject, fromEvent, take, type Observable, switchMap, map, filter } from "rxjs";

export interface Track {
  file: Blob;
}

export interface TrackInfo extends Track {
  url: string;
  title: string;
  duration: number;
}

export interface MusicPlayer {
  getCurrentTrack: Observable<HTMLAudioElement | null>;
  getCurrentTime: () => Observable<number>;
  getIsPlaying: Observable<boolean>;
  getVolume: Observable<number>;
  getIsLoop: Observable<boolean>;
  getTracks: Observable<TrackInfo[]>;
  appendTrack: (track: Track) => Promise<void>;
  setTrack: (track: Track) => Observable<TrackInfo>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleRepeatOnce: () => Promise<void>;
}

export const createMusicPlayer = (): MusicPlayer => {
  const audio = new Audio();

  const currentTrackSubject = new BehaviorSubject<HTMLAudioElement | null>(null);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);
  const isLoopSubject = new BehaviorSubject<boolean>(false);
  const volumeSubject = new BehaviorSubject<number>(1);
  const tracksSubject = new BehaviorSubject<TrackInfo[]>([]);

  return {
    getCurrentTrack: currentTrackSubject,
    getCurrentTime: () => {
      return fromEvent(audio, "timeupdate").pipe(map(() => audio.currentTime));
    },
    getVolume: volumeSubject,
    getIsPlaying: isPlayingSubject,
    getIsLoop: isLoopSubject,
    getTracks: tracksSubject,
    play: async () => {
      await audio.play();
      isPlayingSubject.next(true);
    },
    pause: async () => {
      audio.pause();
      isPlayingSubject.next(false);
    },
    appendTrack: async (track) => {
      const url = URL.createObjectURL(track.file);
      audio.src = url;
      currentTrackSubject.next(audio);
      isPlayingSubject.next(false);

      fromEvent(audio, "loadedmetadata")
        .pipe(
          take(1),
          filter(() => tracksSubject.value.every((trackInfo) => trackInfo.file.name !== track.file.name)),
          map(() => ({
            file: track.file,
            url,
            title: track.file.name,
            duration: audio.duration,
          }))
        )
        .subscribe((trackInfo) => {
          tracksSubject.next([...tracksSubject.value, trackInfo]);
        });
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
              file: track.file,
              url,
              title: track.file.name,
              duration: audio.duration,
            }))
          )
        )
      );
    },
    seek: async (time) => {
      audio.currentTime = time;
    },
    setVolume: async (volume) => {
      audio.volume = volume;
      volumeSubject.next(audio.volume);
    },
    toggleRepeatOnce: async () => {
      audio.loop = !audio.loop;
      isLoopSubject.next(audio.loop);
    },
  };
};
