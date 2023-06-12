// src/react/player.ts

import { useEffect, useMemo, useState } from "react";
import { distinctUntilChanged } from "rxjs";

import { createMusicPlayer } from "@services/player";

import type { MusicPlayer, TrackInfo } from "@services/player";

interface MusicPlayerState {
  currentTrack: HTMLAudioElement | null;
  currentTime: number;
  currentTrackInfo: TrackInfo;
  isPlaying: boolean;
  currentVolume: number;
  play: () => Promise<void>;
  pause: () => void;
  chooseTrack: (track: Blob) => void;
  seek: (time: number) => void;
  seekMouseDown: () => void;
  seekMouseUp: () => Promise<void>;
  volume: (volume: number) => void
}

let player: MusicPlayer | null = null;

const createSingletonPlayer = (): MusicPlayer => {
  if (!player) {
    player = createMusicPlayer();
  }

  return player;
}

export const useMusicPlayer = (): MusicPlayerState => {
  const initialTrackInfo: TrackInfo = useMemo(() => ({
    title: "",
    duration: 0,
  }), []);

  const musicPlayer = createSingletonPlayer();

  const [isPlaying, setIsPlaying] = useState(false);
  const [beforeIsPlaying, setBeforeIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [track, setTrack] = useState<HTMLAudioElement | null>(null);
  const [trackInfo, setTrackInfo] = useState<TrackInfo>(initialTrackInfo);

  useEffect(() => {

    const subscription = musicPlayer.getIsPlaying.subscribe(setIsPlaying);
    const trackSubscription = musicPlayer.getCurrentTrack.pipe(distinctUntilChanged()).subscribe((currentTrack) => {
      setTrack(currentTrack);
    });
    const volumeSubscription = musicPlayer.getVolume.subscribe(setCurrentVolume);

    const currentTimeSubscription = musicPlayer.getCurrentTime().subscribe(setCurrentTime);

    return () => {
      subscription.unsubscribe();
      trackSubscription.unsubscribe();
      musicPlayer.pause();
      currentTimeSubscription.unsubscribe();
      volumeSubscription.unsubscribe();
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
  }

  const seekMouseUp = async () => {
      if(beforeIsPlaying) await musicPlayer.play();
  }

  const volume = (volume: number) => {
      musicPlayer.setVolume(volume);
  }

  return { currentTrack: track, currentTime, currentVolume, isPlaying, currentTrackInfo: trackInfo, play, pause, chooseTrack, seek, seekMouseDown, seekMouseUp, volume };
};
