// src/react/player.ts

import { useEffect, useState } from "react";

import { createMusicPlayer } from "@services/player";

import type { MusicPlayer, Track } from "@services/player";

interface MusicPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  chooseTrack: (track: Track) => void;
}

export const useMusicPlayer = (): MusicPlayerState => {
  // TODO: RxJSで実装する
  const [musicPlayer, setMusicPlayer] = useState<MusicPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [track, setTrack] = useState<Track | null>(null);


  useEffect(() => {
    const player = createMusicPlayer();
    setMusicPlayer(player);

    const subscription = player.getIsPlaying.subscribe(setIsPlaying);
    const trackSubscription = player.getCurrentTrack.subscribe(setTrack);

    return () => {
      subscription.unsubscribe();
      trackSubscription.unsubscribe();
      player.pause();
    };
  }, []);

  const play = () => {
    if (musicPlayer && track) {
      musicPlayer.play(track);
    }
  };

  const pause = () => {
    if (musicPlayer) {
      musicPlayer.pause();
    }
  };

  const chooseTrack = (track: Track) => {
    if (musicPlayer) {
      musicPlayer.setTrack(track);
    }
  };

  return { currentTrack: track, isPlaying, play, pause, chooseTrack };
};
