import { BehaviorSubject, type Observable, map, fromEvent, firstValueFrom } from "rxjs";

import type { Playlist } from "./playlist";
import type { Track } from "./types";

export interface MusicPlayer {
  getAudio: Observable<HTMLAudioElement | null>;
  getCurrentTime: Observable<number>;
  getIsPlaying: Observable<boolean>;
  getVolume: Observable<number>;
  getIsLoop: Observable<boolean>;
  getCurrentId: Observable<string | null>;
  setTrack: (id: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  next: (currentId: string) => Promise<void>;
  prev: (currentId: string) => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleRepeatOnce: () => Promise<void>;
}

export const createMusicPlayer = (playlist: Playlist): MusicPlayer => {
  // FIXME: 二重管理やめる
  // FIXME: DIしたい
  const audio = new Audio();

  const audioSubject = new BehaviorSubject<HTMLAudioElement | null>(null);
  const isPlayingSubject = new BehaviorSubject<boolean>(false);
  const isLoopSubject = new BehaviorSubject<boolean>(false);
  const volumeSubject = new BehaviorSubject<number>(1);
  const currentTrackIdSubject = new BehaviorSubject<string | null>(null);

  return {
    getAudio: audioSubject,
    getCurrentTime: fromEvent(audio, "timeupdate").pipe(map(() => audio.currentTime)),
    getVolume: volumeSubject,
    getIsPlaying: isPlayingSubject,
    getIsLoop: isLoopSubject,
    getCurrentId: currentTrackIdSubject,

    setTrack: async (id: string) => {
      const track = playlist.getTrack(id);
      track.pipe(map((track) => track.url)).subscribe((url) => {
        audio.src = url;
      });
      audioSubject.next(audio);
      isPlayingSubject.next(false);
      currentTrackIdSubject.next(id);
    },

    play: async () => {
      await audio.play();
      isPlayingSubject.next(true);
    },
    pause: async () => {
      audio.pause();
      isPlayingSubject.next(false);
    },
    next: async (currentId: string) => {
      const tracks = await firstValueFrom(playlist.getTracks);
      const trackIndex = tracks.findIndex((track) => track.id === currentId);
      const nextTrack: Track | undefined = tracks[trackIndex + 1];
      // nextTrackがない可能性があり、undefinedになるので以下を無視
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (nextTrack === undefined) {
        audio.pause()
        isPlayingSubject.next(false);

        return
      }

      audio.src = nextTrack.url;
      await audio.play()
      audioSubject.next(audio);
      isPlayingSubject.next(true);
      currentTrackIdSubject.next(nextTrack.id);
    },
    prev: async (currentId: string) => {
      const tracks = await firstValueFrom(playlist.getTracks);
      const trackIndex = tracks.findIndex((track) => track.id === currentId);
      const prevTrack = tracks[trackIndex - 1];
      // prevTrackがない可能性があり、undefinedになるので以下を無視
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (prevTrack === undefined) {
        audio.pause()
        isPlayingSubject.next(false);

        return
      }
      audio.src = prevTrack.url;
      await audio.play()
      audioSubject.next(audio);
      isPlayingSubject.next(true);
      currentTrackIdSubject.next(prevTrack.id);
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
