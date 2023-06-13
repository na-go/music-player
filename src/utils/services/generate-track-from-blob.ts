
import { generateId } from "./generate-id";

import type { Track } from "@services/types";

const context = new (window.AudioContext)();

export const createTrackFromBlob = async (file: Blob): Promise<Track> => {
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);

  const track: Track = {
    id: generateId(),
    title: file.name,
    duration: audioBuffer.duration,
    url: URL.createObjectURL(file),
  };

  return track;
};