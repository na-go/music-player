import { BehaviorSubject, type Observable, map, fromEvent } from "rxjs";

import type { Playlist } from "./playlist";
import type { Track } from "./types";

export interface MusicPlayer {
  getAudio: Observable<HTMLAudioElement | null>;
  getCurrentTime: Observable<number>;
  getIsPlaying: Observable<boolean>;
  getVolume: Observable<number>;
  getIsLoop: Observable<boolean>;
  setTrack: (id: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleRepeatOnce: () => Promise<void>;
}

export const createMusicPlayer = (playlist: Playlist): MusicPlayer => {
  const audio = new Audio();

  const audioSubject = new BehaviorSubject<HTMLAudioElement | null>(null);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);
  const isLoopSubject = new BehaviorSubject<boolean>(false);
  const volumeSubject = new BehaviorSubject<number>(1);
  const tracksSubject = new BehaviorSubject<Track[]>([]);

  return {
    getAudio: audioSubject,
    getCurrentTime: fromEvent(audio, "timeupdate").pipe(map(() => audio.currentTime)),
    getVolume: volumeSubject,
    getIsPlaying: isPlayingSubject,
    getIsLoop: isLoopSubject,

    setTrack: async (id: string) => {
      const track = playlist.getTrack(id);
      track.pipe(map((track) => track.url)).subscribe((url) => {
        audio.src = url;
      });
      audioSubject.next(audio);
      isPlayingSubject.next(false);
    },

    play: async () => {
      await audio.play();
      isPlayingSubject.next(true);
    },
    pause: async () => {
      audio.pause();
      isPlayingSubject.next(false);
    },

    seek: async (time: number) => {
      audio.currentTime = time;
    },
    setVolume: async (volume: number) => {
      audio.volume = volume;
      volumeSubject.next(volume);
    },
    toggleRepeatOnce: async () => {
      audio.loop = !audio.loop;
      isLoopSubject.next(audio.loop);
    },
  };
};
