
import { generateId } from "./generate-id";

import type { Track } from "@services/types";

const context = new (window.AudioContext)();

export const createTrackFromBlob = async (file: Blob): Promise<Track> => {
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);

  const track: Track = {
    id: generateId(), // 何らかの形でユニークなIDを生成する
    title: file.name, // メタデータから取得するかユーザーに入力させる
    duration: audioBuffer.duration,
    url: URL.createObjectURL(file),
  };

  return track;
};