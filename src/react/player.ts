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
  play: () => void;
  pause: () => void;
  chooseTrack: (track: Track) => void;
}

export const useMusicPlayer = (): MusicPlayerState => {
  const initialTrackInfo: TrackInfo = {
    title: "",
    duration: 0,
  }
  const [musicPlayer, setMusicPlayer] = useState<MusicPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [track, setTrack] = useState<HTMLAudioElement | null>(null);
  const [trackInfo, setTrackInfo] = useState<TrackInfo>(initialTrackInfo);

  useEffect(() => {
    const player = createMusicPlayer();
    setMusicPlayer(player);

    const subscription = player.getIsPlaying.subscribe(setIsPlaying);
    const trackSubscription = player.getCurrentTrack.pipe(
      distinctUntilChanged(),
    ).subscribe((currentTrack) => {
      setTrack(currentTrack);
    });

    const currentTimeSubscription = player.getCurrentTIme().subscribe(setCurrentTime);

    return () => {
      subscription.unsubscribe();
      trackSubscription.unsubscribe();
      player.pause();
      currentTimeSubscription.unsubscribe();
    };
  }, []);

  const play = () => {
    if (musicPlayer && track) {
      musicPlayer.play();
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

  return { currentTrack: track, currentTime, isPlaying, currentTrackInfo:trackInfo ,play, pause, chooseTrack };
};
