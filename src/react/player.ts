// src/react/player.ts

import { useEffect, useMemo, useState } from "react";
import { distinctUntilChanged } from "rxjs";

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [trackInfo, setTrackInfo] = useState<Track>({
    id: "",
    title: "",
    duration: 0,
    url: "",
  });
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const tracksSubscription = playlist.getTracks.subscribe(setTracks);
    const isPlayingSubscription = musicPlayer.getIsPlaying.pipe(distinctUntilChanged()).subscribe(setIsPlaying);
    const audioSubscription = musicPlayer.getAudio.pipe(distinctUntilChanged()).subscribe(setAudio);
    const volumeSubscription = musicPlayer.getVolume.pipe(distinctUntilChanged()).subscribe(setCurrentVolume);
    const currentTimeSubscription = musicPlayer.getCurrentTime.pipe(distinctUntilChanged()).subscribe(setCurrentTime);
    const isLoopSubscription = musicPlayer.getIsLoop.pipe(distinctUntilChanged()).subscribe(setIsRepeat);

    return () => {
      tracksSubscription.unsubscribe();
      isPlayingSubscription.unsubscribe();
      audioSubscription.unsubscribe();
      currentTimeSubscription.unsubscribe();
      volumeSubscription.unsubscribe();
      isLoopSubscription.unsubscribe();
    };
  }, [musicPlayer, playlist.getTracks]);

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

  return {
    currentTrack: audio,
    currentTime,
    currentVolume,
    isPlaying,
    isRepeat,
    tracks,
    currentTrackInfo: trackInfo,
    play,
    pause,
    setTrack: chooseTrack,
    seek,
    seekMouseDown,
    seekMouseUp,
    volume,
    toggleRepeatOnce,
    registerTrack,
  };
};
