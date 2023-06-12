// src/react/player.ts

import { useEffect, useMemo, useState } from "react";
import { distinctUntilChanged } from "rxjs";

import { createMusicPlayer } from "@services/player";

import type { MusicPlayer, Track, TrackInfo } from "@services/player";

interface MusicPlayerState {
  currentTrack: HTMLAudioElement | null;
  currentTime: number;
  currentTrackInfo: TrackInfo;
  isPlaying: boolean;
  isRepeat: boolean;
  currentVolume: number;
  tracks: TrackInfo[];
  play: () => Promise<void>;
  pause: () => void;
  setTrack: (track: Blob) => void;
  seek: (time: number) => void;
  seekMouseDown: () => void;
  seekMouseUp: () => Promise<void>;
  volume: (volume: number) => void;
  toggleRepeatOnce: () => void;
  registerTrack: (track: Track) => void;
}

let player: MusicPlayer | null = null;

const createSingletonPlayer = (): MusicPlayer => {
  if (!player) {
    player = createMusicPlayer();
  }

  return player;
};

export const useMusicPlayer = (): MusicPlayerState => {
  const initialTrackInfo: TrackInfo = useMemo(
    () => ({
      file: new Blob(),
      url: "",
      title: "",
      duration: 0,
    }),
    []
  );

  const musicPlayer = useMemo(() => createSingletonPlayer(), []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [beforeIsPlaying, setBeforeIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [track, setTrack] = useState<HTMLAudioElement | null>(null);
  const [trackInfo, setTrackInfo] = useState<TrackInfo>(initialTrackInfo);
  const [tracks, setTracks] = useState<TrackInfo[]>([]);

  useEffect(() => {
    const tracksSubscription = musicPlayer.getTracks.subscribe(setTracks);
    const isPlayingSubscription = musicPlayer.getIsPlaying.pipe(distinctUntilChanged()).subscribe(setIsPlaying);
    const trackSubscription = musicPlayer.getCurrentTrack.pipe(distinctUntilChanged()).subscribe(setTrack);
    const volumeSubscription = musicPlayer.getVolume.pipe(distinctUntilChanged()).subscribe(setCurrentVolume);
    const currentTimeSubscription = musicPlayer.getCurrentTime().pipe(distinctUntilChanged()).subscribe(setCurrentTime);
    const isLoopSubscription = musicPlayer.getIsLoop.pipe(distinctUntilChanged()).subscribe(setIsRepeat);

    return () => {
      tracksSubscription.unsubscribe();
      isPlayingSubscription.unsubscribe();
      trackSubscription.unsubscribe();
      currentTimeSubscription.unsubscribe();
      volumeSubscription.unsubscribe();
      isLoopSubscription.unsubscribe();
    };
  }, [musicPlayer]);

  const play = async () => {
    if (track) {
      await musicPlayer.play();
    }
  };

  const pause = () => {
    musicPlayer.pause();
  };

  const chooseTrack = (track: Blob) => {
    musicPlayer.setTrack(track).subscribe(setTrackInfo);
  };

  const seek = (time: number) => {
    musicPlayer.seek(time);
  };

  const seekMouseDown = () => {
    setBeforeIsPlaying(isPlaying);
    musicPlayer.pause();
  };

  const seekMouseUp = async () => {
    if (beforeIsPlaying) await musicPlayer.play();
  };

  const volume = (volume: number) => {
    musicPlayer.setVolume(volume);
  };

  const toggleRepeatOnce = () => {
    musicPlayer.toggleRepeatOnce();
  };

  const registerTrack = (track: Track) => {
    musicPlayer.setTrack(track.file).subscribe(setTrackInfo);
    musicPlayer.saveTrack(track);
  };

  return {
    currentTrack: track,
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
