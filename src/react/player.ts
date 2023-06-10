// src/react/player.ts

import { useEffect, useState } from "react";
import { distinctUntilChanged } from "rxjs";

import { createMusicPlayer } from "@services/player";

import type { MusicPlayer, Track, TrackInfo } from "@services/player";

interface MusicPlayerState {
  currentTrack: HTMLAudioElement | null;
  currentTime: number;
  currentTrackInfo: TrackInfo;
  isPlaying: boolean;
  currentVolume: number;
  play: () => Promise<void>;
  pause: () => void;
  chooseTrack: (track: Track) => void;
  seek: (time: number) => void;
  seekMouseDown: () => void;
  seekMouseUp: () => Promise<void>;
  volume: (volume: number) => void
}

export const useMusicPlayer = (): MusicPlayerState => {
  const initialTrackInfo: TrackInfo = {
    title: "",
    duration: 0,
  };
  const [musicPlayer, setMusicPlayer] = useState<MusicPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beforeIsPlaying, setBeforeIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [track, setTrack] = useState<HTMLAudioElement | null>(null);
  const [trackInfo, setTrackInfo] = useState<TrackInfo>(initialTrackInfo);

  // TODO: シングルトンパターンを読んでリファクタリングする
  useEffect(() => {
    const player = createMusicPlayer();
    setMusicPlayer(player);

    const subscription = player.getIsPlaying.subscribe(setIsPlaying);
    const trackSubscription = player.getCurrentTrack.pipe(distinctUntilChanged()).subscribe((currentTrack) => {
      setTrack(currentTrack);
    });
    const volumeSubscription = player.getVolume.subscribe(setCurrentVolume);

    const currentTimeSubscription = player.getCurrentTime().subscribe(setCurrentTime);

    return () => {
      subscription.unsubscribe();
      trackSubscription.unsubscribe();
      player.pause();
      currentTimeSubscription.unsubscribe();
      volumeSubscription.unsubscribe();
    };
  }, []);

  const play = async () => {
    if (musicPlayer && track) {
      await musicPlayer.play();
    }
  };

  const pause = () => {
    if (musicPlayer) {
      musicPlayer.pause();
    }
  };

  const chooseTrack = (track: Track) => {
    if (musicPlayer) {
      musicPlayer.setTrack(track).subscribe(setTrackInfo);
    }
  };

  const seek = (time: number) => {
    if (musicPlayer) {
      musicPlayer.seek(time);
    }
  };

  const seekMouseDown = () => {
    if (musicPlayer) {
      setBeforeIsPlaying(isPlaying);
      musicPlayer.pause();
    }
  }

  const seekMouseUp = async () => {
    if (musicPlayer) {
      if(beforeIsPlaying) await musicPlayer.play();
    }
  }

  const volume = (volume: number) => {
    if (musicPlayer) {
      musicPlayer.setVolume(volume);
    }
  }

  return { currentTrack: track, currentTime, currentVolume, isPlaying, currentTrackInfo: trackInfo, play, pause, chooseTrack, seek, seekMouseDown, seekMouseUp, volume };
};
