import { useCallback, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";

interface UseAudioPlayer {
  isPlaying$: BehaviorSubject<boolean>;
  handleFileChange: (file: File) => void;
}

export const useAudioPlayer = (): UseAudioPlayer => {
  const [_, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying$ = useRef(new BehaviorSubject(false)).current;

  isPlaying$.subscribe((isPlaying: boolean) => {
    if (audioRef.current) {
      if (isPlaying) {
        void audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  });

  const handleFileChange = useCallback((file: File) => {
    setAudioFile(file);
    if (audioRef.current) {
      URL.revokeObjectURL(audioRef.current.src);
    }
    audioRef.current = new Audio(URL.createObjectURL(file));
  }, []);

  return {
    isPlaying$,
    handleFileChange,
  };
};
