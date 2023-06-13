// src/react/player.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { distinctUntilChanged, firstValueFrom } from "rxjs";

import { createMusicPlayer } from "@services/player";
import { createPlaylist, type Playlist } from "@services/playlist";

import type { MusicPlayer } from "@services/player";
import type { Track } from "@services/types";

interface MusicPlayerState {
  currentTrack: HTMLAudioElement | null;
  currentTime: number;
  currentTrackInfo: Track;
  isPlaying: boolean;
  isRepeat: boolean;
  currentVolume: number;
  currentTrackId: string | null;
  tracks: Track[];
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setTrack: (id: string) => Promise<void>;
  seek: (time: number) => Promise<void>;
  seekMouseDown: () => Promise<void>;
  seekMouseUp: () => Promise<void>;
  volume: (volume: number) => Promise<void>;
  toggleRepeatOnce: () => Promise<void>;
  registerTrack: (file: Blob) => Promise<void>;
  nextTrack: (currentId:string) => Promise<void>;
  prevTrack: (currentId:string) => Promise<void>;
}

let player: MusicPlayer | null = null;
let playlist: Playlist | null = null;

const createSingletonPlayer = (playlist: Playlist): MusicPlayer => {
  if (!player) {
    player = createMusicPlayer(playlist);
  }

  return player;
};

const createSingletonPlaylist = (): Playlist => {
  if (!playlist) {
    playlist = createPlaylist();
  }

  return playlist;
}

export const useMusicPlayer = (): MusicPlayerState => {

  const playlist = useMemo(() => createSingletonPlaylist(), []);
  const musicPlayer = useMemo(() => createSingletonPlayer(playlist), [playlist]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [beforeIsPlaying, setBeforeIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [trackInfo, setTrackInfo] = useState<Track>({
    id: "",
    title: "",
    duration: 0,
    url: "",
  });
  const [tracks, setTracks] = useState<Track[]>([]);

  const play = async () => {
    if (audio) {
      await musicPlayer.play();
    }
  };

  const pause = async () => {
    await musicPlayer.pause();
  };

  const chooseTrack = async (id: string) => {
    await musicPlayer.setTrack(id);
    const track = playlist.getTrack(id);
    track.subscribe(setTrackInfo);
  };

  const seek = async (time: number) => {
    await musicPlayer.seek(time);
  };

  const seekMouseDown = async () => {
    setBeforeIsPlaying(isPlaying);
    await musicPlayer.pause();
  };

  const seekMouseUp = async () => {
    if (beforeIsPlaying) await musicPlayer.play();
  };

  const volume = async (volume: number) => {
    await musicPlayer.setVolume(volume);
  };

  const toggleRepeatOnce = async () => {
    await musicPlayer.toggleRepeatOnce();
  };

  const registerTrack = async (file: Blob) => {
    await playlist.appendTrack(file);
  };

  const nextTrack = useCallback(async (currentId:string) => {
    await musicPlayer.next(currentId);
    const nextTrackId = await firstValueFrom(musicPlayer.getCurrentId);
    if (nextTrackId !== null) {
      const track = await firstValueFrom(playlist.getTrack(nextTrackId));
      setTrackInfo(track);
    }
  }, [musicPlayer, playlist]);

  const prevTrack = async (currentId:string) => {
    await musicPlayer.prev(currentId);
    const prevTrackId = await firstValueFrom(musicPlayer.getCurrentId);
    if (prevTrackId !== null) {
      const track = await firstValueFrom(playlist.getTrack(prevTrackId));
      setTrackInfo(track);
    }
  };

  useEffect(() => {
    const tracksSubscription = playlist.getTracks.subscribe(setTracks);
    const isPlayingSubscription = musicPlayer.getIsPlaying.pipe(distinctUntilChanged()).subscribe(setIsPlaying);
    const audioSubscription = musicPlayer.getAudio.pipe(distinctUntilChanged()).subscribe(setAudio);
    const volumeSubscription = musicPlayer.getVolume.pipe(distinctUntilChanged()).subscribe(setCurrentVolume);
    const currentTimeSubscription = musicPlayer.getCurrentTime.pipe(distinctUntilChanged()).subscribe(setCurrentTime);
    const isLoopSubscription = musicPlayer.getIsLoop.pipe(distinctUntilChanged()).subscribe(setIsRepeat);
    const currentIdSubscription = musicPlayer.getCurrentId.pipe(distinctUntilChanged()).subscribe(setCurrentTrackId);

    return () => {
      tracksSubscription.unsubscribe();
      isPlayingSubscription.unsubscribe();
      audioSubscription.unsubscribe();
      currentTimeSubscription.unsubscribe();
      volumeSubscription.unsubscribe();
      isLoopSubscription.unsubscribe();
      currentIdSubscription.unsubscribe();
    };
  }, [audio, currentTrackId, musicPlayer, nextTrack, playlist.getTracks]);

  // ?: useEffect使わなくても終わり時間を監視できればできそうじゃないか？
  useEffect(() => {
    if (isPlaying) {
      const checkEnd = setInterval(async () => {
        const audio = await firstValueFrom(musicPlayer.getAudio);
        if (!audio) return;
        if (audio.currentTime >= audio.duration) {
          if (currentTrackId === null) return;
          await nextTrack(currentTrackId);
        }
      }, 1000);

      return () => {
        clearInterval(checkEnd);
      };
    }
  }, [isPlaying, musicPlayer, currentTrackId, nextTrack]);


  return {
    currentTrack: audio,
    currentTime,
    currentVolume,
    isPlaying,
    isRepeat,
    tracks,
    currentTrackInfo: trackInfo,
    currentTrackId,
    play,
    pause,
    setTrack: chooseTrack,
    seek,
    seekMouseDown,
    seekMouseUp,
    volume,
    toggleRepeatOnce,
    registerTrack,
    nextTrack,
    prevTrack,
  };
};
