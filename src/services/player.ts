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
  saveTrack: (track: Track) => void;
  setTrack: (file: Blob) => Observable<TrackInfo>;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleRepeatOnce: () => void;
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
    pause: () => {
      audio.pause();
      isPlayingSubject.next(false);
    },
    saveTrack: (track) => {
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
      const url = URL.createObjectURL(track);
      audio.src = url;
      currentTrackSubject.next(audio);
      isPlayingSubject.next(false);

      return currentTrackSubject.pipe(
        switchMap(() =>
          fromEvent(audio, "loadedmetadata").pipe(
            take(1),
            map(() => ({
              file: track,
              url,
              title: track.name,
              duration: audio.duration,
            }))
          )
        )
      );
    },
    seek: (time) => {
      audio.currentTime = time;
      fromEvent(audio, "timeupdate").pipe(map(() => audio.currentTime));
    },
    setVolume: (volume) => {
      audio.volume = volume;
      fromEvent(audio, "volumechange").pipe(map(() => audio.volume));
      volumeSubject.next(audio.volume);
    },
    toggleRepeatOnce: () => {
      audio.loop = !audio.loop;
      fromEvent(audio, "loop").pipe(map(() => audio.loop));
      isLoopSubject.next(audio.loop);
    },
  };
};
