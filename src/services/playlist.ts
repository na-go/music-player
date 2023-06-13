import { BehaviorSubject, filter, map } from "rxjs";

import { createTrackFromBlob } from "@utils/services/generate-track-from-blob";

import type { Track } from "./types";
import type { Observable } from "rxjs";

export interface Playlist {
  getTracks: Observable<Track[]>;
  getTrack: (id: string) => Observable<Track>;
  appendTrack: (file: Blob) => Promise<void>; // fileからtrackを作成して追加する
  removeTrack: (id: string) => Promise<void>;
  updateTrack: (id: string, track: Track) => Promise<void>;
}

export const createPlaylist = (): Playlist => {
  const tracksSubject = new BehaviorSubject<Track[]>([]);

  return {
    getTracks: tracksSubject,
    getTrack: (id) => {
      const track = tracksSubject.pipe(
        map((tracks) => tracks.find((track) => track.id === id)),
        filter((track): track is Track => track !== undefined)
      );

      return track;
    },
    appendTrack: async (file: Blob) => {
      const track: Track = await createTrackFromBlob(file);
      if (tracksSubject.value.find((t) => t.title === track.title)) return
      tracksSubject.next([...tracksSubject.value, track]);
    },

    removeTrack: async (id: string) => {
      tracksSubject.next(tracksSubject.value.filter((track) => track.id !== id));
    },

    updateTrack: async (id: string, updatedTrack: Track) => {
      const tracks = tracksSubject.value;
      const trackIndex = tracks.findIndex((track) => track.id === id);
      if (trackIndex !== -1) {
        tracks[trackIndex] = updatedTrack;
        tracksSubject.next([...tracks]);
      }
    },
  };
};
